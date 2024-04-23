const cacheName = 'mood-tracker-v2.13'
const contentToCache = [
  '/tracker/index.html',
  '/tracker/js/modules/db.js',
  '/tracker/js/modules/util.js',
  '/tracker/js/components/tracker.js',
  '/tracker/js/components/calendar.js',
  '/tracker/js/components/footer.js',
  '/tracker/js/components/header.js',
  '/tracker/js/components/list.js',
  '/tracker/js/views/kpis.js',
  '/tracker/js/views/observationcalendar.js',
  '/tracker/js/views/observations.js',
  '/tracker/css/calendar.css',
  '/tracker/css/dialog.css',
  '/tracker/css/footer.css',
  '/tracker/css/header.css',
  '/tracker/css/list.css',
  '/tracker/css/main.css',
  '/tracker/img/favicon.svg',
  '/tracker/img/mask-icon.svg',
  '/tracker/img/apple-touch-icon.png',
  '/tracker/img/google-touch-icon.png',
  '/tracker/html/info.html',
  '/tracker/html/kpiadd.html',
  '/tracker/html/kpis.html',
  '/tracker/html/observationadd.html',
  '/tracker/html/observationcalendar.html',
  '/tracker/html/observationchart.html',
  '/tracker/html/observations.html',
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