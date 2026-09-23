export const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "Content-Type, Authorization",
  "access-control-expose-headers": "x-ratelimit-limit, x-ratelimit-remaining, x-ratelimit-reset, x-image-model, x-image-seed",
  "access-control-max-age": "86400"
};

export function ok(data, extraHeaders) {
  const payload = Object.assign({ ok: true }, data);
  return {
    status: 200,
    headers: Object.assign({ "content-type": "application/json; charset=utf-8" }, extraHeaders || {}, CORS),
    body: JSON.stringify(payload, null, 2)
  };
}

export function fail(status, code, message) {
  const payload = { ok: false, error: { code, message } };
  return {
    status,
    headers: Object.assign({ "content-type": "application/json; charset=utf-8" }, CORS),
    body: JSON.stringify(payload, null, 2)
  };
}

export function clampNumber(value, min, max, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  const num = Number(value);
  if (!isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.round(num)));
}
