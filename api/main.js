const ENTRY_VERSION = "entry-v3";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "Content-Type, Authorization",
  "access-control-expose-headers": "x-ratelimit-limit, x-ratelimit-remaining, x-ratelimit-reset, x-image-model, x-image-seed",
  "access-control-max-age": "86400"
};

function ok(data, extraHeaders) {
  const payload = Object.assign({ ok: true }, data);
  return {
    status: 200,
    headers: Object.assign({ "content-type": "application/json; charset=utf-8" }, extraHeaders || {}, CORS),
    body: JSON.stringify(payload, null, 2)
  };
}

function fail(status, code, message) {
  const payload = { ok: false, error: { code, message } };
  return {
    status,
    headers: Object.assign({ "content-type": "application/json; charset=utf-8" }, CORS),
    body: JSON.stringify(payload, null, 2)
  };
}

function clampNumber(value, min, max, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  const num = Number(value);
  if (!isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.round(num)));
}

const VERSION = "1.0.0";
const DEVELOPER = "Sasa Dev";
const DEFAULT_MODEL = "openai";
const REFERRER = "chatgpt-free-api-sasa-dev";
const STARTED_AT = Date.now();

const DEFAULT_SYSTEM = "You are ChatGPT, a helpful and knowledgeable assistant. Always respond in the same language the user writes in. Be accurate, concise and well structured.";

const FALLBACK_MODELS = [
  { id: "openai", description: "Balanced general purpose model" },
  { id: "openai-fast", description: "Low latency model for quick replies" }
];

const ENDPOINTS = [
  { method: "GET", path: "/chat", description: "Quick chat, alias of /v1/chat" },
  { method: "POST", path: "/v1/chat", description: "OpenAI compatible chat completions" },
  { method: "GET", path: "/v1/models", description: "List available AI models" },
  { method: "GET", path: "/v1/image", description: "Generate an image from a prompt" },
  { method: "POST", path: "/v1/summarize", description: "Summarize long text" },
  { method: "POST", path: "/v1/translate", description: "Translate text between languages" },
  { method: "POST", path: "/v1/code", description: "Ask a coding assistant" },
  { method: "GET", path: "/status", description: "Service status and endpoint catalogue" },
  { method: "GET", path: "/health", description: "Liveness probe for uptime monitors" }
];

function textBase(env) {
  return (env && env.TEXT_API_BASE) || "https://text.pollinations.ai";
}

function imageBase(env) {
  return (env && env.IMAGE_API_BASE) || "https://image.pollinations.ai";
}

function estimateTokens(text) {
  return Math.ceil((text || "").length / 4);
}

function randomId() {
  return "chatcmpl-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function normalizeMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const item of raw.slice(0, 24)) {
    if (!item || typeof item !== "object") continue;
    let content = item.content;
    if (Array.isArray(content)) {
      content = content.map((part) => (part && typeof part === "object" && typeof part.text === "string" ? part.text : "")).join(" ");
    }
    if (typeof content !== "string" || !content.trim()) continue;
    let role = typeof item.role === "string" ? item.role.toLowerCase() : "user";
    if (role !== "system" && role !== "user" && role !== "assistant") role = "user";
    out.push({ role, content: content.trim().slice(0, 8000) });
  }
  return out;
}

async function askText(messages, model, env, temperature) {
  const base = textBase(env);
  const payload = { model: model || DEFAULT_MODEL, messages, referrer: REFERRER };
  if (typeof temperature === "number" && isFinite(temperature)) payload.temperature = temperature;
  try {
    const res = await fetch(base + "/openai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(90000)
    });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (typeof content === "string" && content.trim()) {
        return { content: content.trim(), model: (data && data.model) || payload.model };
      }
    }
  } catch (err) {}
  const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n");
  const user = [...messages].reverse().find((m) => m.role === "user");
  if (!user) throw new Error("upstream_unavailable");
  const url = new URL(base + "/" + encodeURIComponent(user.content.slice(0, 4000)));
  url.searchParams.set("model", payload.model);
  url.searchParams.set("referrer", REFERRER);
  if (system) url.searchParams.set("system", system.slice(0, 2000));
  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error("upstream_unavailable");
  const text = (await res.text()).trim();
  if (!text) throw new Error("upstream_unavailable");
  return { content: text, model: payload.model };
}

async function chat(input) {
  const query = input.query;
  const body = input.body && typeof input.body === "object" && !Array.isArray(input.body) ? input.body : {};
  let messages = normalizeMessages(body.messages);
  let model = typeof body.model === "string" ? body.model.trim() : "";
  let temperature = typeof body.temperature === "number" && isFinite(body.temperature) ? body.temperature : null;
  if (!messages.length && (typeof body.prompt === "string" || typeof body.q === "string")) {
    const single = String(body.prompt || body.q || "").trim();
    if (single) messages = [{ role: "user", content: single }];
  }
  if (!messages.length) {
    const single = (query.get("q") || query.get("prompt") || query.get("text") || "").trim();
    if (single) messages = [{ role: "user", content: single }];
  }
  if (!model && query.get("model")) model = query.get("model").trim();
  if (!messages.length) {
    return fail(400, "missing_messages", "Send {\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]} as JSON, or try /v1/chat?q=hello for a quick test.");
  }
  if (!model) model = DEFAULT_MODEL;
  if (model.length > 64) model = DEFAULT_MODEL;
  if (temperature !== null) temperature = Math.min(2, Math.max(0, temperature));
  if (!messages.some((m) => m.role === "system")) messages.unshift({ role: "system", content: DEFAULT_SYSTEM });
  let result;
  try {
    result = await askText(messages, model, input.env, temperature);
  } catch (err) {
    return fail(502, "upstream_error", "The AI backend is temporarily unavailable. Please retry in a moment.");
  }
  const promptTokens = messages.reduce((total, m) => total + estimateTokens(m.content) + 4, 0);
  const completionTokens = estimateTokens(result.content);
  return ok({
    id: randomId(),
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: result.model,
    choices: [
      {
        index: 0,
        message: { role: "assistant", content: result.content },
        finish_reason: "stop"
      }
    ],
    usage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens + completionTokens
    }
  });
}

