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

export function renderPage() {
  return html;
}
