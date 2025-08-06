// FocusZen Popup Script

document.getElementById('startBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'START_SESSION' });
  window.close();
});

document.getElementById('stopBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'STOP_SESSION' });
  window.close();
});