async function listModels(input) {
  let models = null;
  try {
    const res = await fetch(textBase(input.env) + "/models", { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      const raw = Array.isArray(data) ? data : data && Array.isArray(data.models) ? data.models : null;
      if (raw) {
        models = raw
          .map((item) => {
            if (typeof item === "string") return { id: item, description: "" };
            if (item && typeof item === "object" && (item.name || item.id)) {
              return { id: String(item.name || item.id), description: String(item.description || "") };
            }
            return null;
          })
          .filter(Boolean);
      }
    }
  } catch (err) {}
  if (!models || !models.length) models = FALLBACK_MODELS;
  const now = Math.floor(Date.now() / 1000);
  return ok(
    {
      object: "list",
      count: models.length,
      data: models.map((m) => ({ id: m.id, object: "model", created: now, owned_by: "pollinations", description: m.description || undefined }))
    },
    { "cache-control": "public, max-age=300" }
  );
}

async function image(input) {
  const query = input.query;
  const body = input.body && typeof input.body === "object" && !Array.isArray(input.body) ? input.body : {};
  let prompt = (query.get("prompt") || query.get("q") || "").trim();
  if (!prompt && typeof body.prompt === "string") prompt = body.prompt.trim();
  if (!prompt) return fail(400, "missing_prompt", "Add a prompt, for example /v1/image?prompt=a+red+fox+in+snow");
  if (prompt.length > 900) prompt = prompt.slice(0, 900);
  const width = clampNumber(query.get("width") || body.width, 256, 2048, 1024);
  const height = clampNumber(query.get("height") || body.height, 256, 2048, 1024);
  const model = String(query.get("model") || body.model || "flux").slice(0, 40);
  let seed = clampNumber(query.get("seed") || body.seed, 0, 99999999, -1);
  if (seed < 0) seed = Math.floor(Math.random() * 100000000);
  const url = imageBase(input.env) + "/prompt/" + encodeURIComponent(prompt) + "?width=" + width + "&height=" + height + "&model=" + encodeURIComponent(model) + "&seed=" + seed + "&nologo=true&referrer=" + REFERRER;
  let res;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(55000) });
  } catch (err) {
    return fail(504, "image_timeout", "Image generation took too long. Please try again.");
  }
  if (!res.ok) return fail(502, "image_error", "The image service rejected this prompt. Try rephrasing it.");
  const buffer = new Uint8Array(await res.arrayBuffer());
  const type = (res.headers.get("content-type") || "image/jpeg").split(";")[0];
  return {
    status: 200,
    headers: Object.assign({ "content-type": type, "cache-control": "public, max-age=604800", "x-image-model": model, "x-image-seed": String(seed) }, CORS),
    body: buffer
  };
}

async function summarize(input) {
  const body = input.body && typeof input.body === "object" && !Array.isArray(input.body) ? input.body : {};
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (text.length < 40) return fail(400, "text_too_short", "Send at least 40 characters of text to summarize.");
  const length = ["short", "medium", "long"].includes(body.length) ? body.length : "medium";
  const instructions = {
    short: "Summarize the user's text in 1 or 2 short sentences.",
    medium: "Summarize the user's text in one concise paragraph.",
    long: "Write a detailed summary of the user's text, then add 3 to 5 key points as a bullet list."
  };
  const messages = [
    { role: "system", content: "You are an expert summarizer. " + instructions[length] + " Reply with the summary only, no preamble." },
    { role: "user", content: text.slice(0, 20000) }
  ];
  let result;
  try {
    result = await askText(messages, DEFAULT_MODEL, input.env, null);
  } catch (err) {
    return fail(502, "upstream_error", "The AI backend is temporarily unavailable. Please retry in a moment.");
  }
  return ok({
    model: result.model,
    length,
    summary: result.content,
    stats: { input_characters: text.length, output_characters: result.content.length }
  });
}

