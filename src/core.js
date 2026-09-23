import { chat, listModels, image, summarize, translate, code, status, health, debugRoute } from "./handlers.js";
import { renderPage } from "./page.js";
import { CORS, fail, ok } from "./shared.js";

const RATE_LIMIT = 60;
const RATE_WINDOW = 60000;
const buckets = new Map();

function rateLimit(ip) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [key, bucket] of buckets) {
      if (now > bucket.reset) buckets.delete(key);
    }
  }
  let bucket = buckets.get(ip);
  if (!bucket || now > bucket.reset) {
    bucket = { count: 0, reset: now + RATE_WINDOW };
    buckets.set(ip, bucket);
  }
  bucket.count += 1;
  return {
    limit: RATE_LIMIT,
    remaining: Math.max(0, RATE_LIMIT - bucket.count),
    reset: Math.ceil(bucket.reset / 1000),
    exceeded: bucket.count > RATE_LIMIT
  };
}

function rateHeaders(info) {
  return {
    "x-ratelimit-limit": String(info.limit),
    "x-ratelimit-remaining": String(info.remaining),
    "x-ratelimit-reset": String(info.reset)
  };
}

const faviconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#e8e8e8" d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>';

const BUILD_ID = "b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

function landing(input) {
  if (input && input.query && input.query.get("debug") === "1") {
    return ok({
      build_id: BUILD_ID,
      entry_version: input.entry_version || "missing",
      resolved_path: input.path,
      input_keys: Object.keys(input),
      raw: input.raw || null
    });
  }
  return {
    status: 200,
    headers: Object.assign({ "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate" }, CORS),
    body: renderPage()
  };
}

function favicon() {
  return {
    status: 200,
    headers: Object.assign({ "content-type": "image/svg+xml", "cache-control": "public, max-age=604800" }, CORS),
    body: faviconSvg
  };
}

const ROUTES = {
  "/": { methods: ["GET"], handler: landing },
  "/favicon.ico": { methods: ["GET"], handler: favicon },
  "/favicon.svg": { methods: ["GET"], handler: favicon },
  "/status": { methods: ["GET"], handler: status },
  "/health": { methods: ["GET"], handler: health },
  "/chat": { methods: ["GET", "POST"], handler: chat },
  "/v1/chat": { methods: ["GET", "POST"], handler: chat },
  "/v1/models": { methods: ["GET"], handler: listModels },
  "/v1/image": { methods: ["GET", "POST"], handler: image },
  "/v1/summarize": { methods: ["POST"], handler: summarize },
  "/v1/translate": { methods: ["POST"], handler: translate },
  "/v1/code": { methods: ["POST"], handler: code }
};

export async function handleRequest(input) {
  const method = String(input.method || "GET").toUpperCase();
  let path = String(input.path || "/").split("?")[0];
  try {
    path = decodeURIComponent(path);
  } catch (err) {}
  while (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (path === "/api/index.js") {
    path = "/";
  } else if (path.startsWith("/api/index.js/")) {
    path = path.slice("/api/index.js".length) || "/";
  } else if (path === "/api" || path === "/api/") {
    path = "/";
  } else if (path.startsWith("/api/")) {
    path = path.slice(4) || "/";
  }
  const query = input.query instanceof URLSearchParams ? input.query : new URLSearchParams();
  if (method === "OPTIONS") {
    return { status: 204, headers: Object.assign({}, CORS), body: "" };
  }
  const route = ROUTES[path];
  if (!route) {
    return fail(404, "not_found", "This route does not exist. Open /status for the full endpoint catalogue.");
  }
  if (!route.methods.includes(method)) {
    const res = fail(405, "method_not_allowed", "Use " + route.methods.join(" or ") + " for " + path + ".");
    res.headers.allow = route.methods.join(", ");
    return res;
  }
  let rateInfo = null;
  if (path.startsWith("/v1/") && input.ip) {
    rateInfo = rateLimit(input.ip);
    if (rateInfo.exceeded) {
      const res = fail(429, "rate_limited", "Too many requests. The free limit is " + RATE_LIMIT + " requests per minute per IP.");
      res.headers["retry-after"] = "60";
      Object.assign(res.headers, rateHeaders(rateInfo));
      return res;
    }
  }
  const out = await route.handler({ method, path, query, body: input.body === undefined ? null : input.body, env: input.env || {}, ip: input.ip || "", raw: input.raw || null, entry_version: input.entry_version || "missing" });
  if (rateInfo) Object.assign(out.headers, rateHeaders(rateInfo));
  return out;
}
