console.log("Hi from your service worker")

const APP_PREFIX = 'BudgetTracker';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    "/",
    "index.html",
    "css/styles.css",
    "js/index.js",
    "js/idb.js",
    "manifest.webmanifest",
    "icons/icon-72x72.png",
    "icons/icon-96x96.png",
    "icons/icon-128x128.png",
    "icons/icon-144x144.png",
    "icons/icon-152x152.png",
    "icons/icon-192x192.png",
    "icons/icon-384x384.png",
    "icons/icon-512x512.png",

  ];

  // used to register the service worker
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            //console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
        .then(self.skipWaiting())
        .catch(function(err) {
            console.log('err', err);
        })
    )
});
  // this event triggers when the service worker acitvates
  self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
              if (key !== CACHE_NAME) {
                  console.log('activated!');
                  return caches.delete(key)
              }
          }))  
        })
        .then(() => self.clients.claim())
    )
});

  // used to intercept requests so we can check for the file or data in the cache
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request)
        .catch(() => {
            return caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.match(event.request)
            })
        })
    )
})
