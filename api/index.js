import { handleRequest } from "../src/core.js";

const KNOWN_PATHS = [
  "/", "/favicon.ico", "/favicon.svg", "/status", "/health", "/chat",
  "/v1/chat", "/v1/models", "/v1/image", "/v1/summarize", "/v1/translate", "/v1/code"
];

function normalizePath(pathname) {
  try {
    pathname = decodeURIComponent(pathname);
  } catch (err) {}
  if (pathname.startsWith("/api/index.js/")) {
    pathname = pathname.slice("/api/index.js".length);
  } else if (pathname === "/api/index.js" || pathname === "/api" || pathname === "/api/") {
    pathname = "/";
  }
  if (pathname.length > 1) {
    pathname = pathname.replace(/\/+$/, "");
    if (!pathname) pathname = "/";
  }
  return pathname;
}

function looksLikeRoute(path) {
  return KNOWN_PATHS.indexOf(path) !== -1 || path.startsWith("/v1/");
}

function resolvePath(headers, url) {
  const primary = normalizePath(url.pathname);
  if (primary !== "/" && looksLikeRoute(primary)) return primary;
  const forwardedPath = headers["x-forwarded-path"];
  const matchedPath = headers["x-matched-path"];
  const candidates = [];
  if (typeof forwardedPath === "string" && forwardedPath) candidates.push(normalizePath(forwardedPath));
  if (typeof matchedPath === "string" && matchedPath) candidates.push(normalizePath(matchedPath));
  for (const path of candidates) {
    if (path !== "/" && looksLikeRoute(path)) return path;
  }
  if (primary !== "/") return primary;
  return "/";
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, "https://internal");
    let body = null;
    if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      try {
        body = JSON.parse(raw);
      } catch (err) {
        body = raw;
      }
    }
    const forwarded = req.headers["x-forwarded-for"];
    const out = await handleRequest({
      method: req.method,
      path: resolvePath(req.headers, url),
      query: url.searchParams,
      body,
      env: process.env,
      ip: typeof forwarded === "string" ? forwarded.split(",")[0].trim() : ""
    });
    res.statusCode = out.status;
    res.setHeader("x-debug-path", url.pathname + "|" + String(req.headers["x-matched-path"]) + "|" + String(req.headers["x-forwarded-path"]));
    for (const key of Object.keys(out.headers)) res.setHeader(key, out.headers[key]);
    res.end(out.body);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: { code: "internal_error", message: "Unexpected server error." } }));
  }
}
