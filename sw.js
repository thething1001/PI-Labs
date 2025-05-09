const CACHE_NAME = "pwa-cms-cache-v3";
const ASSETS = [
  "/PI-Labs/students/students.html",
  "/PI-Labs/students/students.css",
  "/PI-Labs/students/students.js",
  "/PI-Labs/dashboard/dashboard.html",
  "/PI-Labs/dashboard/dashboard.css",
  "/PI-Labs/dashboard/dashboard.js",
  "/PI-Labs/tasks/tasks.html",
  "/PI-Labs/tasks/tasks.css",
  "/PI-Labs/tasks/tasks.js",
  "/PI-Labs/messages/messages.html",
  "/PI-Labs/messages/messages.css",
  "/PI-Labs/messages/messages.js",
  "/PI-Labs/global.css",
  "/PI-Labs/navbar.css",
  "/PI-Labs/header.css",
  "/PI-Labs/header.js",
  "/PI-Labs/index.js",
  "/PI-Labs/index.html",
  "/PI-Labs/sw.js",
  "/PI-Labs/pwa/init_sw.js",
  "/PI-Labs/pwa/manifest.json",
  "/PI-Labs/assets/logo.svg",
  "/PI-Labs/assets/add.svg",
  "/PI-Labs/assets/avatar_placeholder.svg",
  "/PI-Labs/assets/bell.svg",
  "/PI-Labs/assets/close.svg",
  "/PI-Labs/assets/dashboard.svg",
  "/PI-Labs/assets/edit.svg",
  "/PI-Labs/assets/hamburger.svg",
  "/PI-Labs/assets/notification.svg",
  "/PI-Labs/assets/offline.svg",
  "/PI-Labs/assets/online.svg",
  "/PI-Labs/assets/profile.svg",
  "/PI-Labs/assets/students.svg",
  "/PI-Labs/assets/tasks.svg",
  "/PI-Labs/assets/trash.svg",
  "/PI-Labs/assets/logo-128.png",
  "/PI-Labs/assets/logo-192.png",
  "/PI-Labs/assets/logo-256.png",
  "/PI-Labs/assets/logo-512.png",
  "/PI-Labs/assets/screenshot-wide.png",
  "/PI-Labs/assets/screenshot-narrow.png",
];

// Встановлення Service Worker та кешування файлів
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching files");
        return Promise.all(
          ASSETS.map((asset) => {
            return fetch(asset)
              .then((response) => {
                if (!response.ok) {
                  console.warn(`Failed to fetch ${asset}: ${response.status}`);
                  return; // Skip caching this asset
                }
                return cache.put(asset, response);
              })
              .catch((err) => {
                console.error(`Error caching ${asset}: ${err}`);
              });
          })
        ).then(() => console.log("Caching complete"));
      })
      .catch((err) => console.error("Install failed:", err))
  );
});

// Перехоплення запитів і завантаження з кешу
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Оновлення Service Worker і видалення старого кешу
self.addEventListener("activate", (event) => {
  console.log("Updating cache");
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        );
      })
      .then(() => {
        return self.clients.claim(); // Підключаємо новий SW до всіх вкладок
      })
  );
});
