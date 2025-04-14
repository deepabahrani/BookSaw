const CACHE_NAME = 'booksaw-v1';
const OFFLINE_URL = 'offline.html';

const FILES_TO_CACHE = [
  '/',
  'index.html',
  'offline.html',
  'style.css',
  'js/jquery-1.11.0.min.js',
  'js/modernizr.js',
  'js/plugins.js',
  'js/script.js',
  'js/sideNav.min.js',
  'images/logo.png', // change if you have a real logo
  // add more files as needed (fonts, icons, etc.)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
