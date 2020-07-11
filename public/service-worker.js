const FILES_TO_CACHE = [
  '/',
  '/index.js',
  '/index.html',
  '/styles.css',
  '/manifest.json'
  // "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  // "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
];

const cacheName = "budget-v2";
const Data = "budget_data";

self.addEventListener("install", (evt)=> {
  console.log('install');
  evt.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
);})
  



  // Call Activate Event
self.addEventListener('activate', e => {
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener('fetch', e => {

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Make copy/clone of response
        const resClone = res.clone();
        // Open cahce
        caches.open(cacheName).then(cache => {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});
// Call Fetch Event
self.addEventListener('fetch', e => {
  
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
