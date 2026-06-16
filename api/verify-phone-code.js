import {
  createVerificationToken,
  getEnvNumber,
  hashCode,
  isExplicitlyDisabled,
  normalizePhone,
  storeGet,
  storeSet,
} from './phone-verification-utils.js';

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
    const code = String(body.code || '').replace(/[^0-9]/g, '');

    if (!/^01[016789][0-9]{7,8}$/.test(phone)) {
      return res.status(400).json({ result: 'error', message: '휴대폰 번호를 정확히 입력해주세요.' });
    }

    if (!/^[0-9]{6}$/.test(code)) {
      return res.status(400).json({ result: 'error', message: '6자리 인증번호를 입력해주세요.' });
    }

    const key = `phone-verify:${phone}`;
    const record = await storeGet(key);
    const maxAttempts = getEnvNumber('PHONE_VERIFY_MAX_ATTEMPTS', 5);

    if (!record?.codeHash) {
      return res.status(400).json({ result: 'expired', message: '인증번호를 먼저 요청해주세요.' });
    }

    if (record.expiresAt && record.expiresAt < Date.now()) {
      return res.status(400).json({ result: 'expired', message: '인증번호 유효시간이 만료되었습니다. 다시 요청해주세요.' });
    }

    if (Number(record.attempts || 0) >= maxAttempts) {
      return res.status(429).json({ result: 'locked', message: '인증번호 입력 횟수를 초과했습니다. 다시 요청해주세요.' });
    }

    if (record.codeHash !== hashCode({ phone, code })) {
      const nextRecord = { ...record, attempts: Number(record.attempts || 0) + 1 };
      await storeSet(key, nextRecord, 24 * 60 * 60);
      return res.status(400).json({ result: 'mismatch', message: '인증번호가 일치하지 않습니다.' });
    }

    await storeSet(key, {
      ...record,
      verifiedAt: Date.now(),
      attempts: Number(record.attempts || 0),
    }, 24 * 60 * 60);

    return res.status(200).json({
      result: 'success',
      message: '휴대폰 인증이 완료되었습니다.',
      phoneVerificationToken: createVerificationToken({ phone }),
    });
  } catch (error) {
    console.error('Phone code verify failed:', error);
    return res.status(500).json({
      result: 'error',
      message: '휴대폰 인증 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }
}
