const CACHE = ‘jameya-v5’;
const BYPASS = [‘firebase’, ‘firebaseio’, ‘googleapis’, ‘gstatic’, ‘firestore’];

self.addEventListener(‘install’, e => {
e.waitUntil(
caches.open(CACHE)
.then(c => c.addAll([’./’, ‘./index.html’, ‘./manifest.json’]))
.then(() => self.skipWaiting())
);
});

self.addEventListener(‘activate’, e => {
e.waitUntil(
caches.keys()
.then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
.then(() => self.clients.claim())
);
});

self.addEventListener(‘fetch’, e => {
const url = e.request.url;
if (BYPASS.some(b => url.includes(b))) {
e.respondWith(fetch(e.request));
return;
}
// Network first for HTML, cache first for assets
if (url.includes(’.html’) || url.endsWith(’/’)) {
e.respondWith(
fetch(e.request)
.then(resp => {
const clone = resp.clone();
caches.open(CACHE).then(c => c.put(e.request, clone));
return resp;
})
.catch(() => caches.match(e.request))
);
} else {
e.respondWith(
caches.match(e.request).then(cached => cached || fetch(e.request))
);
}
});
