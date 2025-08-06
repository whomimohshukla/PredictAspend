// FocusZen Background Service Worker
let sessionActive = false;

// Listen for start/stop messages from the popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'START_SESSION') {
    sessionActive = true;
  } else if (message.type === 'STOP_SESSION') {
    sessionActive = false;
  }
});

// When any tab updates, check if we should block it
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!sessionActive || !tab.url) return;

  const blocked = ['facebook.com', 'youtube.com', 'instagram.com'];

  if (blocked.some(domain => tab.url.includes(domain))) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        document.body.innerHTML = '<h1 style="font-family:sans-serif;text-align:center;margin-top:20vh;">Stay Focused with FocusZen 🚫</h1>';
      }
    });
  }
});
