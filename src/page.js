const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>ChatGPT Free API — Sasa Dev</title>
<meta name="description" content="chatgpt free api • 100% free • no api key • openai compatible • by Sasa Dev" />
<meta property="og:type" content="website" />
<meta property="og:title" content="ChatGPT Free API — Sasa Dev" />
<meta property="og:description" content="100% free openai compatible api • chat · image · translate · summarize · code • no api key" />
<meta property="og:image" content="https://raw.githubusercontent.com/darksasa1-eng/Free-Chatgpt-Api/main/assets/banner.png" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ececec' d='M13 2 3 14h9l-1 8 10-12h-9l1-8z'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#050505; --panel:#0b0b0b; --panel-2:#111111;
    --line:#232323; --line-2:#343434;
    --ink:#ececec; --dim:#7f7f7f; --faint:#4b4b4b;
  }
  *{box-sizing:border-box; margin:0; padding:0;}
  html{scroll-behavior:smooth;}
  html,body{height:100%;}
  body{
    background:var(--bg); color:var(--ink);
    font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
    overflow-x:hidden; -webkit-font-smoothing:antialiased;
  }
  ::selection{background:var(--ink); color:var(--bg);}
  button{font-family:inherit;}
  #boot{
    position:fixed; inset:0; z-index:60; background:var(--bg);
    display:flex; align-items:center; justify-content:center;
    transition:opacity .7s ease, transform .7s ease;
  }
  #boot.hide{opacity:0; transform:translateY(-1.5%); pointer-events:none;}
  .boot-inner{width:min(320px,80vw);}
  .boot-pct{font-size:56px; font-weight:400; letter-spacing:-.02em; line-height:1;}
  .boot-pct small{font-size:20px; color:var(--dim);}
  .boot-track{height:1px; background:var(--line); margin:22px 0 18px; position:relative; overflow:hidden;}
  .boot-track i{position:absolute; inset:0; width:0%; background:var(--ink); transition:width .12s linear;}
  .boot-log{height:88px;}
  .boot-log div{font-size:10.5px; letter-spacing:.06em; color:var(--faint); margin-bottom:6px; opacity:0; transform:translateY(4px); transition:opacity .3s ease, transform .3s ease;}
  .boot-log div.on{opacity:1; transform:translateY(0);}
  .boot-log b{color:var(--dim); font-weight:400;}
  .boot-corner{position:absolute; top:26px; left:32px; font-size:10px; letter-spacing:.2em; color:var(--faint);}
  .boot-corner-r{left:auto; right:32px;}
  .wrap{max-width:1060px; margin:0 auto; padding:0 28px;}
  main{opacity:0; transition:opacity .7s ease .1s;}
  main.show{opacity:1;}
  .topbar{
    display:flex; align-items:center; justify-content:space-between;
    padding:20px 0; border-bottom:1px solid var(--line);
    font-size:11px; letter-spacing:.18em; color:var(--dim);
  }
  .topbar b{color:var(--ink); font-weight:700; letter-spacing:.18em;}
  .hero{padding:84px 0 72px; border-bottom:1px solid var(--line);}
  .hero-tag{
    display:inline-block; font-size:10.5px; letter-spacing:.24em; color:var(--dim);
    border:1px solid var(--line-2); padding:6px 12px; margin-bottom:30px;
  }
  .hero h1{
    font-size:clamp(46px,9vw,104px); line-height:.98; letter-spacing:-.04em;
    font-weight:800; text-transform:uppercase;
  }
  .hero h1 .ghost{
    display:block; color:transparent;
    -webkit-text-stroke:1.5px var(--ink);
    text-stroke:1.5px var(--ink);
  }
  .hero p{max-width:600px; color:var(--dim); font-size:14px; line-height:1.8; margin:30px 0 38px;}
  .hero p b{color:var(--ink); font-weight:500;}
  .stat-strip{display:flex; flex-wrap:wrap; border:1px solid var(--line);}
  .stat-cell{flex:1; min-width:150px; padding:16px 18px; border-right:1px solid var(--line);}
  .stat-cell:last-child{border-right:none;}
  .stat-cell .k{font-size:9.5px; letter-spacing:.22em; color:var(--faint); margin-bottom:7px;}
  .stat-cell .v{font-size:15px; font-weight:700; letter-spacing:.02em;}
  .sec{padding:64px 0 8px;}
  .sec-head{display:flex; align-items:baseline; gap:16px; margin-bottom:22px;}
  .sec-num{font-size:11px; color:var(--faint); letter-spacing:.1em;}
  .sec-title{font-size:13px; font-weight:700; letter-spacing:.3em;}
  .sec-line{flex:1; height:1px; background:var(--line);}
  .ep-grid{display:grid; grid-template-columns:repeat(3,1fr); border:1px solid var(--line); border-right:none; border-bottom:none;}
  .ep{
    border-right:1px solid var(--line); border-bottom:1px solid var(--line);
    padding:18px; cursor:pointer; position:relative; min-height:118px;
    display:flex; flex-direction:column; gap:9px;
    transition:background .13s ease, color .13s ease;
  }
  .ep:hover{background:var(--ink); color:var(--bg);}
  .ep:hover .m, .ep:hover .d{color:var(--bg);}
  .ep:hover .m{border-color:var(--bg);}
  .ep-top{display:flex; align-items:center; gap:10px;}
  .m{font-size:9px; font-weight:700; letter-spacing:.14em; border:1px solid var(--line-2); padding:3px 7px; color:var(--dim); transition:color .13s ease, border-color .13s ease;}
  .p{font-size:13px; font-weight:700; letter-spacing:.01em; word-break:break-all;}
  .d{font-size:11px; color:var(--dim); line-height:1.6; transition:color .13s ease; flex:1;}
  .copied{
    position:absolute; top:14px; right:14px; font-size:8.5px; letter-spacing:.2em;
    background:var(--bg); color:var(--ink); border:1px solid var(--bg);
    padding:3px 7px; opacity:0; transition:opacity .15s ease;
  }
  .ep:hover .copied.show{opacity:1; background:var(--bg); color:var(--ink);}
  .pg{border:1px solid var(--line);}
  .pg-head{
    display:flex; align-items:center; justify-content:space-between; gap:12px;
    padding:12px 16px; border-bottom:1px solid var(--line);
    font-size:10px; letter-spacing:.2em; color:var(--faint);
  }
  select{
    background:var(--bg); color:var(--dim); border:1px solid var(--line-2);
    font-family:inherit; font-size:11px; padding:4px 8px; outline:none; cursor:pointer;
  }
  select:hover{color:var(--ink);}
  .pg-log{min-height:220px; max-height:360px; overflow-y:auto; padding:18px;}
  .pg-log::-webkit-scrollbar{width:4px;}
  .pg-log::-webkit-scrollbar-thumb{background:var(--line-2);}
  .row{display:flex; gap:10px; margin-bottom:14px; align-items:baseline;}
  .tag{
    flex-shrink:0; font-size:8.5px; font-weight:700; letter-spacing:.18em;
    border:1px solid var(--line-2); color:var(--dim); padding:3px 7px;
  }
  .row.you .tag{background:var(--ink); color:var(--bg); border-color:var(--ink);}
  .row .txt{font-size:12.5px; line-height:1.75; white-space:pre-wrap; word-break:break-word; color:#cfcfcf;}
  .row.you .txt{color:var(--ink);}
  .row.err .txt{color:var(--dim);}
  .row.err .tag{background:var(--ink); color:var(--bg); border-color:var(--ink);}
  .row.info .txt{color:var(--faint); font-size:10.5px;}
  .row .txt.wait::after{content:""; animation:curs 1s linear infinite;}
  @keyframes curs{0%{content:"_";}49%{content:"_";}50%{content:" ";}100%{content:" ";}}
  .pg-chips{display:flex; flex-wrap:wrap; gap:8px; padding:0 18px 14px;}
  .pg-chips button{
    background:transparent; border:1px solid var(--line); color:var(--dim);
    font-size:10px; letter-spacing:.08em; padding:6px 12px; cursor:pointer;
    transition:all .13s ease;
  }
  .pg-chips button:hover{border-color:var(--ink); color:var(--ink);}
  .pg-in{display:flex; align-items:center; gap:12px; border-top:1px solid var(--line); padding:14px 16px;}
  .pg-in .caret{font-weight:700; font-size:13px;}
  .pg-in input{
    flex:1; background:transparent; border:none; outline:none;
    font-family:inherit; font-size:13px; color:var(--ink);
  }
  .pg-in input::placeholder{color:var(--faint);}
  .send{
    width:32px; height:32px; display:flex; align-items:center; justify-content:center;
    background:transparent; border:1px solid var(--line-2); color:var(--dim);
    cursor:pointer; transition:all .13s ease;
  }
  .send:hover{background:var(--ink); color:var(--bg); border-color:var(--ink);}
  .send svg{width:14px; height:14px;}
  .send:disabled{opacity:.4; cursor:not-allowed;}
  .send.loading svg{display:none;}
  .send.loading::after{
    content:""; width:12px; height:12px; border-radius:50%;
    border:1.5px solid var(--line-2); border-top-color:var(--ink);
    animation:spin .7s linear infinite;
  }
  @keyframes spin{to{transform:rotate(360deg);}}
  .pg-note{padding:0 18px 13px; font-size:9.5px; letter-spacing:.14em; color:var(--faint);}
  .qs-box{border:1px solid var(--line); position:relative;}
  .qs-head{
    display:flex; align-items:center; justify-content:space-between;
    padding:10px 16px; border-bottom:1px solid var(--line);
    font-size:10px; letter-spacing:.2em; color:var(--faint);
  }
  .copy-btn{
    background:transparent; border:1px solid var(--line-2); color:var(--dim);
    font-size:9px; letter-spacing:.2em; padding:5px 11px; cursor:pointer;
    transition:all .13s ease;
  }
  .copy-btn:hover{border-color:var(--ink); color:var(--ink);}
  .copy-btn.done{background:var(--ink); color:var(--bg); border-color:var(--ink);}
  pre.qs{
    padding:20px 22px; font-size:12px; line-height:1.9; overflow-x:auto;
    color:#c9c9c9;
  }
  pre.qs .dollar{color:var(--ink); font-weight:700;}
  pre.qs .flag{color:var(--dim);}
  .footer{margin-top:76px; border-top:1px solid var(--line);}
  .foot-row{
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;
    padding:22px 0; font-size:10.5px; letter-spacing:.16em; color:var(--dim);
  }
  .st{display:inline-flex; align-items:center; gap:9px;}
  .st-dot{width:7px; height:7px; border-radius:50%; background:var(--faint);}
  .st-dot.on{background:var(--ink); animation:pulse 1.9s ease-in-out infinite;}
  .st-dot.off{background:var(--ink);}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.2;}}
  .watermark{
    text-align:center; font-size:clamp(60px,13.5vw,190px); font-weight:800;
    letter-spacing:.02em; line-height:.78; text-transform:uppercase;
    color:transparent; -webkit-text-stroke:1px var(--line-2);
    text-stroke:1px var(--line-2);
    user-select:none; overflow:hidden; white-space:nowrap; padding-bottom:6px;
  }
  a{color:inherit;}
  @media (max-width:860px){
    .ep-grid{grid-template-columns:repeat(2,1fr);}
  }
  @media (max-width:560px){
    .wrap{padding:0 18px;}
    .hero{padding:58px 0 54px;}
    .ep-grid{grid-template-columns:1fr;}
    .sec{padding:50px 0 6px;}
    .foot-row{flex-direction:column; align-items:flex-start;}
  }
  @media (prefers-reduced-motion:reduce){
    *{animation-duration:.01ms !important; transition-duration:.01ms !important;}
  }
