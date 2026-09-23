import { handleRequest } from "../src/core.js";

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      let body = null;
      if (request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS") {
        const raw = await request.text();
        try {
          body = JSON.parse(raw);
        } catch (err) {
          body = raw;
        }
      }
      const out = await handleRequest({
        method: request.method,
        path: url.pathname,
        query: url.searchParams,
        body,
        env,
        ip: request.headers.get("cf-connecting-ip") || ""
      });
      const headers = new Headers(out.headers);
      return new Response(request.method === "HEAD" ? null : out.body, { status: out.status, headers });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: { code: "internal_error", message: "Unexpected server error." } }), {
        status: 500,
        headers: { "content-type": "application/json; charset=utf-8" }
      });
    }
  }
};
