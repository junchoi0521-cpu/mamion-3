import crypto from 'node:crypto';
import {
  SOLAPI_SEND_URL,
  checkMemoryRateLimit,
  createCodeChallenge,
  createSolapiAuthorization,
  getClientIp,
  getEnvNumber,
  hashCode,
  isEnabled,
  isExplicitlyDisabled,
  normalizePhone,
  storeGet,
  storeSet,
  summarizeSolapiResponse,
} from './phone-verification-utils.js';

const createCode = () => {
  if (isEnabled(process.env.PHONE_VERIFY_TEST_MODE)) {
    return String(process.env.PHONE_VERIFY_TEST_CODE || '123456').padStart(6, '0').slice(0, 6);
  }
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
};

const sendSms = async ({ to, code }) => {
  if (isEnabled(process.env.PHONE_VERIFY_TEST_MODE)) {
    return { skipped: true, summary: 'PHONE_VERIFY_TEST_MODE is true' };
  }

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
        text: `[마미온] 휴대폰 인증번호는 ${code} 입니다. 5분 이내에 입력해주세요.`,
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
    throw new Error(errorMessage || `Solapi SMS request failed: ${response.status}`);
  }

  return { skipped: false, summary: summarizeSolapiResponse(payload) };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ result: 'error', message: 'Method not allowed' });
  }

  if (isExplicitlyDisabled(process.env.PHONE_VERIFY_ENABLED)) {
    return res.status(200).json({ result: 'disabled', message: '휴대폰 인증이 비활성화되어 있습니다.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const phone = normalizePhone(body.phone);
    const ip = getClientIp(req);

    if (!/^01[016789][0-9]{7,8}$/.test(phone)) {
      return res.status(400).json({ result: 'error', message: '휴대폰 번호를 정확히 입력해주세요.' });
    }

    const resendSeconds = getEnvNumber('PHONE_VERIFY_RESEND_SECONDS', 60);
    const dailyLimit = getEnvNumber('PHONE_VERIFY_DAILY_LIMIT', 5);
    const ttlMinutes = getEnvNumber('PHONE_VERIFY_CODE_TTL_MINUTES', 5);
    const key = `phone-verify:${phone}`;
    const now = Date.now();

    if (!checkMemoryRateLimit({ key: `phone-code-ip:${ip}`, limit: 20, windowMs: 10 * 60 * 1000 })) {
      return res.status(429).json({ result: 'rate_limited', message: '인증 요청이 많습니다. 잠시 후 다시 시도해주세요.' });
    }

    const previous = await storeGet(key);
    const sendTimes = Array.isArray(previous?.sendTimes)
      ? previous.sendTimes.filter((timestamp) => now - timestamp < 24 * 60 * 60 * 1000)
      : [];

    if (previous?.lastSentAt && now - previous.lastSentAt < resendSeconds * 1000) {
      return res.status(429).json({
        result: 'wait',
        message: `${resendSeconds}초 후 다시 인증번호를 요청해주세요.`,
      });
    }

    if (sendTimes.length >= dailyLimit) {
      return res.status(429).json({
        result: 'daily_limited',
        message: '오늘 인증번호 요청 횟수를 초과했습니다. 내일 다시 시도해주세요.',
      });
    }

    const code = createCode();
    const smsResult = await sendSms({ to: phone, code });

    const codeHash = hashCode({ phone, code });
    const expiresAt = now + ttlMinutes * 60 * 1000;

    await storeSet(key, {
      codeHash,
      attempts: 0,
      lastSentAt: now,
      expiresAt,
      sendTimes: [...sendTimes, now],
    }, 24 * 60 * 60);

    return res.status(200).json({
      result: 'success',
      message: isEnabled(process.env.PHONE_VERIFY_TEST_MODE)
        ? `테스트 인증번호는 ${code} 입니다.`
        : '인증번호를 발송했습니다.',
      phoneVerificationChallenge: createCodeChallenge({ phone, codeHash, expiresAt }),
      testMode: isEnabled(process.env.PHONE_VERIFY_TEST_MODE),
      sms: smsResult.skipped ? 'skipped' : 'sent',
    });
  } catch (error) {
    console.error('Phone code send failed:', error);
    return res.status(500).json({
      result: 'error',
      message: '인증번호 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }
}
