const APP_PREFIX = 'BudgetTracker';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    "/",
    "index.html",
    "css/styles.css",
    "js/index.js",
    "js/idb.js",
  ];

  // used to register the service worker
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            //console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
        .then(self.skipWaiting())
    )
});
  // used to intercept requests so we can check for the file or data in the cache
self.addEventListener('fetch', function(event) {
    
})
  // this event triggers when the service worker acitvates
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
              if (key !== CACHE_NAME) {
                  console.log('[ServiceWorker] Removing old cache', key)
                  return caches.delete(key)
              }
          }))  
        })
        .then(() => self.clients.claim())
    )
})