async function translate(input) {
  const body = input.body && typeof input.body === "object" && !Array.isArray(input.body) ? input.body : {};
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) return fail(400, "missing_text", "Send {\"text\":\"...\",\"to\":\"English\"} as JSON.");
  const from = typeof body.from === "string" && body.from.trim() ? body.from.trim().slice(0, 40) : "";
  const to = typeof body.to === "string" && body.to.trim() ? body.to.trim().slice(0, 40) : "English";
  const messages = [
    {
      role: "system",
      content: "You are a professional translator. Translate the user's text " + (from ? "from " + from + " " : "") + "into " + to + ". Reply with the translation only. No explanations, no quotes, keep the original formatting."
    },
    { role: "user", content: text.slice(0, 12000) }
  ];
  let result;
  try {
    result = await askText(messages, DEFAULT_MODEL, input.env, null);
  } catch (err) {
    return fail(502, "upstream_error", "The AI backend is temporarily unavailable. Please retry in a moment.");
  }
  return ok({ model: result.model, translated: result.content, from: from || "auto", to });
}

async function code(input) {
  const body = input.body && typeof input.body === "object" && !Array.isArray(input.body) ? input.body : {};
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) return fail(400, "missing_prompt", "Send {\"prompt\":\"describe your task\",\"language\":\"python\"} as JSON.");
  const language = typeof body.language === "string" && body.language.trim() ? body.language.trim().slice(0, 30) : "";
  const messages = [
    {
      role: "system",
      content: "You are a senior software engineer. Give correct, clean, production ready code with a short explanation. Use markdown code blocks with the language tag."
    },
    { role: "user", content: prompt.slice(0, 8000) + (language ? "\n\nTarget language: " + language : "") }
  ];
  let result;
  try {
    result = await askText(messages, DEFAULT_MODEL, input.env, null);
  } catch (err) {
    return fail(502, "upstream_error", "The AI backend is temporarily unavailable. Please retry in a moment.");
  }
  return ok({ model: result.model, language: language || "auto", result: result.content });
}

async function status(input) {
  let chatService = "operational";
  try {
    const res = await fetch(textBase(input.env) + "/models", { signal: AbortSignal.timeout(4000) });
    if (!res.ok) chatService = "degraded";
  } catch (err) {
    chatService = "degraded";
  }
  const overall = chatService === "operational" ? "operational" : "degraded";
  return ok({
    status: overall,
    service: "chatgpt-free-api",
    version: VERSION,
    developer: DEVELOPER,
    uptime_seconds: Math.round((Date.now() - STARTED_AT) / 1000),
    services: { chat: chatService, image: "operational", models: chatService },
    endpoints: ENDPOINTS,
    timestamp: new Date().toISOString()
  });
}

function health() {
  return ok({
    healthy: true,
    status: "ok",
    version: VERSION,
    developer: DEVELOPER,
    uptime_seconds: Math.round((Date.now() - STARTED_AT) / 1000),
    timestamp: new Date().toISOString()
  });
}