</style>
</head>
<body>
<div id="boot">
  <div class="boot-corner">CHATGPT FREE API</div>
  <div class="boot-corner boot-corner-r">V1.0</div>
  <div class="boot-inner">
    <div class="boot-pct"><span id="bootNum">0</span><small>%</small></div>
    <div class="boot-track"><i id="bootBar"></i></div>
    <div class="boot-log" id="bootLog">
      <div>&gt; gateway .............. <b>ok</b></div>
      <div>&gt; models ............... <b>ok</b></div>
      <div>&gt; auth ................. <b>none</b></div>
      <div>&gt; endpoints ............ <b>ready</b></div>
    </div>
  </div>
</div>
<main id="main">
  <div class="wrap">
    <div class="topbar">
      <b>CHATGPT FREE API</b>
      <span>SASA DEV — 2026</span>
    </div>
    <section class="hero">
      <span class="hero-tag">FREE TIER — NO API KEY REQUIRED</span>
      <h1>ChatGPT<span class="ghost">Free API</span></h1>
      <p>A <b>100% free</b>, OpenAI compatible REST gateway. Chat, image generation, translation, summaries and code help in one place. <b>No key</b>, no signup, nothing to install — just call it.</p>
      <div class="stat-strip">
        <div class="stat-cell"><div class="k">PRICE</div><div class="v">$0.00 forever</div></div>
        <div class="stat-cell"><div class="k">API KEY</div><div class="v">not required</div></div>
        <div class="stat-cell"><div class="k">ENDPOINTS</div><div class="v">9 routes</div></div>
        <div class="stat-cell"><div class="k">COMPAT</div><div class="v">openai sdk</div></div>
      </div>
    </section>
    <section class="sec" id="endpoints">
      <div class="sec-head">
        <span class="sec-num">01</span>
        <span class="sec-title">ENDPOINTS</span>
        <span class="sec-line"></span>
      </div>
      <div class="ep-grid">
        <div class="ep" data-path="/v1/chat"><span class="copied">COPIED</span><div class="ep-top"><span class="m">POST</span><span class="p">/v1/chat</span></div><span class="d">chat completions, openai compatible shape with conversation memory</span></div>
        <div class="ep" data-path="/chat?q=hello"><span class="copied">COPIED</span><div class="ep-top"><span class="m">GET</span><span class="p">/chat?q=hello</span></div><span class="d">quick one shot chat, type the question right in the url</span></div>
        <div class="ep" data-path="/v1/models"><span class="copied">COPIED</span><div class="ep-top"><span class="m">GET</span><span class="p">/v1/models</span></div><span class="d">live list of every model the gateway serves right now</span></div>
        <div class="ep" data-path="/v1/image?prompt=a+red+fox"><span class="copied">COPIED</span><div class="ep-top"><span class="m">GET</span><span class="p">/v1/image?prompt=...</span></div><span class="d">text to image generation, returns a ready jpeg</span></div>
        <div class="ep" data-path="/v1/summarize"><span class="copied">COPIED</span><div class="ep-top"><span class="m">POST</span><span class="p">/v1/summarize</span></div><span class="d">compress long text into short, medium or long summaries</span></div>
        <div class="ep" data-path="/v1/translate"><span class="copied">COPIED</span><div class="ep-top"><span class="m">POST</span><span class="p">/v1/translate</span></div><span class="d">translate between any languages, auto detects the source</span></div>
        <div class="ep" data-path="/v1/code"><span class="copied">COPIED</span><div class="ep-top"><span class="m">POST</span><span class="p">/v1/code</span></div><span class="d">coding assistant for generation, debugging and refactoring</span></div>
        <div class="ep" data-path="/status"><span class="copied">COPIED</span><div class="ep-top"><span class="m">GET</span><span class="p">/status</span></div><span class="d">full service status, uptime and endpoint catalogue</span></div>
        <div class="ep" data-path="/health"><span class="copied">COPIED</span><div class="ep-top"><span class="m">GET</span><span class="p">/health</span></div><span class="d">lightweight liveness probe for uptime monitors</span></div>
      </div>
    </section>
    <section class="sec" id="playground">
      <div class="sec-head">
        <span class="sec-num">02</span>
        <span class="sec-title">PLAYGROUND</span>
        <span class="sec-line"></span>
      </div>
      <div class="pg">
        <div class="pg-head">
          <span>SESSION / LIVE</span>
          <select id="pgModel"><option value="openai">openai</option><option value="openai-fast">openai-fast</option></select>
        </div>
        <div class="pg-log" id="pgLog"></div>
        <div class="pg-chips">
          <button type="button" data-fill="Explain quantum computing in simple words">quantum</button>
          <button type="button" data-fill="Write a haiku about the ocean">haiku</button>
          <button type="button" data-fill="ආයුබෝවන්! ඔබ කවුද?">sinhala</button>
        </div>
        <form class="pg-in" id="pgForm">
          <span class="caret">&gt;</span>
          <input id="pgText" type="text" autocomplete="off" placeholder="message the api...">
          <button class="send" id="pgSend" type="submit" aria-label="send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
        <div class="pg-note">FREE TIER RESPONSES MAY TAKE UP TO 30 SECONDS</div>
      </div>
    </section>
    <section class="sec" id="quickstart">
      <div class="sec-head">
        <span class="sec-num">03</span>
        <span class="sec-title">QUICKSTART</span>
        <span class="sec-line"></span>
      </div>
      <div class="qs-box">
        <div class="qs-head">
          <span>POST /V1/CHAT</span>
          <button type="button" class="copy-btn" id="qsCopy">COPY</button>
        </div>
        <pre class="qs" id="qsCode"><span class="dollar">$</span> curl -s -X POST <span id="qsUrl">https://free-chatgpt-api-sasa-dev.vercel.app</span>/v1/chat \\
    -H <span class="flag">"Content-Type: application/json"</span> \\
    -d <span class="flag">'{"messages":[{"role":"user","content":"Hello!"}]}'</span></pre>
      </div>
    </section>
    <footer class="footer">
      <div class="foot-row">
        <span class="st">API STATUS / <span class="st-dot" id="stDot"></span><span id="stText">CHECKING</span></span>
        <span>© 2026 SASA DEV</span>
      </div>
      <div class="watermark">SASA DEV</div>
    </footer>
  </div>
