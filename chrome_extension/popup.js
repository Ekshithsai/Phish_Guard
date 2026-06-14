const API = "http://127.0.0.1:8000";

function showQuickResult(data) {
  const isPhishing = data.label === "phishing";
  document.getElementById("verdict-box").className   = "verdict " + (isPhishing ? "phishing" : "safe");
  document.getElementById("verdict-label").textContent = isPhishing ? "⚠ Phishing" : "✓ Safe";
  document.getElementById("verdict-sub").textContent   = `ML confidence: ${(data.confidence * 100).toFixed(1)}%`;

  const pct = Math.round(data.confidence * 100);
  document.getElementById("risk-pct").textContent   = pct + "%";
  document.getElementById("risk-fill").style.width  = pct + "%";
  document.getElementById("risk-fill").style.background =
    pct > 70 ? "#ef4444" : pct > 40 ? "#f59e0b" : "#22c55e";
}

async function runFullScan() {
  const btn = document.getElementById("scan-btn");
  btn.disabled    = true;
  btn.textContent = "Scanning...";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    const res  = await fetch(`${API}/scan`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ url: tab.url })
    });
    const data = await res.json();

    const isPhishing = data.verdict === "phishing";
    document.getElementById("verdict-box").className    = "verdict " + (isPhishing ? "phishing" : "safe");
    document.getElementById("verdict-label").textContent = isPhishing ? "⚠ Phishing" : "✓ Safe";
    document.getElementById("verdict-sub").textContent   = `Risk score: ${(data.risk_score * 100).toFixed(1)}%`;

    const pct = Math.round(data.risk_score * 100);
    document.getElementById("risk-pct").textContent   = pct + "%";
    document.getElementById("risk-fill").style.width  = pct + "%";
    document.getElementById("risk-fill").style.background =
      pct > 70 ? "#ef4444" : pct > 40 ? "#f59e0b" : "#22c55e";

    const vtMal = data.virustotal?.malicious ?? 0;
    const vtEl  = document.getElementById("vt-val");
    vtEl.textContent = vtMal + " flags";
    vtEl.className   = "card-value " + (vtMal > 0 ? "danger" : "safe");

    const uhEl = document.getElementById("uh-val");
    uhEl.textContent = data.urlhaus?.is_malicious ? "Listed ⚠" : "Clean ✓";
    uhEl.className   = "card-value " + (data.urlhaus?.is_malicious ? "danger" : "safe");

    const ageEl = document.getElementById("age-val");
    ageEl.textContent = data.new_domain ? "New (<90d) ⚠" : "Established";
    ageEl.className   = "card-value " + (data.new_domain ? "warn" : "safe");

    const regEl = document.getElementById("reg-val");
    regEl.textContent = data.whois?.registrar
      ? data.whois.registrar.split(",")[0].trim()
      : "Unknown";

  } catch (err) {
    document.getElementById("verdict-label").textContent = "API offline";
    document.getElementById("verdict-sub").textContent   = "Start your FastAPI server";
  }

  btn.disabled    = false;
  btn.textContent = "Run full scan";
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  document.getElementById("url-display").textContent = tab.url;

  const cache = await chrome.storage.local.get(String(tab.id));
  const quick = cache[String(tab.id)];

  if (quick) {
    showQuickResult(quick);
  } else {
    try {
      const res  = await fetch(`${API}/predict`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url: tab.url })
      });
      const data = await res.json();
      showQuickResult(data);
    } catch (err) {
      document.getElementById("verdict-label").textContent = "API offline";
      document.getElementById("verdict-sub").textContent   = "Start your FastAPI server";
    }
  }

  document.getElementById("scan-btn").addEventListener("click", runFullScan);
}

init();