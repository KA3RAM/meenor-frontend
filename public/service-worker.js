// service-worker.js
// این فایل را داخل پوشه public/ قرار دهید (کنار index.html و manifest.json).
// یک service worker ساده و سبک، بدون نیاز به eject کردن CRA یا craco.

const CACHE_NAME = "meenor-cache-v1";

// فایل‌های اصلی که همیشه باید کش بشن (App Shell)
const CORE_ASSETS = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // فقط درخواست‌های GET رو مدیریت کن
  if (request.method !== "GET") return;

  // برای فایل‌های navigasion (صفحات) => network first, بعد fallback به کش
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // برای بقیه (js, css, عکس‌ها, فونت‌ها) => cache first, بعد شبکه
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then((networkResponse) => {
          // فقط پاسخ‌های معتبر رو کش کن
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // اگه هم شبکه بود هم کش نبود (مثلاً عکس جدید آفلاین) هیچی برنگردون
        });
    })
  );
});
