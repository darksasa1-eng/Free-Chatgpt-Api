import { ok, fail, clampNumber, CORS } from "./shared.js";

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

export const ENDPOINTS = [
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

export async function chat(input) {
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

export async function listModels(input) {
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

export async function image(input) {
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

export async function summarize(input) {
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

export async function translate(input) {
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

export async function code(input) {
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

export async function status(input) {
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

export function health() {
  return ok({
    healthy: true,
    status: "ok",
    version: VERSION,
    developer: DEVELOPER,
    uptime_seconds: Math.round((Date.now() - STARTED_AT) / 1000),
    timestamp: new Date().toISOString()
  });
}

export function debugRoute(input) {
  return ok({
    resolved_path: input.path,
    raw: input.raw || null
  });
}
