import crypto from 'node:crypto';

export const SOLAPI_SEND_URL = 'https://api.solapi.com/messages/v4/send';

const memoryStore = globalThis.__mamionPhoneVerifyStore || new Map();
globalThis.__mamionPhoneVerifyStore = memoryStore;

const memoryBuckets = globalThis.__mamionPhoneVerifyBuckets || new Map();
globalThis.__mamionPhoneVerifyBuckets = memoryBuckets;

export const isEnabled = (value) => String(value || '').toLowerCase() === 'true';

export const isExplicitlyDisabled = (value) => String(value || '').toLowerCase() === 'false';

export const normalizePhone = (value) => String(value || '').replace(/[^0-9]/g, '');

export const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
};

export const getEnvNumber = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const getTokenSecret = () => (
  process.env.PHONE_VERIFY_TOKEN_SECRET
  || process.env.APPS_SCRIPT_SUBMIT_SECRET
  || process.env.SOLAPI_API_SECRET
  || 'mamion-phone-verification-local-secret'
);

export const createSolapiAuthorization = () => {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  if (!apiKey || !apiSecret) throw new Error('SOLAPI_API_KEY or SOLAPI_API_SECRET is missing');

  const date = new Date().toISOString();
  const salt = crypto.randomUUID().replace(/-/g, '');
  const signature = crypto.createHmac('sha256', apiSecret).update(date + salt).digest('hex');

  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
};

export const hashCode = ({ phone, code }) => crypto
  .createHmac('sha256', getTokenSecret())
  .update(`${normalizePhone(phone)}:${String(code || '')}`)
  .digest('hex');

const getRedisConfig = () => {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ''), token };
};

const redisCommand = async (command) => {
  const config = getRedisConfig();
  if (!config) return null;

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) throw new Error(`Redis command failed: ${response.status}`);
  const payload = await response.json();
  return payload?.result ?? null;
};

export const storeGet = async (key) => {
  let redisValue = null;
  try {
    redisValue = await redisCommand(['GET', key]);
  } catch (error) {
    console.error('Redis GET failed:', error);
  }
  if (redisValue !== null) {
    try {
      return JSON.parse(redisValue);
    } catch {
      return null;
    }
  }

  const item = memoryStore.get(key);
  if (!item) return null;
  if (item.expiresAt && item.expiresAt < Date.now()) {
    memoryStore.delete(key);
    return null;
  }
  return item.value;
};

export const storeSet = async (key, value, ttlSeconds) => {
  try {
    await redisCommand(['SET', key, JSON.stringify(value), 'EX', ttlSeconds]);
  } catch (error) {
    console.error('Redis SET failed:', error);
  }
  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

export const checkMemoryRateLimit = ({ key, limit, windowMs }) => {
  const now = Date.now();
  const bucket = memoryBuckets.get(key) || [];
  const fresh = bucket.filter((timestamp) => now - timestamp < windowMs);
  if (fresh.length >= limit) {
    memoryBuckets.set(key, fresh);
    return false;
  }
  fresh.push(now);
  memoryBuckets.set(key, fresh);
  return true;
};

export const createVerificationToken = ({ phone }) => {
  const payload = {
    phone: normalizePhone(phone),
    verifiedAt: Date.now(),
    exp: Date.now() + getEnvNumber('PHONE_VERIFY_SESSION_MINUTES', 30) * 60 * 1000,
    nonce: crypto.randomUUID(),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', getTokenSecret()).update(body).digest('base64url');
  return `${body}.${signature}`;
};

export const createCodeChallenge = ({ phone, codeHash, expiresAt }) => {
  const payload = {
    phone: normalizePhone(phone),
    codeHash,
    expiresAt,
    nonce: crypto.randomUUID(),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', getTokenSecret()).update(body).digest('base64url');
  return `${body}.${signature}`;
};

export const verifyCodeChallenge = ({ challenge, phone, code }) => {
  if (!challenge || !phone || !code) return false;

  const [body, signature] = String(challenge).split('.');
  if (!body || !signature) return false;

  const expected = crypto.createHmac('sha256', getTokenSecret()).update(body).digest('base64url');
  if (signature.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return false;
  }

  if (payload.phone !== normalizePhone(phone)) return false;
  if (Number(payload.expiresAt || 0) < Date.now()) return false;
  return payload.codeHash === hashCode({ phone, code });
};

export const verifyVerificationToken = ({ token, phone }) => {
  if (!token || !phone) return false;

  const [body, signature] = String(token).split('.');
  if (!body || !signature) return false;

  const expected = crypto.createHmac('sha256', getTokenSecret()).update(body).digest('base64url');
  if (signature.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return false;
  }

  return payload.phone === normalizePhone(phone) && Number(payload.exp) > Date.now();
};

export const summarizeSolapiResponse = (payload) => {
  if (!payload || typeof payload !== 'object') return String(payload || '').slice(0, 500);
  return JSON.stringify({
    groupId: payload.groupId,
    messageId: payload.messageId,
    statusCode: payload.statusCode,
    statusMessage: payload.statusMessage,
    count: payload.count,
  }).replace(/undefined/g, '').slice(0, 500);
};
