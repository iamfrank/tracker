// Load and register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./serviceworker.js')
}