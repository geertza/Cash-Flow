const FILES_TO_CACHE = [
  '/',
  '/index.js',
  '/index.html',
  '/styles.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
 ];

const cacheName = "budget";
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

self.addEventListener("fetch", e => {
  if(e.request.url.includes('/api/')) {
      console.log('[Service Worker] Fetch(data)', e.request.url);
  
e.respondWith(
              caches.open(cacheName).then(cache => {
              return fetch(e.request)
              .then(response => {
                  if (response.status === 200){
                      cache.put(e.request.url, response.clone());
                  }
                  return response;
              })
              .catch(err => {
                  return cache.match(e.request);
              });
          })
          );
          return;
      }
      e.respondWith(
        caches.open(cacheName).then( cache => {
          return cache.match(e.request).then(response => {
            return response || fetch(e.request);
          });
        })
      );
    });
// // Call Fetch Event
// self.addEventListener('fetch', e => {
  
//   e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
// });
