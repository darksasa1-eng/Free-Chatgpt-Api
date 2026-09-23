const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ChatGPT Free API — by Sasa Dev</title>
<meta name="description" content="A 100% free, OpenAI compatible REST API for chat, image generation, summarizing, translation and code. No API key required.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2322d3ee' d='M13 2 3 14h9l-1 8 10-12h-9l1-8z'/%3E%3C/svg%3E">
<style>
:root{
  --bg:#060a10;
  --panel:#0b121b;
  --panel-2:#0f1722;
  --border:#1b2634;
  --border-2:#26364a;
  --text:#e8eef5;
  --muted:#93a4b8;
  --faint:#64748b;
  --g1:#34d399;
  --g2:#22d3ee;
  --danger:#f87171;
  --radius:14px;
  --mono:ui-monospace,SFMono-Regular,"JetBrains Mono",Menlo,Consolas,monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  background:var(--bg);
  color:var(--text);
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
::selection{background:rgba(34,211,238,.28)}
a{color:inherit;text-decoration:none}
.container{max-width:1080px;margin:0 auto;padding:0 24px}
.bg-grid{
  position:fixed;inset:0;z-index:-1;pointer-events:none;
  background:
    radial-gradient(720px 400px at 12% -6%,rgba(52,211,153,.11),transparent 62%),
    radial-gradient(720px 400px at 88% -2%,rgba(34,211,238,.10),transparent 62%),
    linear-gradient(rgba(148,163,184,.045) 1px,transparent 1px),
    linear-gradient(90deg,rgba(148,163,184,.045) 1px,transparent 1px);
  background-size:auto,auto,44px 44px,44px 44px;
}
.topbar{
  position:sticky;top:0;z-index:50;
  background:rgba(6,10,16,.72);
  backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);
  border-bottom:1px solid var(--border);
}
.topbar-inner{display:flex;align-items:center;gap:28px;height:64px}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:-.02em}
.brand-mark{
  width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,var(--g1),var(--g2));color:#052018;flex-shrink:0;
  box-shadow:0 4px 18px rgba(34,211,238,.35);
}
.brand-mark svg{width:19px;height:19px}
.brand-name{font-size:16.5px}
.brand-name em{font-style:normal;background:linear-gradient(90deg,var(--g1),var(--g2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.nav{display:flex;gap:22px;margin-left:auto}
.nav a{font-size:14px;color:var(--muted);font-weight:500;transition:color .15s}
.nav a:hover{color:var(--text)}
.status-pill{
  display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--muted);
  border:1px solid var(--border);border-radius:999px;padding:6px 13px;background:rgba(15,23,34,.6);white-space:nowrap;
}
.dot{width:8px;height:8px;border-radius:50%;background:var(--faint);animation:pulse-dot 1.8s ease-in-out infinite}
.status-pill.ok .dot{background:var(--g1);box-shadow:0 0 8px rgba(52,211,153,.8)}
.status-pill.ok{color:#a7f3d0;border-color:rgba(52,211,153,.35)}
.status-pill.down .dot{background:var(--danger);box-shadow:0 0 8px rgba(248,113,113,.8)}
.status-pill.down{color:#fecaca;border-color:rgba(248,113,113,.4)}
@keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:.35}}
.hero{padding:92px 0 56px;text-align:center}
.hero-badge{
  display:inline-flex;align-items:center;gap:8px;font-size:13px;color:#a7f3d0;
  border:1px solid rgba(52,211,153,.3);background:rgba(52,211,153,.07);
  border-radius:999px;padding:7px 16px;margin-bottom:26px;
}
.hero-badge svg{width:15px;height:15px}
.hero h1{
  font-size:clamp(38px,6.6vw,68px);font-weight:800;letter-spacing:-.035em;line-height:1.06;
  max-width:820px;margin:0 auto 20px;
}
.grad{background:linear-gradient(90deg,var(--g1) 10%,var(--g2) 90%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hero-sub{color:var(--muted);font-size:17.5px;max-width:640px;margin:0 auto 34px}
.hero-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:52px}
.btn{
  display:inline-flex;align-items:center;gap:9px;font-weight:700;font-size:14.5px;
  border-radius:12px;padding:12px 22px;cursor:pointer;border:1px solid transparent;
  transition:transform .15s,box-shadow .15s,background .15s,border-color .15s;
}
.btn svg{width:16px;height:16px}
.btn-primary{background:linear-gradient(135deg,var(--g1),var(--g2));color:#052018}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 10px 30px rgba(34,211,238,.3)}
.btn-ghost{background:rgba(15,23,34,.55);border-color:var(--border-2);color:var(--text)}
.btn-ghost:hover{border-color:var(--g2);color:#a5f3fc}
.btn-sm{padding:9px 15px;font-size:13px}
.hero-stats{
  display:grid;grid-template-columns:repeat(4,1fr);gap:14px;max-width:760px;margin:0 auto 52px;
}
.stat{
  background:rgba(11,18,27,.7);border:1px solid var(--border);border-radius:var(--radius);
  padding:18px 12px;display:flex;flex-direction:column;align-items:center;gap:4px;
}
.stat svg{width:19px;height:19px;color:var(--g2);margin-bottom:5px}
.stat b{font-size:21px;letter-spacing:-.02em}
.stat span{font-size:12px;color:var(--faint)}
.terminal{
  max-width:720px;margin:0 auto;text-align:left;
  background:#080d14;border:1px solid var(--border-2);border-radius:16px;overflow:hidden;
  box-shadow:0 24px 70px rgba(0,0,0,.5),0 0 0 1px rgba(34,211,238,.06);
}
.terminal-bar{
  display:flex;align-items:center;gap:7px;padding:11px 15px;
  background:rgba(15,23,34,.8);border-bottom:1px solid var(--border);
}
.tdot{width:11px;height:11px;border-radius:50%}
.tdot.r{background:#f87171}.tdot.y{background:#fbbf24}.tdot.g{background:#34d399}
.terminal-title{font-family:var(--mono);font-size:12px;color:var(--faint);margin-left:8px}
.copy-btn{
  margin-left:auto;display:inline-flex;align-items:center;gap:6px;cursor:pointer;
  background:transparent;border:1px solid var(--border-2);border-radius:8px;color:var(--muted);
  font-size:11.5px;font-weight:600;padding:5px 10px;transition:color .15s,border-color .15s;
  font-family:inherit;
}
.copy-btn:hover{color:var(--text);border-color:var(--g2)}
.copy-btn svg{width:13px;height:13px}
.terminal pre{border:none;border-radius:0;margin:0}
pre{
  font-family:var(--mono);font-size:13px;line-height:1.7;color:#c6d4e2;
  background:#080d14;border:1px solid var(--border);border-radius:12px;
  padding:17px 19px;overflow-x:auto;
}
pre .p{color:var(--g1)}
pre .c{color:var(--faint)}
pre .s{color:#a5d6ff}
.section{padding:88px 0}
.section-head{margin-bottom:40px}
.overline{
  font-family:var(--mono);font-size:12px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;
  color:var(--g2);display:block;margin-bottom:10px;
}
.section-head h2{font-size:clamp(26px,4vw,36px);font-weight:800;letter-spacing:-.03em}
.section-head p{color:var(--muted);margin-top:10px;max-width:620px}
.baseurl{
  display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);
  padding:13px 16px;margin-bottom:34px;
}
.baseurl-label{
  font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  color:var(--faint);background:rgba(148,163,184,.07);border:1px solid var(--border);
  padding:4px 9px;border-radius:7px;
}
.baseurl code{font-family:var(--mono);font-size:14px;color:#a5f3fc;flex:1;min-width:200px;overflow-x:auto;white-space:nowrap}
.ep-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:18px}
.ep-card{
  background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);
  padding:22px;display:flex;flex-direction:column;gap:13px;
  transition:transform .18s,border-color .18s,box-shadow .18s;
}
.ep-card:hover{transform:translateY(-3px);border-color:var(--border-2);box-shadow:0 14px 40px rgba(0,0,0,.35)}
.ep-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.ep-icon{
  width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.22);color:var(--g2);flex-shrink:0;
}
.ep-icon svg{width:17px;height:17px}
.method{
  font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.08em;
  padding:4px 8px;border-radius:6px;
}
.m-get{color:#4ade80;background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.35)}
.m-post{color:#22d3ee;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.35)}
.ep-path{font-family:var(--mono);font-size:14px;font-weight:600;color:var(--text)}
.ep-card > p{color:var(--muted);font-size:14px;flex:1}
.ep-note{font-size:12.5px;color:var(--faint);font-family:var(--mono)}
.ep-params{display:flex;flex-wrap:wrap;gap:6px}
.ep-params span{
  font-family:var(--mono);font-size:11.5px;color:var(--muted);
  background:rgba(148,163,184,.07);border:1px solid var(--border);border-radius:6px;padding:3px 8px;
}
.ep-params span.req{color:#fbbf24;border-color:rgba(251,191,36,.35)}
.ep-example summary{
  list-style:none;cursor:pointer;display:flex;align-items:center;gap:7px;
  font-size:12.5px;font-weight:600;color:var(--faint);user-select:none;
}
.ep-example summary::-webkit-details-marker{display:none}
.ep-example summary svg{width:14px;height:14px;transition:transform .18s}
.ep-example[open] summary svg{transform:rotate(180deg)}
.ep-example summary:hover{color:var(--text)}
.ep-example pre{margin-top:10px;padding:13px 15px;font-size:12px}
.playground{
  display:grid;grid-template-columns:300px 1fr;
  background:var(--panel);border:1px solid var(--border);border-radius:18px;overflow:hidden;
  box-shadow:0 30px 80px rgba(0,0,0,.4);
}
.pg-side{
  padding:24px;border-right:1px solid var(--border);display:flex;flex-direction:column;gap:18px;
  background:rgba(8,13,20,.5);
}
.pg-field label{display:flex;justify-content:space-between;font-size:12.5px;font-weight:700;color:var(--muted);margin-bottom:8px;letter-spacing:.02em}
.pg-field label b{color:var(--g2);font-family:var(--mono);font-weight:600}
select,textarea,input[type="text"]{
  width:100%;background:#080d14;border:1px solid var(--border-2);border-radius:10px;
  color:var(--text);font-size:13.5px;padding:10px 12px;outline:none;font-family:inherit;
  transition:border-color .15s;
}
select:focus,textarea:focus{border-color:var(--g2)}
textarea{resize:none;line-height:1.5}
input[type="range"]{width:100%;accent-color:var(--g2);cursor:pointer}
.pg-chips{display:flex;flex-wrap:wrap;gap:7px}
.chip{
  font-size:12px;color:var(--muted);background:rgba(148,163,184,.06);
  border:1px solid var(--border);border-radius:999px;padding:6px 12px;cursor:pointer;
  transition:color .15s,border-color .15s;font-family:inherit;text-align:left;
}
.chip:hover{color:#a5f3fc;border-color:var(--g2)}
.pg-main{display:flex;flex-direction:column;min-height:540px}
.pg-messages{flex:1;overflow-y:auto;padding:26px;scrollbar-width:thin;scrollbar-color:#26364a transparent}
.pg-messages::-webkit-scrollbar{width:6px}
.pg-messages::-webkit-scrollbar-thumb{background:#26364a;border-radius:3px}
.pg-empty{
  height:100%;min-height:340px;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;color:var(--faint);text-align:center;
}
.pg-empty svg{width:34px;height:34px;color:#26364a}
.pg-empty p{font-size:14.5px;color:var(--muted)}
.pg-empty span{font-size:12px;font-family:var(--mono)}
.msg{display:flex;gap:11px;margin-bottom:16px;animation:rise .18s ease-out}
@keyframes rise{from{transform:translateY(7px);opacity:0}to{transform:translateY(0);opacity:1}}
.msg.user{flex-direction:row-reverse}
.avatar{
  width:31px;height:31px;border-radius:9px;display:flex;align-items:center;justify-content:center;
  flex-shrink:0;margin-top:2px;
}
.avatar svg{width:15px;height:15px}
.msg.bot .avatar{background:linear-gradient(135deg,var(--g1),var(--g2));color:#052018}
.msg.user .avatar{background:#182230;color:#9fb1c3;border:1px solid var(--border-2)}
.msg-col{max-width:78%;display:flex;flex-direction:column}
.msg.user .msg-col{align-items:flex-end}
.bubble{
  padding:11px 15px;border-radius:14px;font-size:14.5px;line-height:1.6;
  white-space:pre-wrap;word-break:break-word;
}
.msg.bot .bubble{background:var(--panel-2);border:1px solid var(--border);border-top-left-radius:5px}
.msg.user .bubble{
  background:linear-gradient(135deg,rgba(52,211,153,.15),rgba(34,211,238,.15));
  border:1px solid rgba(52,211,153,.32);border-top-right-radius:5px;
}
.msg.error .bubble{background:rgba(248,113,113,.07);border-color:rgba(248,113,113,.45);color:#fca5a5}
.bubble.typing{color:var(--faint);animation:typing 1s ease-in-out infinite}
@keyframes typing{0%,100%{opacity:.35}50%{opacity:1}}
.meta{font-size:11.5px;color:var(--faint);margin-top:6px;font-family:var(--mono)}
.pg-raw{border-top:1px solid var(--border)}
.pg-raw summary{
  list-style:none;cursor:pointer;padding:10px 26px;font-size:12.5px;font-weight:600;color:var(--faint);
  display:flex;align-items:center;gap:7px;user-select:none;
}
.pg-raw summary::-webkit-details-marker{display:none}
.pg-raw summary svg{width:14px;height:14px;transition:transform .18s}
.pg-raw[open] summary svg{transform:rotate(180deg)}
.pg-raw summary:hover{color:var(--text)}
.pg-raw pre{border:none;border-radius:0;max-height:260px}
.pg-input{display:flex;gap:12px;padding:18px 26px 22px;border-top:1px solid var(--border);align-items:flex-end}
.pg-input textarea{flex:1;border-radius:12px;min-height:46px;max-height:140px;font-size:14.5px;padding:12px 15px}
.btn-send{
  width:46px;height:46px;padding:0;justify-content:center;border-radius:12px;flex-shrink:0;
}
.btn-send svg{width:18px;height:18px}
.btn-send:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}
.btn-send.loading svg{display:none}
.btn-send.loading::after{
  content:"";width:17px;height:17px;border-radius:50%;
  border:2.5px solid rgba(5,32,24,.3);border-top-color:#052018;
  animation:spin .7s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg)}}
.tabs{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap}
.tab{
  padding:9px 18px;border-radius:10px;font-size:13.5px;font-weight:600;color:var(--muted);
  background:transparent;border:1px solid transparent;cursor:pointer;font-family:inherit;
  transition:all .15s;
}
.tab:hover{color:var(--text)}
.tab.active{color:var(--text);background:var(--panel-2);border-color:var(--border-2)}
.hidden{display:none}
.faq-list{display:flex;flex-direction:column;gap:12px;max-width:780px}
.faq{
  background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);
  padding:19px 22px;transition:border-color .18s;
}
.faq[open]{border-color:var(--border-2)}
.faq summary{
  list-style:none;cursor:pointer;font-weight:650;font-size:15.5px;
  display:flex;align-items:center;justify-content:space-between;gap:14px;user-select:none;
}
.faq summary::-webkit-details-marker{display:none}
.faq summary svg{width:17px;height:17px;color:var(--faint);flex-shrink:0;transition:transform .18s}
.faq[open] summary svg{transform:rotate(180deg)}
.faq p{color:var(--muted);font-size:14.5px;margin-top:12px}
footer{border-top:1px solid var(--border);padding:30px 0;margin-top:40px}
.footer-inner{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}
.footer-inner .brand{font-size:14.5px}
.footer-inner .brand-mark{width:28px;height:28px;border-radius:8px}
.footer-inner .brand-mark svg{width:15px;height:15px}
.footer-meta{font-size:13px;color:var(--faint);display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.footer-meta a{color:var(--muted)}
.footer-meta a:hover{color:var(--text)}
@media (max-width:920px){
  .playground{grid-template-columns:1fr}
  .pg-side{border-right:none;border-bottom:1px solid var(--border);flex-direction:row;flex-wrap:wrap}
  .pg-field{flex:1;min-width:200px}
  .pg-main{min-height:0}
  .pg-messages{min-height:320px}
  .nav{display:none}
  .hero{padding:64px 0 40px}
  .section{padding:64px 0}
  .hero-stats{grid-template-columns:repeat(2,1fr)}
}
</style>
</head>
<body>
<div class="bg-grid"></div>
<header class="topbar">
  <div class="container topbar-inner">
    <a class="brand" href="#">
      <span class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
      <span class="brand-name">ChatGPT <em>Free API</em></span>
    </a>
    <nav class="nav">
      <a href="#endpoints">Endpoints</a>
      <a href="#playground">Playground</a>
      <a href="#docs">Docs</a>
      <a href="#faq">FAQ</a>
    </nav>
    <div class="status-pill" id="statusPill"><span class="dot"></span><span id="statusText">Checking status</span></div>
  </div>
</header>
<main>
<section class="hero">
  <div class="container">
    <div class="hero-badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
      No API key &middot; No signup &middot; 100% free
    </div>
    <h1>The free <span class="grad">ChatGPT API</span> for every developer</h1>
    <p class="hero-sub">An OpenAI compatible REST API for chat, image generation, summarizing, translation and code help. Zero cost, zero keys, deployable anywhere in seconds.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#playground">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        Try the playground
      </a>
      <a class="btn btn-ghost" href="#docs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
        Read the docs
      </a>
    </div>
    <div class="hero-stats">
      <div class="stat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
        <b>9</b><span>REST endpoints</span>
      </div>
      <div class="stat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
        <b>$0</b><span>free forever</span>
      </div>
      <div class="stat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
        <b>0</b><span>API keys needed</span>
      </div>
      <div class="stat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <b>OpenAI</b><span>compatible shape</span>
      </div>
    </div>
    <div class="terminal">
      <div class="terminal-bar">
        <span class="tdot r"></span><span class="tdot y"></span><span class="tdot g"></span>
        <span class="terminal-title">quickstart</span>
        <button class="copy-btn" type="button" data-copy-target="curlQuick">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <span>Copy</span>
        </button>
      </div>
      <pre id="curlQuick"><span class="p">$</span> curl -s -X POST https://chatgpt-free-api-sasa-dev.vercel.app/v1/chat \
    -H <span class="s">"Content-Type: application/json"</span> \
    -d <span class="s">'{"messages":[{"role":"user","content":"Hello!"}]}'</span>

<span class="c">{"ok":true,"choices":[{"message":{"role":"assistant",
  "content":"Hey there! How can I help you today?"}}]}</span></pre>
    </div>
  </div>
</section>
<section id="playground" class="section">
  <div class="container">
    <div class="section-head">
      <span class="overline">Live sandbox</span>
      <h2>Playground</h2>
      <p>Chat with the real API right from this page. Everything you send hits the same public endpoint you will call from your own code.</p>
    </div>
    <div class="playground">
      <aside class="pg-side">
        <div class="pg-field">
          <label for="pgModel">Model</label>
          <select id="pgModel"></select>
        </div>
        <div class="pg-field">
          <label for="pgTemp">Temperature <b id="pgTempVal">0.7</b></label>
          <input type="range" id="pgTemp" min="0" max="2" step="0.1" value="0.7">
        </div>
        <div class="pg-field">
          <label for="pgSystem">System prompt</label>
          <textarea id="pgSystem" rows="3" placeholder="Optional instructions for the assistant"></textarea>
        </div>
        <div class="pg-field">
          <label>Try an example</label>
          <div class="pg-chips">
            <button type="button" class="chip">Explain quantum computing like I am five</button>
            <button type="button" class="chip">ලංකාව ගැන කෙටියෙන් කියන්න</button>
            <button type="button" class="chip">Write a haiku about the ocean</button>
            <button type="button" class="chip">Give me tea brand name ideas</button>
          </div>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" id="pgClear">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Clear chat
        </button>
      </aside>
      <div class="pg-main">
        <div class="pg-messages" id="pgMessages"></div>
        <details class="pg-raw">
          <summary>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            Raw JSON response
          </summary>
          <pre id="pgRaw">{ }</pre>
        </details>
        <form class="pg-input" id="pgForm">
          <textarea id="pgText" rows="1" placeholder="Message the API..."></textarea>
          <button class="btn btn-primary btn-send" id="pgSend" type="submit" aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
<section id="endpoints" class="section">
  <div class="container">
    <div class="section-head">
      <span class="overline">API reference</span>
      <h2>Endpoints</h2>
      <p>Nine production ready routes with zero authentication. Every response is JSON unless stated otherwise, and CORS is open so browsers can call the API directly.</p>
    </div>
    <div class="baseurl">
      <span class="baseurl-label">Base URL</span>
      <code id="baseUrl">https://chatgpt-free-api-sasa-dev.vercel.app</code>
      <button class="copy-btn" type="button" data-copy-target="baseUrl">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <span>Copy</span>
      </button>
    </div>
    <div class="ep-grid">
      <article class="ep-card">
        <div class="ep-head">
          <span class="ep-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></span>
          <span class="method m-post">POST</span>
          <code class="ep-path">/v1/chat</code>
        </div>
        <p>Send a full conversation, get an assistant reply. The response is OpenAI chat.completion compatible, so existing SDKs work with just a base URL swap.</p>
        <div class="ep-params"><span class="req">messages *</span><span>model</span><span>temperature</span></div>
        <span class="ep-note">GET /chat?q=hello gives instant one shot answers</span>
        <details class="ep-example">
          <summary>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            Example
          </summary>
          <pre id="exChat">curl -X POST "https://chatgpt-free-api-sasa-dev.vercel.app/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello!"}]}'</pre>
        </details>
      </article>
      <article class="ep-card">
        <div class="ep-head">
          <span class="ep-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span>
          <span class="method m-get">GET</span>
          <code class="ep-path">/v1/models</code>
        </div>
        <p>Live list of every model the gateway currently serves, in the OpenAI list format your SDK already expects.</p>
        <div class="ep-params"><span>no params</span></div>
        <details class="ep-example">
          <summary>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            Example
          </summary>
          <pre id="exModels">curl "https://chatgpt-free-api-sasa-dev.vercel.app/v1/models"</pre>
        </details>
      </article>
      <article class="ep-card">
        <div class="ep-head">
          <span class="ep-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></span>
          <span class="method m-get">GET</span>
          <code class="ep-path">/v1/image</code>
        </div>
        <p>Text to image generation. Returns a ready JPEG you can hot link, embed or download directly.</p>
        <div class="ep-params"><span class="req">prompt *</span><span>width</span><span>height</span><span>model</span><span>seed</span></div>
        <details class="ep-example">
          <summary>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            Example
          </summary>
          <pre id="exImage">curl -o art.jpg "https://chatgpt-free-api-sasa-dev.vercel.app/v1/image?prompt=neon+colombo+skyline&width=1024&height=1024"</pre>
        </details>
      </article>
      <article class="ep-card">
        <div class="ep-head">
          <span class="ep-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></span>
          <span class="method m-post">POST</span>
          <code class="ep-path">/v1/summarize</code>
        </div>
        <p>Turn long articles, transcripts or documents into tight summaries. Pick short, medium or long output.</p>
        <div class="ep-params"><span class="req">text *</span><span>length</span></div>
        <details class="ep-example">
          <summary>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            Example
          </summary>
          <pre id="exSummarize">curl -X POST "https://chatgpt-free-api-sasa-dev.vercel.app/v1/summarize" \
  -H "Content-Type: application/json" \
  -d '{"text":"Paste any long article here...","length":"short"}'</pre>
        </details>
      </article>
      <article class="ep-card">
        <div class="ep-head">
          <span class="ep-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
          <span class="method m-post">POST</span>
          <code class="ep-path">/v1/translate</code>
        </div>
        <p>Translate between any languages. The source language is detected automatically when omitted.</p>
        <div class="ep-params"><span class="req">text *</span><span>to</span><span>from</span></div>
        <details class="ep-example">
          <summary>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            Example
          </summary>
          <pre id="exTranslate">curl -X POST "https://chatgpt-free-api-sasa-dev.vercel.app/v1/translate" \
  -H "Content-Type: application/json" \
  -d '{"text":"ආයුබෝවන්","to":"English"}'</pre>
        </details>
      </article>
      <article class="ep-card">
        <div class="ep-head">
          <span class="ep-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></span>
          <span class="method m-post">POST</span>
          <code class="ep-path">/v1/code</code>
        </div>
        <p>A focused coding assistant for generation, debugging and refactoring. Ask in plain English, get working code.</p>
        <div class="ep-params"><span class="req">prompt *</span><span>language</span></div>
        <details class="ep-example">
          <summary>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            Example
          </summary>
          <pre id="exCode">curl -X POST "https://chatgpt-free-api-sasa-dev.vercel.app/v1/code" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"flatten a nested array","language":"javascript"}'</pre>
        </details>
      </article>
      <article class="ep-card">
        <div class="ep-head">
          <span class="ep-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></span>
          <span class="method m-get">GET</span>
          <code class="ep-path">/status</code>
        </div>
        <p>Full service status, version, uptime and the live endpoint catalogue in a single response.</p>
        <div class="ep-params"><span>no params</span></div>
        <details class="ep-example">
          <summary>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            Example
          </summary>
          <pre id="exStatus">curl "https://chatgpt-free-api-sasa-dev.vercel.app/status"</pre>
        </details>
      </article>
      <article class="ep-card">
        <div class="ep-head">
          <span class="ep-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>
          <span class="method m-get">GET</span>
          <code class="ep-path">/health</code>
        </div>
        <p>Feather light liveness probe with zero upstream calls. Perfect for uptime monitors and cron pings.</p>
        <div class="ep-params"><span>no params</span></div>
        <details class="ep-example">
          <summary>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            Example
          </summary>
          <pre id="exHealth">curl "https://chatgpt-free-api-sasa-dev.vercel.app/health"</pre>
        </details>
      </article>
    </div>
  </div>
</section>
<section id="docs" class="section">
  <div class="container">
    <div class="section-head">
      <span class="overline">Quick start</span>
      <h2>Use it in seconds</h2>
      <p>No install, no auth layer, no config. Pick your language, paste the snippet and you are already calling the API.</p>
    </div>
    <div class="tabs">
      <button type="button" class="tab active" data-tab="curl">cURL</button>
      <button type="button" class="tab" data-tab="js">JavaScript</button>
      <button type="button" class="tab" data-tab="py">Python</button>
    </div>
    <pre data-panel="curl" id="exCurl">curl -X POST "https://chatgpt-free-api-sasa-dev.vercel.app/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Give me 3 startup ideas"}]}'</pre>
    <pre data-panel="js" id="exJs" class="hidden">const res = await fetch("https://chatgpt-free-api-sasa-dev.vercel.app/v1/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "Give me 3 startup ideas" }]
  })
});

const data = await res.json();
console.log(data.choices[0].message.content);</pre>
    <pre data-panel="py" id="exPy" class="hidden">import requests

res = requests.post(
    "https://chatgpt-free-api-sasa-dev.vercel.app/v1/chat",
    json={"messages": [{"role": "user", "content": "Give me 3 startup ideas"}]},
)
data = res.json()
print(data["choices"][0]["message"]["content"])</pre>
  </div>
</section>
<section id="faq" class="section">
  <div class="container">
    <div class="section-head">
      <span class="overline">FAQ</span>
      <h2>Good to know</h2>
    </div>
    <div class="faq-list">
      <details class="faq">
        <summary>Is it really 100% free?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <p>Yes. There is no key, no card and nothing to purchase. A public inference gateway sponsors the free tier, and a soft limit of 60 requests per minute per IP keeps it fair for everyone.</p>
      </details>
      <details class="faq">
        <summary>Do I need an account or a token?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <p>No. Every endpoint is open. Point any HTTP client, or an OpenAI SDK with a custom base URL, at the API and start calling it immediately.</p>
      </details>
      <details class="faq">
        <summary>Which AI models power it?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <p>The gateway serves community hosted open models, and the live list always wins. Hit /v1/models to see what is available right now. You can also point the TEXT_API_BASE environment variable at any OpenAI compatible upstream and this API becomes a thin proxy for it.</p>
      </details>
      <details class="faq">
        <summary>Can I use this in production apps?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <p>The code is MIT licensed and deployment ready on Vercel and Cloudflare Workers. Keep the rate limit in mind, put your own auth in front if the app is public, and wire your uptime monitor to /health.</p>
      </details>
    </div>
  </div>
</section>
</main>
<footer>
  <div class="container footer-inner">
    <a class="brand" href="#">
      <span class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
      <span class="brand-name">ChatGPT <em>Free API</em></span>
    </a>
    <div class="footer-meta">
      <a href="#endpoints">Endpoints</a>
      <a href="#playground">Playground</a>
      <a href="#docs">Docs</a>
      <span>Built by <b>Sasa Dev</b></span>
      <span>&copy; <span id="year">2026</span></span>
    </div>
  </div>
</footer>
<script>
(function(){
  var ICON_BOT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
  var ICON_USER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  var EMPTY_HTML = '<div class="pg-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><p>Start the conversation. Ask anything.</p><span>powered by the free /v1/chat endpoint</span></div>';

  var msgsEl = document.getElementById("pgMessages");
  var formEl = document.getElementById("pgForm");
  var inputEl = document.getElementById("pgText");
  var sendBtn = document.getElementById("pgSend");
  var modelSel = document.getElementById("pgModel");
  var tempEl = document.getElementById("pgTemp");
  var tempVal = document.getElementById("pgTempVal");
  var sysEl = document.getElementById("pgSystem");
  var rawEl = document.getElementById("pgRaw");
  var clearBtn = document.getElementById("pgClear");
  var pill = document.getElementById("statusPill");
  var pillText = document.getElementById("statusText");
  var history = [];
  var busy = false;

  msgsEl.innerHTML = EMPTY_HTML;

  function now() { return performance.now ? performance.now() : Date.now(); }
  function scrollBottom() { msgsEl.scrollTop = msgsEl.scrollHeight; }

  function addBubble(role, text, isError) {
    var empty = msgsEl.querySelector(".pg-empty");
    if (empty) empty.remove();
    var row = document.createElement("div");
    row.className = "msg " + role + (isError ? " error" : "");
    var avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.innerHTML = role === "user" ? ICON_USER : ICON_BOT;
    var col = document.createElement("div");
    col.className = "msg-col";
    var bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;
    col.appendChild(bubble);
    row.appendChild(avatar);
    row.appendChild(col);
    msgsEl.appendChild(row);
    scrollBottom();
    return { row: row, col: col, bubble: bubble };
  }

  function addMeta(col, text) {
    var meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = text;
    col.appendChild(meta);
    scrollBottom();
  }

  function setLoading(state) {
    busy = state;
    sendBtn.disabled = state;
    sendBtn.classList.toggle("loading", state);
  }

  function sendMessage(text) {
    if (busy) return;
    var value = (text || "").trim();
    if (!value) return;
    setLoading(true);
    addBubble("user", value, false);
    history.push({ role: "user", content: value });
    var parts = addBubble("bot", "...", false);
    parts.bubble.classList.add("typing");
    var t0 = now();
    var payload = { model: modelSel.value || "openai", messages: history.slice(-12) };
    var sys = sysEl.value.trim();
    if (sys) payload.messages = [{ role: "system", content: sys }].concat(payload.messages);
    var t = parseFloat(tempEl.value);
    if (!isNaN(t)) payload.temperature = t;
    fetch("/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function(res) {
        return res.json().then(function(data) { return { status: res.status, data: data }; });
      })
      .then(function(out) {
        rawEl.textContent = JSON.stringify(out.data, null, 2);
        var answer = out.data && out.data.choices && out.data.choices[0] && out.data.choices[0].message && out.data.choices[0].message.content;
        if (out.status !== 200 || !answer) {
          var msgText = out.data && out.data.error && out.data.error.message ? out.data.error.message : "Request failed with status " + out.status;
          throw new Error(msgText);
        }
        history.push({ role: "assistant", content: answer });
        parts.bubble.classList.remove("typing");
        parts.bubble.textContent = answer;
        addMeta(parts.col, out.data.model + "  ·  " + Math.round(now() - t0) + " ms");
      })
      .catch(function(err) {
        parts.bubble.classList.remove("typing");
        parts.row.classList.add("error");
        parts.bubble.textContent = err && err.message ? err.message : "Something went wrong. Please try again.";
      })
      .then(function() {
        setLoading(false);
        inputEl.focus();
      });
  }

  formEl.addEventListener("submit", function(e) {
    e.preventDefault();
    var value = inputEl.value;
    inputEl.value = "";
    inputEl.style.height = "auto";
    sendMessage(value);
  });

  inputEl.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formEl.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  });

  inputEl.addEventListener("input", function() {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + "px";
  });

  tempEl.addEventListener("input", function() {
    tempVal.textContent = Number(tempEl.value).toFixed(1);
  });

  clearBtn.addEventListener("click", function() {
    history = [];
    rawEl.textContent = "{ }";
    msgsEl.innerHTML = EMPTY_HTML;
  });

  var chips = document.querySelectorAll(".chip");
  for (var i = 0; i < chips.length; i++) {
    chips[i].addEventListener("click", function() {
      inputEl.value = this.textContent;
      inputEl.focus();
      inputEl.dispatchEvent(new Event("input"));
    });
  }

  function refreshStatus() {
    fetch("/health")
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.healthy) {
          pill.classList.add("ok");
          pill.classList.remove("down");
          pillText.textContent = "All systems operational";
        } else {
          throw new Error("unhealthy");
        }
      })
      .catch(function() {
        pill.classList.add("down");
        pill.classList.remove("ok");
        pillText.textContent = "Status check failed";
      });
  }
  refreshStatus();
  setInterval(refreshStatus, 60000);

  fetch("/v1/models")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var ids = (data && data.data ? data.data : []).map(function(m) { return m.id; }).filter(Boolean);
      if (!ids.length) ids = ["openai", "openai-fast"];
      if (ids.indexOf("openai") === -1) ids.unshift("openai");
      modelSel.innerHTML = "";
      for (var i = 0; i < ids.length; i++) {
        var opt = document.createElement("option");
        opt.value = ids[i];
        opt.textContent = ids[i];
        modelSel.appendChild(opt);
      }
    })
    .catch(function() {
      modelSel.innerHTML = "";
      var defaults = ["openai", "openai-fast"];
      for (var i = 0; i < defaults.length; i++) {
        var opt = document.createElement("option");
        opt.value = defaults[i];
        opt.textContent = defaults[i];
        modelSel.appendChild(opt);
      }
    });

  var copyBtns = document.querySelectorAll("[data-copy-target]");
  for (var c = 0; c < copyBtns.length; c++) {
    copyBtns[c].addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      var btn = this;
      var target = document.getElementById(btn.getAttribute("data-copy-target"));
      if (!target) return;
      var text = target.textContent;
      var label = btn.querySelector("span");
      var done = function() {
        if (!label) return;
        var old = label.textContent;
        label.textContent = "Copied";
        setTimeout(function() { label.textContent = old; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function() {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (err) {}
        document.body.removeChild(ta);
      }
    });
  }

  var tabs = document.querySelectorAll("[data-tab]");
  for (var t = 0; t < tabs.length; t++) {
    tabs[t].addEventListener("click", function() {
      var name = this.getAttribute("data-tab");
      for (var x = 0; x < tabs.length; x++) tabs[x].classList.toggle("active", tabs[x] === this);
      var panels = document.querySelectorAll("[data-panel]");
      for (var y = 0; y < panels.length; y++) {
        panels[y].classList.toggle("hidden", panels[y].getAttribute("data-panel") !== name);
      }
    });
  }

  document.getElementById("year").textContent = String(new Date().getFullYear());
})();
</script>
</body>
</html>`;

export function renderPage() {
  return html;
}
