const CACHE = 'kana-v9';
const ASSETS = ['./index.html', './style.css', './game.js', './manifest.json', './icon-192.png', './icon-512.png', './gear.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    // Navigation requests arrive with redirect:'manual', so fetch(e.request)
    // returns an opaque redirect response that iOS WPA rejects. Serve
    // index.html from cache, or fetch with redirect:'follow' if cache is cold.
    e.respondWith(
      caches.match('./index.html')
        .then(r => r || fetch(new Request(e.request, {redirect: 'follow'})))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
