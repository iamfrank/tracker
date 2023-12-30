const cacheName = 'tracker-v1.6'
const contentToCache = [
  '/tracker/index.html',
  '/tracker/js/main.js',
  '/tracker/js/db.js',
  '/tracker/js/tracker.js',
  '/tracker/js/util.js',
  '/tracker/js/calendar.js',
  '/tracker/css/main.css',
  '/tracker/img/favicon.svg',
  '/tracker/img/mask-icon.svg',
  '/tracker/img/apple-touch-icon.png',
  '/tracker/img/google-touch-icon.png'
]

// Install serviceworker
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName)
    await cache.addAll(contentToCache)
  })())
})

// Cleans old cache files
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return }
      return caches.delete(key)
    }))
  }))
})

// Fetch content
self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    const r = await caches.match(event.request)
    if (r) { return r }
    const response = await fetch(event.request)
    const cache = await caches.open(cacheName)
    cache.put(event.request, response.clone())
    return response
  })())
})