function debugRoute(input) {
  return ok({
    resolved_path: input.path,
    raw: input.raw || null
  });
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>ChatGPT Free API — Sasa Dev</title>
<meta name="description" content="chatgpt free api • 100% free • no api key • openai compatible • made by Sasa Dev" />
<meta property="og:type" content="website" />
<meta property="og:title" content="ChatGPT Free API — Sasa Dev" />
<meta property="og:description" content="100% free openai compatible api • chat · image · translate · summarize · code • no api key" />
<meta property="og:image" content="https://raw.githubusercontent.com/darksasa1-eng/Free-Chatgpt-Api/main/assets/banner.png" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ededed' d='M13 2 3 14h9l-1 8 10-12h-9l1-8z'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0a0a0a; --box:#0e0e0e; --line:#242424; --line-2:#2e2e2e;
    --ink:#e8e8e8; --muted:#8b8b8b; --dim:#585858;
    --kw:#ffffff; --key:#cfcfcf; --str:#8f8f8f; --punct:#5c5c5c;
  }
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  html,body{margin:0;height:100%}
  body{
    background:var(--bg); color:var(--ink);
    font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
    overflow-x:hidden;
    -webkit-font-smoothing:antialiased;
  }
  ::selection{background:#e8e8e8;color:#0a0a0a}
  #loader{
    position:fixed; inset:0; z-index:50; background:var(--bg);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    transition:opacity .8s ease, transform .8s ease;
  }
  #loader.hide{opacity:0; transform:translateY(-2%); pointer-events:none;}
  .lbl{position:absolute; top:32px; left:40px; font-size:.7rem; letter-spacing:.08em; color:var(--muted);}
  .yr{position:absolute; top:32px; right:40px; font-size:.7rem; letter-spacing:.08em; color:var(--muted);}
  .anime-loader{width:120px; height:120px; position:relative;}
  .orb{
    position:absolute; width:24px; height:24px; border-radius:50%; background:var(--ink);
    left:50%; top:50%; transform:translate(-50%,-50%);
  }
  .orb:nth-child(1){animation:bounce1 1.4s ease-in-out infinite;}
  .orb:nth-child(2){animation:bounce2 1.4s ease-in-out infinite;}
  .orb:nth-child(3){animation:bounce3 1.4s ease-in-out infinite;}
  @keyframes bounce1{
    0%,100%{transform:translate(-50%,-50%) scale(1); opacity:1;}
    50%{transform:translate(-50%,-150%) scale(.8); opacity:.7;}
  }
  @keyframes bounce2{
    0%,100%{transform:translate(-50%,-50%) scale(1); opacity:.5;}
    50%{transform:translate(-50%,-120%) scale(.9); opacity:.8;}
  }
  @keyframes bounce3{
    0%,100%{transform:translate(-50%,-50%) scale(1); opacity:.3;}
    50%{transform:translate(-50%,-90%) scale(1); opacity:.6;}
  }
  #pct{margin-top:28px; font-size:.75rem; letter-spacing:.12em; color:var(--ink);}
  #pct span{color:#fff; font-weight:600;}
  .bar{width:180px; height:2px; background:var(--line); margin-top:14px; position:relative; overflow:hidden;}
  .bar i{position:absolute; left:0; top:0; bottom:0; width:0%; background:#fff; transition:width .2s ease;}
  main{
    min-height:100vh; padding:32px 40px; display:flex; flex-direction:column;
    opacity:0; transition:opacity .6s ease;
  }
  main.show{opacity:1;}
  .topbar{
    display:flex; justify-content:space-between; font-size:.7rem; letter-spacing:.08em; color:var(--muted);
    transform:translateY(-24px); opacity:0; transition:transform .7s cubic-bezier(.2,.8,.2,1), opacity .7s ease;
  }
  .topbar.reveal{transform:translateY(0); opacity:1;}
  .hero{flex:1; display:flex; align-items:center; justify-content:center; padding:44px 0 52px;}
  .codebox{
    width:min(680px,94vw); border:1px solid var(--line); border-radius:10px;
    background:var(--box); overflow:hidden;
  }
  .bar-top{
    display:flex; align-items:center; gap:6px; padding:10px 14px;
    border-bottom:1px solid var(--line); font-size:.68rem; color:var(--muted); letter-spacing:.05em;
  }
  .bar-top .name{margin-left:6px;}
  .bar-top .right{margin-left:auto; display:flex; align-items:center; gap:10px;}
  .codebox .dot{width:8px; height:8px; border-radius:50%; background:var(--line-2);}
  pre{
    margin:0; padding:22px 24px 26px; font-size:.82rem; line-height:1.85;
    white-space:pre-wrap; word-break:break-word; min-height:340px; tab-size:2;
    font-family:inherit;
  }
  .kw{color:var(--kw); font-weight:600;}
  .key{color:var(--key);}
  .str{color:var(--str);}
  .pun{color:var(--punct);}
  .dim{color:var(--dim);}
  #cursor{display:inline-block; width:7px; height:1.1em; background:var(--ink); vertical-align:-2px; animation:blink 1s step-end infinite;}
  @keyframes blink{50%{opacity:0;}}
  .section{margin:0 0 44px; opacity:0; transform:translateY(16px); transition:transform .7s cubic-bezier(.2,.8,.2,1), opacity .7s ease;}
  .section.reveal{transform:translateY(0); opacity:1;}
  .sec-label{font-size:.66rem; letter-spacing:.22em; color:var(--dim); margin:0 0 10px 2px;}
  .ep-list{padding:8px 0;}
  .ep-row{
    display:flex; align-items:baseline; gap:14px; padding:8px 18px; cursor:pointer;
    transition:background .15s ease; position:relative;
  }
  .ep-row:hover{background:#151515;}
  .ep-m{font-size:.7rem; font-weight:700; letter-spacing:.06em; color:#fff; width:42px; flex-shrink:0;}
  .ep-p{font-size:.8rem; color:var(--key); flex-shrink:0;}
  .ep-d{font-size:.72rem; color:var(--dim); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
  .ep-flag{
    margin-left:auto; font-size:.6rem; letter-spacing:.14em; color:#0a0a0a; background:var(--ink);
    padding:2px 7px; border-radius:4px; opacity:0; transition:opacity .2s ease; flex-shrink:0;
  }
  .ep-row.done .ep-flag{opacity:1;}
  .pg-out{padding:18px 20px; min-height:240px; max-height:340px; overflow-y:auto; font-size:.8rem; line-height:1.75;}
  .pg-out::-webkit-scrollbar{width:4px;}
  .pg-out::-webkit-scrollbar-thumb{background:var(--line-2); border-radius:2px;}
  .ln{margin:0 0 10px; word-break:break-word; white-space:pre-wrap;}
  .who{font-weight:700; letter-spacing:.04em;}
  .ln.you .who{color:#fff;}
  .ln.you{color:var(--ink);}
  .ln.bot .who{color:var(--muted);}
  .ln.bot{color:#bdbdbd;}
  .ln.meta{color:var(--dim); font-size:.66rem; margin:-6px 0 12px 46px;}
  .ln.err .who{color:#0a0a0a; background:var(--ink); padding:0 6px; border-radius:3px;}
  .ln.err{color:var(--muted);}
  .ln.wait span:last-child::after{content:""; animation:dots 1.2s linear infinite;}
  @keyframes dots{0%{content:"";}25%{content:".";}50%{content:"..";}75%{content:"...";}}
  .pg-chips{display:flex; flex-wrap:wrap; gap:8px; padding:0 20px 14px;}
  .pg-chips button{
    font-family:inherit; font-size:.66rem; letter-spacing:.05em; color:var(--muted);
    background:transparent; border:1px solid var(--line); border-radius:6px;
    padding:5px 11px; cursor:pointer; transition:color .15s ease, border-color .15s ease;
  }
  .pg-chips button:hover{color:var(--ink); border-color:var(--line-2);}
  .pg-in{
    display:flex; align-items:center; gap:12px;
    border-top:1px solid var(--line); padding:12px 16px;
  }
  .pg-prompt{color:#fff; font-weight:700; font-size:.85rem;}
  .pg-in input{
    flex:1; background:transparent; border:none; outline:none;
    font-family:inherit; font-size:.8rem; color:var(--ink); letter-spacing:.02em;
  }
  .pg-in input::placeholder{color:var(--dim);}
  .pg-send{
    display:flex; align-items:center; justify-content:center;
    width:30px; height:30px; background:transparent; border:1px solid var(--line);
    border-radius:6px; cursor:pointer; color:var(--muted);
    transition:color .15s ease, border-color .15s ease;
  }
  .pg-send:hover{color:#fff; border-color:var(--ink);}
  .pg-send svg{width:14px; height:14px;}
  .pg-send:disabled{opacity:.4; cursor:not-allowed;}
  .pg-send.loading svg{display:none;}
  .pg-send.loading::after{
    content:""; width:12px; height:12px; border-radius:50%;
    border:1.5px solid var(--line-2); border-top-color:#fff;
    animation:spin .7s linear infinite;
  }
  @keyframes spin{to{transform:rotate(360deg);}}
  .pg-note{padding:0 20px 14px; font-size:.62rem; letter-spacing:.08em; color:var(--dim);}
  .pg-select{
    font-family:inherit; font-size:.64rem; color:var(--muted);
    background:var(--box); border:1px solid var(--line); border-radius:5px;
    padding:3px 6px; outline:none; cursor:pointer;
  }
  .pg-select:focus{color:var(--ink); border-color:var(--line-2);}
  .mini-btn{
    font-family:inherit; font-size:.6rem; letter-spacing:.14em; color:var(--muted);
    background:transparent; border:1px solid var(--line); border-radius:5px;
    padding:4px 10px; cursor:pointer; transition:color .15s ease, border-color .15s ease;
  }
  .mini-btn:hover{color:var(--ink); border-color:var(--line-2);}
  .mini-btn.ok{color:#0a0a0a; background:var(--ink); border-color:var(--ink);}
  #curlCode{min-height:0; font-size:.76rem;}
  #curlCode .p{color:#fff; font-weight:600;}
  #curlCode .f{color:var(--str);}
  .bottom{
    display:flex; flex-direction:column; gap:14px; margin-top:8px;
    transform:translateY(24px); opacity:0; transition:transform .7s cubic-bezier(.2,.8,.2,1), opacity .7s ease;
  }
  .bottom.reveal{transform:translateY(0); opacity:1;}
  .rule{height:1px; background:var(--line); width:100%;}
  .footline{display:flex; justify-content:space-between; font-size:.68rem; letter-spacing:.08em; color:var(--muted);}
  .st{display:inline-flex; align-items:center; gap:8px;}
  .st-dot{width:7px; height:7px; border-radius:50%; background:var(--dim); display:inline-block;}
  .st-dot.on{background:#fff; animation:pulse 1.8s ease-in-out infinite;}
  .st-dot.off{background:#fff;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.25;}}
  .marquee{
    border-top:1px solid var(--line); margin-top:28px;
    overflow:hidden; white-space:nowrap; padding:16px 0;
    opacity:0; transition:opacity 1s ease;
  }
  .marquee.reveal{opacity:1;}
  .marquee .track{display:inline-block; padding-left:100%; animation:scroll 48s linear infinite;}
  .marquee span{font-size:.78rem; letter-spacing:.05em; color:var(--muted);}
  .marquee .hi{color:#fff; font-weight:600;}
  .marquee .sep{margin:0 22px; color:var(--line-2);}
  @keyframes scroll{from{transform:translateX(0);}to{transform:translateX(-100%);}}
  @media (max-width:768px){
    main{padding:24px 20px;}
    pre{font-size:.74rem; padding:16px 18px 20px; min-height:300px;}
    .pg-out{min-height:200px;}
    .ep-d{display:none;}
  }
  @media (max-width:480px){
    main{padding:20px 16px;}
    .lbl{top:20px; left:20px; font-size:.6rem;}
    .yr{top:20px; right:20px; font-size:.6rem;}
    .anime-loader{width:100px; height:100px;}
    .orb{width:20px; height:20px;}
    pre{font-size:.68rem; padding:14px; min-height:280px;}
    .footline{flex-direction:column; gap:8px;}
    .ep-row{flex-wrap:wrap; gap:8px;}
  }
  @media (prefers-reduced-motion:reduce){
    *{animation-duration:.01ms !important; animation-iteration-count:1 !important;}
  }
</style>
</head>
<body>
<div id="loader">
  <div class="lbl">SASA DEV / CHATGPT FREE API</div>
  <div class="yr">2026</div>
  <div class="anime-loader">
    <div class="orb"></div>
    <div class="orb"></div>
    <div class="orb"></div>
  </div>
  <div id="pct">LOADING <span id="pctnum">0</span>%</div>
  <div class="bar"><i id="bar"></i></div>
</div>
<main id="main">
  <div class="topbar" id="topbar">
    <span>SASA DEV / CHATGPT FREE API</span>
    <span>2026</span>
  </div>
  <div class="hero">
    <div class="codebox">
      <div class="bar-top"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="name">api.js</span></div>
      <pre id="typed"></pre>
    </div>
  </div>
  <div class="section" id="secEndpoints">
    <div class="sec-label">ENDPOINTS</div>
    <div class="codebox">
      <div class="bar-top">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="name">endpoints.txt</span>
        <span class="right"><span id="copyHint" class="dim"></span></span>
      </div>
      <div class="ep-list">
        <div class="ep-row" data-path="/v1/chat"><span class="ep-m">GET</span><span class="ep-p">/v1/chat</span><span class="ep-d">chat completions &middot; openai compatible</span><span class="ep-flag">COPIED</span></div>
        <div class="ep-row" data-path="/chat?q=hello"><span class="ep-m">GET</span><span class="ep-p">/chat?q=hello</span><span class="ep-d">quick one shot chat</span><span class="ep-flag">COPIED</span></div>
        <div class="ep-row" data-path="/v1/models"><span class="ep-m">GET</span><span class="ep-p">/v1/models</span><span class="ep-d">live model list</span><span class="ep-flag">COPIED</span></div>
        <div class="ep-row" data-path="/v1/image?prompt=a+red+fox"><span class="ep-m">GET</span><span class="ep-p">/v1/image?prompt=...</span><span class="ep-d">text to image &middot; returns jpeg</span><span class="ep-flag">COPIED</span></div>
        <div class="ep-row" data-path="/v1/summarize"><span class="ep-m">POST</span><span class="ep-p">/v1/summarize</span><span class="ep-d">summarize long text</span><span class="ep-flag">COPIED</span></div>
        <div class="ep-row" data-path="/v1/translate"><span class="ep-m">POST</span><span class="ep-p">/v1/translate</span><span class="ep-d">translate between languages</span><span class="ep-flag">COPIED</span></div>
        <div class="ep-row" data-path="/v1/code"><span class="ep-m">POST</span><span class="ep-p">/v1/code</span><span class="ep-d">coding assistant</span><span class="ep-flag">COPIED</span></div>
        <div class="ep-row" data-path="/status"><span class="ep-m">GET</span><span class="ep-p">/status</span><span class="ep-d">service status &middot; uptime</span><span class="ep-flag">COPIED</span></div>
        <div class="ep-row" data-path="/health"><span class="ep-m">GET</span><span class="ep-p">/health</span><span class="ep-d">liveness probe</span><span class="ep-flag">COPIED</span></div>
      </div>
    </div>
  </div>
  <div class="section" id="secPlayground">
    <div class="sec-label">PLAYGROUND</div>
    <div class="codebox" id="playground">
      <div class="bar-top">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="name">playground.js</span>
        <span class="right"><select id="pgModel" class="pg-select"><option value="openai">openai</option><option value="openai-fast">openai-fast</option></select></span>
      </div>
      <div class="pg-out" id="pgOut"></div>
      <div class="pg-chips">
        <button type="button" data-fill="Explain quantum computing in simple words">quantum</button>
        <button type="button" data-fill="Write a haiku about the ocean">haiku</button>
        <button type="button" data-fill="ආයුබෝවන්! ඔබ කවුද?">sinhala</button>
      </div>
      <form class="pg-in" id="pgForm">
        <span class="pg-prompt">&gt;</span>
        <input id="pgText" type="text" autocomplete="off" placeholder="message the api...">
        <button class="pg-send" id="pgSend" type="submit" aria-label="send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>
      <div class="pg-note">free tier responses can take up to 30 seconds</div>
    </div>
  </div>
  <div class="section" id="secQuickstart">
    <div class="sec-label">QUICKSTART</div>
    <div class="codebox">
      <div class="bar-top">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="name">quickstart.sh</span>
        <span class="right"><button type="button" id="copyCurl" class="mini-btn">COPY</button></span>
      </div>
      <pre id="curlCode"><span class="p">$</span> curl -s -X POST <span class="f">BASE_URL</span>/v1/chat \\
    -H <span class="f">"Content-Type: application/json"</span> \\
    -d <span class="f">'{"messages":[{"role":"user","content":"Hello!"}]}'</span></pre>
    </div>
  </div>
  <div class="bottom" id="bottom">
    <div class="rule"></div>
    <div class="footline">
      <span class="st">API STATUS / <span class="st-dot" id="stDot"></span><span id="stText">CHECKING</span></span>
      <span>SASA DEV &copy; 2026</span>
    </div>
  </div>
</main>
<div class="marquee" id="marquee">
  <div class="track">
    <span>NO <span class="hi">API KEY</span><span class="sep">&#9670;</span>100% FREE<span class="sep">&#9670;</span>OPENAI COMPATIBLE<span class="sep">&#9670;</span><span class="hi">CHAT &middot; IMAGE &middot; TRANSLATE &middot; SUMMARIZE &middot; CODE</span><span class="sep">&#9670;</span>VERCEL + CLOUDFLARE READY<span class="sep">&#9670;</span>DEVELOPER <span class="hi">SASA DEV</span><span class="sep">&#9670;</span>ENDPOINTS READY<span class="sep">&#9670;</span>NO <span class="hi">API KEY</span><span class="sep">&#9670;</span>100% FREE<span class="sep">&#9670;</span>OPENAI COMPATIBLE<span class="sep">&#9670;</span><span class="hi">CHAT &middot; IMAGE &middot; TRANSLATE &middot; SUMMARIZE &middot; CODE</span><span class="sep">&#9670;</span>VERCEL + CLOUDFLARE READY<span class="sep">&#9670;</span>DEVELOPER <span class="hi">SASA DEV</span><span class="sep">&#9670;</span>ENDPOINTS READY<span class="sep">&#9670;</span></span>
  </div>
</div>
<script>
(function(){
  var pctEl = document.getElementById("pctnum");
  var barEl = document.getElementById("bar");
  var total = 1600;
  var start = performance.now();
  function tick(now){
    var t = Math.min((now - start) / total, 1);
    var progress = Math.floor(t * 100);
    pctEl.textContent = String(progress);
    barEl.style.width = progress + "%";
    if (t < 1) requestAnimationFrame(tick);
    else setTimeout(finish, 180);
  }
  requestAnimationFrame(tick);
  function finish(){
    var loader = document.getElementById("loader");
    loader.classList.add("hide");
    document.getElementById("main").classList.add("show");
    setTimeout(function(){
      var l = document.getElementById("loader");
      if (l) l.remove();
    }, 850);
    startTyping();
  }
  var lines = [
    '<span class="kw">const</span> <span class="key">api</span> = {',
    '  name: <span class="str">"ChatGPT Free API"</span>,',
    '  developer: <span class="str">"Sasa Dev"</span>,',
    '  price: <span class="str">"$0.00 forever"</span>,',
    '  auth: <span class="str">"none required"</span>,',
    '  endpoints: {',
    '    chat: <span class="str">"/v1/chat"</span>,',
    '    image: <span class="str">"/v1/image"</span>,',
    '    translate: <span class="str">"/v1/translate"</span>,',
    '    summarize: <span class="str">"/v1/summarize"</span>,',
    '    code: <span class="str">"/v1/code"</span>',
    '  },',
    '  sdk: <span class="str">"openai compatible"</span>,',
    '  status: <span class="str">"online"</span>',
    '};'
  ];
  function startTyping(){
    var el = document.getElementById("typed");
    var li = 0;
    function nextLine(){
      if (li >= lines.length){
        el.innerHTML += '<span id="cursor"></span>';
        revealFrame();
        return;
      }
      var div = document.createElement("div");
      el.appendChild(div);
      typeHTML(div, lines[li], function(){
        li++;
        setTimeout(nextLine, 80);
      });
    }
    nextLine();
  }
  function typeHTML(el, html, done){
    var parts = html.split(/(<[^>]+>)/g).filter(Boolean);
    var pi = 0;
    function step(){
      if (pi >= parts.length){ done(); return; }
      var part = parts[pi];
      if (part.charAt(0) === "<"){
        el.insertAdjacentHTML("beforeend", part);
        pi++;
        step();
      } else {
        var ci = 0;
        var span = document.createElement("span");
        el.appendChild(span);
        var iv = setInterval(function(){
          span.textContent += part.charAt(ci);
          ci++;
          if (ci >= part.length){ clearInterval(iv); pi++; step(); }
        }, 9);
      }
    }
    step();
  }
  function revealFrame(){
    document.getElementById("topbar").classList.add("reveal");
    var ids = ["secEndpoints", "secPlayground", "secQuickstart"];
    for (var i = 0; i < ids.length; i++){
      (function(el, delay){
        setTimeout(function(){ el.classList.add("reveal"); }, delay);
      })(document.getElementById(ids[i]), 140 * (i + 1));
    }
    setTimeout(function(){
      document.getElementById("bottom").classList.add("reveal");
      document.getElementById("marquee").classList.add("reveal");
    }, 480);
    checkStatus();
    loadModels();
  }

  var outEl = document.getElementById("pgOut");
  var formEl = document.getElementById("pgForm");
  var inputEl = document.getElementById("pgText");
  var sendBtn = document.getElementById("pgSend");
  var modelSel = document.getElementById("pgModel");
  var history = [];
  var busy = false;

  function addLine(cls, who, text){
    var ln = document.createElement("div");
    ln.className = "ln " + cls;
    var w = document.createElement("span");
    w.className = "who";
    w.textContent = who + " > ";
    ln.appendChild(w);
    var body = document.createElement("span");
    body.textContent = text;
    ln.appendChild(body);
    outEl.appendChild(ln);
    outEl.scrollTop = outEl.scrollHeight;
    return ln;
  }
  function addMeta(text){
    var ln = document.createElement("div");
    ln.className = "ln meta";
    ln.textContent = text;
    outEl.appendChild(ln);
    outEl.scrollTop = outEl.scrollHeight;
  }
  addLine("bot", "gpt", "ready. type a message below.");

  formEl.addEventListener("submit", function(e){
    e.preventDefault();
    if (busy) return;
    var value = inputEl.value.trim();
    if (!value) return;
    busy = true;
    sendBtn.disabled = true;
    sendBtn.classList.add("loading");
    inputEl.value = "";
    addLine("you", "you", value);
    history.push({ role: "user", content: value });
    var waitLine = addLine("wait bot", "gpt", "thinking");
    var t0 = performance.now();
    var payload = { model: modelSel.value || "openai", messages: history.slice(-12) };
    fetch("/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function(res){
        return res.json().then(function(data){ return { status: res.status, data: data }; });
      })
      .then(function(out){
        var answer = out.data && out.data.choices && out.data.choices[0] && out.data.choices[0].message && out.data.choices[0].message.content;
        if (out.status !== 200 || !answer){
          var msg = out.data && out.data.error && out.data.error.message ? out.data.error.message : "request failed with status " + out.status;
          throw new Error(msg);
        }
        history.push({ role: "assistant", content: answer });
        waitLine.className = "ln bot";
        waitLine.querySelector(".who").textContent = "gpt > ";
        waitLine.querySelector("span:last-child").textContent = answer;
        addMeta((out.data.model || "openai") + "  ·  " + Math.round(performance.now() - t0) + " ms");
      })
      .catch(function(err){
        waitLine.className = "ln err";
        waitLine.querySelector(".who").textContent = "error > ";
        waitLine.querySelector("span:last-child").textContent = err && err.message ? err.message : "something went wrong";
      })
      .then(function(){
        busy = false;
        sendBtn.disabled = false;
        sendBtn.classList.remove("loading");
        inputEl.focus();
      });
  });

  var chips = document.querySelectorAll(".pg-chips button");
  for (var c = 0; c < chips.length; c++){
    chips[c].addEventListener("click", function(){
      inputEl.value = this.getAttribute("data-fill");
      inputEl.focus();
    });
  }

  function checkStatus(){
    var dot = document.getElementById("stDot");
    var text = document.getElementById("stText");
    fetch("/health")
      .then(function(res){ return res.json(); })
      .then(function(data){
        if (data && data.healthy){
          dot.classList.add("on");
          text.textContent = "ONLINE";
        } else {
          throw new Error("down");
        }
      })
      .catch(function(){
        dot.classList.add("off");
        text.textContent = "OFFLINE";
      });
  }

  function loadModels(){
    fetch("/v1/models")
      .then(function(res){ return res.json(); })
      .then(function(data){
        var ids = (data && data.data ? data.data : []).map(function(m){ return m.id; }).filter(Boolean);
        if (!ids.length) return;
        if (ids.indexOf("openai") === -1) ids.unshift("openai");
        modelSel.innerHTML = "";
        for (var i = 0; i < ids.length; i++){
          var opt = document.createElement("option");
          opt.value = ids[i];
          opt.textContent = ids[i];
          modelSel.appendChild(opt);
        }
      })
      .catch(function(){});
  }

  function copyText(text, done){
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(function(){ fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done){
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (err) {}
    document.body.removeChild(ta);
  }

  var rows = document.querySelectorAll(".ep-row");
  for (var r = 0; r < rows.length; r++){
    rows[r].addEventListener("click", function(){
      var row = this;
      var base = location && location.origin && location.origin.indexOf("http") === 0 ? location.origin : "https://free-chatgpt-api-sasa-dev.vercel.app";
      copyText(base + row.getAttribute("data-path"), function(){
        row.classList.add("done");
        var hint = document.getElementById("copyHint");
        hint.textContent = "# copied " + row.getAttribute("data-path");
        setTimeout(function(){ row.classList.remove("done"); }, 1300);
        setTimeout(function(){ hint.textContent = ""; }, 2400);
      });
    });
  }

  var curlEl = document.getElementById("curlCode");
  var copyBtn = document.getElementById("copyCurl");
  copyBtn.addEventListener("click", function(){
    var base = location && location.origin && location.origin.indexOf("http") === 0 ? location.origin : "https://free-chatgpt-api-sasa-dev.vercel.app";
    var text = "$ " + curlEl.textContent.replace(/^\$\s*/, "").replace("BASE_URL", base);
    copyText(text, function(){
      copyBtn.classList.add("ok");
      copyBtn.textContent = "COPIED";
      setTimeout(function(){
        copyBtn.classList.remove("ok");
        copyBtn.textContent = "COPY";
      }, 1400);
    });
  });
})();
</script>
</body>
</html>`;

function renderPage() {
  return html;
}

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

async function handleRequest(input) {
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


const KNOWN_PATHS = ["/", "/favicon.ico", "/favicon.svg", "/status", "/health", "/chat", "/v1/chat", "/v1/models", "/v1/image", "/v1/summarize", "/v1/translate", "/v1/code"];

function normalizePath(pathname) {
  try {
    pathname = decodeURIComponent(pathname);
  } catch (err) {}
  if (pathname.startsWith("/api/main.js/")) {
    pathname = pathname.slice("/api/main.js".length);
  } else if (pathname === "/api/main.js" || pathname === "/api" || pathname === "/api/") {
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

async function handler(req, res) {
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
    const rawHeaders = {};
    for (const key of Object.keys(req.headers)) {
      const value = req.headers[key];
      rawHeaders[key] = typeof value === "string" ? value.slice(0, 120) : String(value).slice(0, 120);
    }
    const out = await handleRequest({
      method: req.method,
      path: resolvePath(req.headers, url),
      query: url.searchParams,
      body,
      env: process.env,
      ip: typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "",
      raw: { url: req.url, headers: rawHeaders },
      entry_version: ENTRY_VERSION
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

export default handler;
