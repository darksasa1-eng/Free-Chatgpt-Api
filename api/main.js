import { handleRequest } from "../src/core.js";

function cleanRoute(value) {
  if (typeof value !== "string") return "";
  try {
    value = decodeURIComponent(value);
  } catch (err) {}
  if (!value.startsWith("/")) value = "/" + value;
  while (value.length > 1 && value.endsWith("/")) value = value.slice(0, -1);
  if (value === "/index" || value === "/index.js" || value === "/api/index" || value === "/api/index.js") return "/";
  if (value === "/main" || value === "/main.js" || value === "/api/main" || value === "/api/main.js") return "";
  return value;
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
    const routeParam = url.searchParams.get("route") || "";
    url.searchParams.delete("route");
    let path = cleanRoute(routeParam);
    if (!path) path = "/";
    const forwarded = req.headers["x-forwarded-for"];
    const out = await handleRequest({
      method: req.method,
      path,
      query: url.searchParams,
      body,
      env: process.env,
      ip: typeof forwarded === "string" ? forwarded.split(",")[0].trim() : ""
    });
    res.statusCode = out.status;
    for (const key of Object.keys(out.headers)) res.setHeader(key, out.headers[key]);
    res.end(out.body);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: { code: "internal_error", message: "Unexpected server error." } }));
  }
}
