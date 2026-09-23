import { createServer } from "node:http";
import { handleRequest } from "./src/core.js";

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
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
    const out = await handleRequest({
      method: req.method,
      path: url.pathname,
      query: url.searchParams,
      body,
      env: process.env,
      ip: req.socket.remoteAddress || ""
    });
    res.statusCode = out.status;
    for (const key of Object.keys(out.headers)) res.setHeader(key, out.headers[key]);
    res.end(out.body);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: { code: "internal_error", message: "Unexpected server error." } }));
  }
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, "0.0.0.0", () => {
  console.log("ChatGPT Free API ready on http://localhost:" + port);
});
