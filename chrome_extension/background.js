const API = "http://127.0.0.1:8000/predict";

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url || !tab.url.startsWith("http")) return;

  try {
    const res  = await fetch(API, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ url: tab.url })
    });
    const data = await res.json();

    // Store result so popup can read it
    await chrome.storage.local.set({ [String(tabId)]: data });

    if (data.label === "phishing" && data.confidence > 0.85) {
      // Red badge warning
      chrome.action.setBadgeText({ text: "⚠", tabId });
      chrome.action.setBadgeBackgroundColor({ color: "#FF0000", tabId });
    } else {
      // Clear badge for safe sites
      chrome.action.setBadgeText({ text: "", tabId });
    }
  } catch (err) {
    console.error("PhishGuard error:", err);
  }
});

// Clean up storage when tab closes
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(String(tabId));
});