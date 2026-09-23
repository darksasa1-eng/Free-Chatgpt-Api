import { handleRequest } from "./src/core.js";

const text = "Cloud computing is the delivery of computing services including servers, storage, databases, networking, software and analytics over the internet. Instead of buying and maintaining physical data centers, companies rent computing power from providers like Amazon Web Services, Microsoft Azure or Google Cloud on a pay as you go basis. This model lets teams scale up during traffic spikes and scale down to save money, while providers handle hardware maintenance, security patches and physical security. Today almost every modern application, from video streaming to mobile banking, relies on cloud infrastructure somewhere in its stack.";

const cases = [
  { name: "landing", method: "GET", path: "/", expect: 200 },
  { name: "favicon", method: "GET", path: "/favicon.ico", expect: 200 },
  { name: "health", method: "GET", path: "/health", expect: 200 },
  { name: "status", method: "GET", path: "/status", expect: 200 },
  { name: "models", method: "GET", path: "/v1/models", expect: 200 },
  { name: "chat missing input", method: "GET", path: "/v1/chat", expect: 400 },
  { name: "wrong method", method: "PUT", path: "/v1/models", expect: 405 },
  { name: "not found", method: "GET", path: "/does-not-exist", expect: 404 },
  { name: "summarize", method: "POST", path: "/v1/summarize", body: { text, length: "short" }, expect: 200 },
  { name: "translate", method: "POST", path: "/v1/translate", body: { text: "ආයුබෝවන්, ඔබට කෙසේද?", to: "English" }, expect: 200 },
  { name: "code", method: "POST", path: "/v1/code", body: { prompt: "Write a function that reverses a string.", language: "python" }, expect: 200 },
  { name: "chat get", method: "GET", path: "/v1/chat", query: { q: "Reply with exactly: pong" }, expect: 200 },
  { name: "chat post", method: "POST", path: "/v1/chat", body: { messages: [{ role: "user", content: "What is 2+2? Answer with one word." }] }, expect: 200 },
  { name: "image missing prompt", method: "GET", path: "/v1/image", expect: 400 }
];

let failures = 0;

for (const item of cases) {
  const query = new URLSearchParams(item.query || {});
  const started = Date.now();
  let out;
  try {
    out = await handleRequest({ method: item.method, path: item.path, query, body: item.body || null, env: {}, ip: "127.0.0.1" });
  } catch (err) {
    out = { status: 500, body: String(err && err.message ? err.message : err) };
  }
  const elapsed = Date.now() - started;
  const pass = out.status === item.expect;
  if (!pass) failures += 1;
  const preview = typeof out.body === "string" ? out.body.slice(0, 80).replace(/\s+/g, " ") : out.body.byteLength + " bytes binary";
  console.log((pass ? "PASS" : "FAIL") + "  " + String(item.name).padEnd(22) + " " + out.status + "  " + elapsed + "ms  " + preview);
}

console.log("");
console.log(failures === 0 ? "All tests passed." : failures + " test(s) failed.");
process.exit(failures === 0 ? 0 : 1);