</main>
<script>
(function(){
  var bootNum = document.getElementById("bootNum");
  var bootBar = document.getElementById("bootBar");
  var bootLines = document.getElementById("bootLog").getElementsByTagName("div");
  var thresholds = [18, 42, 68, 90];
  var DURATION = 1500;
  var start = performance.now();
  function step(now){
    var t = Math.min((now - start) / DURATION, 1);
    var pct = Math.floor(t * 100);
    bootNum.textContent = String(pct);
    bootBar.style.width = pct + "%";
    for (var i = 0; i < thresholds.length; i++){
      if (pct >= thresholds[i] && bootLines[i]) bootLines[i].classList.add("on");
    }
    if (t < 1){
      requestAnimationFrame(step);
    } else {
      setTimeout(finish, 260);
    }
  }
  requestAnimationFrame(step);
  function finish(){
    var boot = document.getElementById("boot");
    boot.classList.add("hide");
    document.getElementById("main").classList.add("show");
    setTimeout(function(){
      if (boot && boot.parentNode) boot.parentNode.removeChild(boot);
    }, 800);
    checkStatus();
    loadModels();
  }

  var logEl = document.getElementById("pgLog");
  var formEl = document.getElementById("pgForm");
  var inputEl = document.getElementById("pgText");
  var sendEl = document.getElementById("pgSend");
  var modelEl = document.getElementById("pgModel");
  var history = [];
  var busy = false;

  function addRow(cls, tag, text){
    var row = document.createElement("div");
    row.className = "row " + cls;
    var t = document.createElement("span");
    t.className = "tag";
    t.textContent = tag;
    var body = document.createElement("span");
    body.className = "txt";
    body.textContent = text;
    row.appendChild(t);
    row.appendChild(body);
    logEl.appendChild(row);
    logEl.scrollTop = logEl.scrollHeight;
    return row;
  }
  addRow("info", "SYS", "session ready. every message below hits the live /v1/chat endpoint.");

  formEl.addEventListener("submit", function(e){
    e.preventDefault();
    if (busy) return;
    var value = inputEl.value.trim();
    if (!value) return;
    busy = true;
    sendEl.disabled = true;
    sendEl.classList.add("loading");
    inputEl.value = "";
    addRow("you", "YOU", value);
    history.push({ role: "user", content: value });
    var waitRow = addRow("bot", "GPT", "");
    var txt = waitRow.querySelector(".txt");
    txt.classList.add("wait");
    var t0 = performance.now();
    fetch("/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: modelEl.value || "openai", messages: history.slice(-12) })
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
        txt.classList.remove("wait");
        txt.textContent = answer;
        addRow("info", "SYS", (out.data.model || "openai") + "  ·  " + Math.round(performance.now() - t0) + " ms");
      })
      .catch(function(err){
        txt.classList.remove("wait");
        waitRow.className = "row err";
        waitRow.querySelector(".tag").textContent = "ERR";
        txt.textContent = err && err.message ? err.message : "something went wrong";
      })
      .then(function(){
        busy = false;
        sendEl.disabled = false;
        sendEl.classList.remove("loading");
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
        modelEl.innerHTML = "";
        for (var i = 0; i < ids.length; i++){
          var opt = document.createElement("option");
          opt.value = ids[i];
          opt.textContent = ids[i];
          modelEl.appendChild(opt);
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

  var base = location && location.origin && location.origin.indexOf("http") === 0 ? location.origin : "https://free-chatgpt-api-sasa-dev.vercel.app";
  document.getElementById("qsUrl").textContent = base;

  var cells = document.querySelectorAll(".ep");
  for (var e = 0; e < cells.length; e++){
    cells[e].addEventListener("click", function(){
      var cell = this;
      copyText(base + cell.getAttribute("data-path"), function(){
        var flag = cell.querySelector(".copied");
        flag.classList.add("show");
        setTimeout(function(){ flag.classList.remove("show"); }, 1200);
      });
    });
  }

  var qsCopy = document.getElementById("qsCopy");
  var qsCode = document.getElementById("qsCode");
  qsCopy.addEventListener("click", function(){
    var text = qsCode.textContent.replace(/^\$\s*/, "");
    copyText(text, function(){
      qsCopy.classList.add("done");
      qsCopy.textContent = "COPIED";
      setTimeout(function(){
        qsCopy.classList.remove("done");
        qsCopy.textContent = "COPY";
      }, 1400);
    });
  });
})();
</script>
</body>
</html>`;

export function renderPage() {
  return html;
}
