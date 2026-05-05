// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkxDW9W9Sx718IN0BV1My4P-B5PG6-xpE",
  authDomain: "jameya-app-9a672.firebaseapp.com",
  projectId: "jameya-app-9a672",
  storageBucket: "jameya-app-9a672.firebasestorage.app",
  messagingSenderId: "155607019453",
  appId: "1:155607019453:web:e9757b3e56439e67082cd4",
  measurementId: "G-W6WR0CNTS3"
};
const CACHE = ‘jameya-v3’;
const OFFLINE_ASSETS = [’./’, ‘./index.html’, ‘./manifest.json’];
// Never cache Firebase or any external API
const BYPASS = [‘firebase’, ‘firebaseio’, ‘googleapis’, ‘gstatic’, ‘firestore’];

self.addEventListener(‘install’, e => {
e.waitUntil(
caches.open(CACHE)
.then(c => c.addAll(OFFLINE_ASSETS))
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
// Bypass cache for Firebase and external services — always fetch live
if (BYPASS.some(b => url.includes(b))) {
e.respondWith(fetch(e.request));
return;
}
e.respondWith(
caches.match(e.request).then(cached => {
if (cached) return cached;
return fetch(e.request).then(resp => {
if (!resp || resp.status !== 200 || resp.type === ‘opaque’) return resp;
const clone = resp.clone();
caches.open(CACHE).then(c => c.put(e.request, clone));
return resp;
}).catch(() => caches.match(’./index.html’));
})
);
});