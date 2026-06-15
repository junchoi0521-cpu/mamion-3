import crypto from 'node:crypto';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxluQ98Wg3VrkopnN0i9ffTzwWJRrShqSOe9GqbWJ3rOltHgWtRyflaiKWHWE-MCVyCsg/exec';
const SOLAPI_SEND_URL = 'https://api.solapi.com/messages/v4/send';

const isEnabled = (value) => String(value || '').toLowerCase() === 'true';

const normalizePhone = (value) => String(value || '').replace(/[^0-9]/g, '');

const parseAppsScriptResponse = (text) => {
  const trimmed = String(text || '').trim();
  if (!trimmed) return {};

  try {
    return JSON.parse(trimmed);
  } catch {}

  const jsonpMatch = trimmed.match(/^[^(]+\(([\s\S]*)\);?$/);
  if (!jsonpMatch) return {};
  try {
    return JSON.parse(jsonpMatch[1]);
  } catch {
    return {};
  }
};

const callAppsScript = async (action, data) => {
  const params = new URLSearchParams({
    action,
    data: JSON.stringify(data || {}),
  });

  const response = await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`);
  const text = await response.text();
  if (!response.ok) throw new Error(`Apps Script ${action} failed: ${response.status}`);
  return parseAppsScriptResponse(text);
};

const createSolapiAuthorization = () => {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  if (!apiKey || !apiSecret) throw new Error('SOLAPI_API_KEY or SOLAPI_API_SECRET is missing');

  const date = new Date().toISOString();
  const salt = crypto.randomUUID().replace(/-/g, '');
  const signature = crypto.createHmac('sha256', apiSecret).update(date + salt).digest('hex');

  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
};

const summarizeSolapiResponse = (payload) => {
  if (!payload || typeof payload !== 'object') return String(payload || '').slice(0, 500);

  const summary = {
    groupId: payload.groupId,
    messageId: payload.messageId,
    statusCode: payload.statusCode,
    statusMessage: payload.statusMessage,
    count: payload.count,
  };

  return JSON.stringify(summary).replace(/undefined/g, '').slice(0, 500);
};

const recordAlimtalkResult = async ({ token, sentAt, status, result, error }) => {
  if (!token) return;

  try {
    await callAppsScript('alimtalkResult', {
      token,
      '알림톡 발송 여부': status,
      '알림톡 발송 시간': sentAt,
      '알림톡 발송 결과': result || '',
      '알림톡 실패 사유': error || '',
    });
  } catch (recordError) {
    console.error('Failed to record alimtalk result:', recordError);
  }
};

const sendAlimtalk = async ({ name, phone, token }) => {
  const sentAt = new Date().toISOString();

  if (!isEnabled(process.env.ALIMTALK_ENABLED)) {
    await recordAlimtalkResult({
      token,
      sentAt,
      status: '건너뜀',
      result: 'ALIMTALK_ENABLED is not true',
      error: '',
    });
    return { skipped: true };
  }

  const to = isEnabled(process.env.ALIMTALK_TEST_MODE)
    ? normalizePhone(process.env.ALIMTALK_TEST_PHONE)
    : normalizePhone(phone);

  if (!to) throw new Error('알림톡 수신 번호가 없습니다.');
  if (!process.env.SOLAPI_PF_ID) throw new Error('SOLAPI_PF_ID is missing');
  if (!process.env.KAKAO_TEMPLATE_ID) throw new Error('KAKAO_TEMPLATE_ID is missing');
  if (!process.env.SOLAPI_SENDER_NUMBER) throw new Error('SOLAPI_SENDER_NUMBER is missing');

  const response = await fetch(SOLAPI_SEND_URL, {
    method: 'POST',
    headers: {
      Authorization: createSolapiAuthorization(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        to,
        from: normalizePhone(process.env.SOLAPI_SENDER_NUMBER),
        kakaoOptions: {
          pfId: process.env.SOLAPI_PF_ID,
          templateId: process.env.KAKAO_TEMPLATE_ID,
          variables: {
            '#{이름}': String(name || '').trim(),
            '#{신청토큰}': String(token || '').trim(),
          },
        },
      },
    }),
  });

  const text = await response.text();
  let payload = text;
  try {
    payload = JSON.parse(text);
  } catch {}

  if (!response.ok) {
    const errorMessage = typeof payload === 'string'
      ? payload
      : payload?.message || payload?.errorMessage || JSON.stringify(payload);
    throw new Error(errorMessage || `Solapi request failed: ${response.status}`);
  }

  return {
    sentAt,
    summary: summarizeSolapiResponse(payload),
    payload,
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ result: 'error', message: 'Method not allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const submitResult = await callAppsScript('submit', data);

    if (submitResult?.result !== 'success') {
      return res.status(200).json(submitResult);
    }

    const token = data['신청토큰'] || data.applicationToken || '';

    try {
      const alimtalkResult = await sendAlimtalk({
        name: data.name,
        phone: data.phone,
        token,
      });

      if (!alimtalkResult.skipped) {
        await recordAlimtalkResult({
          token,
          sentAt: alimtalkResult.sentAt,
          status: '성공',
          result: alimtalkResult.summary,
          error: '',
        });
      }

      return res.status(200).json({
        ...submitResult,
        alimtalk: alimtalkResult.skipped ? 'skipped' : 'success',
      });
    } catch (alimtalkError) {
      const failedAt = new Date().toISOString();
      await recordAlimtalkResult({
        token,
        sentAt: failedAt,
        status: '실패',
        result: '실패',
        error: String(alimtalkError?.message || alimtalkError).slice(0, 500),
      });

      console.error('Alimtalk send failed:', alimtalkError);
      return res.status(200).json({
        ...submitResult,
        alimtalk: 'failed',
      });
    }
  } catch (error) {
    console.error('Submit API failed:', error);
    return res.status(500).json({
      result: 'error',
      message: '신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }
}
