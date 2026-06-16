import crypto from 'node:crypto';
import {
  getClientIp,
  isEnabled,
  isExplicitlyDisabled,
  normalizePhone,
  verifyVerificationToken,
} from './phone-verification-utils.js';
import { buildConsentPayload } from '../src/compliance-content.js';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyJyu85JNVY6nAAwTWpxPKqPwT_Cj180EcsqAyUR-fIq2sFGZotYF_qCJHbPpsX-3UkdQ/exec';
const SOLAPI_SEND_URL = 'https://api.solapi.com/messages/v4/send';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const DAY_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const DAY_LIMIT_MAX_REQUESTS = 20;
const ipBuckets = new Map();

const pruneBucket = (bucket, now) => {
  bucket.short = bucket.short.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  bucket.day = bucket.day.filter((timestamp) => now - timestamp < DAY_LIMIT_WINDOW_MS);
};

const checkRateLimit = (ip) => {
  const now = Date.now();
  const key = String(ip || 'unknown');
  const bucket = ipBuckets.get(key) || { short: [], day: [] };
  pruneBucket(bucket, now);

  if (bucket.short.length >= RATE_LIMIT_MAX_REQUESTS || bucket.day.length >= DAY_LIMIT_MAX_REQUESTS) {
    ipBuckets.set(key, bucket);
    return false;
  }

  bucket.short.push(now);
  bucket.day.push(now);
  ipBuckets.set(key, bucket);
  return true;
};

const verifyTurnstile = async ({ token, ip }) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { success: true, skipped: true };
  if (!token) return { success: false };

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret,
      response: token,
      remoteip: ip,
    }),
  });

  if (!response.ok) return { success: false };
  return response.json();
};

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
    const clientIp = getClientIp(req);
    const phoneVerificationRequired = !isExplicitlyDisabled(process.env.PHONE_VERIFY_ENABLED);

    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        result: 'rate_limited',
        message: '신청 요청이 일시적으로 많습니다. 잠시 후 다시 시도해주세요.',
      });
    }

    const turnstileResult = await verifyTurnstile({ token: data.turnstileToken, ip: clientIp });
    if (!turnstileResult?.success) {
      return res.status(403).json({
        result: 'turnstile_failed',
        message: '자동 신청 방지 확인에 실패했습니다. 새로고침 후 다시 시도해주세요.',
      });
    }

    if (phoneVerificationRequired && !verifyVerificationToken({
      token: data.phoneVerificationToken,
      phone: data.phone,
    })) {
      return res.status(403).json({
        result: 'phone_verification_required',
        message: '휴대폰 인증을 완료한 뒤 신청해주세요.',
      });
    }

    const consentAgreedAt = data.consentAgreedAt || data['동의 일시'] || data.createdAt || new Date().toISOString();
    const submitPayload = {
      ...data,
      ...buildConsentPayload(data, consentAgreedAt),
    };
    if (phoneVerificationRequired) {
      submitPayload.phoneVerified = true;
      submitPayload.phoneVerifiedAt = new Date().toISOString();
      submitPayload.phoneVerifiedNumber = normalizePhone(data.phone);
      submitPayload['휴대폰 인증 여부'] = '완료';
      submitPayload['휴대폰 인증 시간'] = submitPayload.phoneVerifiedAt;
      submitPayload['휴대폰 인증 번호'] = submitPayload.phoneVerifiedNumber;
    }

    if (process.env.APPS_SCRIPT_SUBMIT_SECRET) {
      submitPayload.submitSecret = process.env.APPS_SCRIPT_SUBMIT_SECRET;
    }

    const submitResult = await callAppsScript('submit', submitPayload);

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
