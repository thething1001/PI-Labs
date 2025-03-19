const CACHE_NAME = "pwa-cms-cache";
const ASSETS = [
  "/",
  "/students",
  "/students/students.html",
  "/students/students.css",
  "/students/students.js",

  "/dashboard",
  "/dashboard/dashboard.html",
  "/dashboard/dashboard.css",
  "/dashboard/dashboard.js",

  "/tasks",
  "/tasks/tasks.html",
  "/tasks/tasks.css",
  "/tasks/tasks.js",

  "/messages",
  "/messages/messages.html",
  "/messages/messages.css",
  "/messages/messages.js",

  "/global.css",
  "/navbar.css",
  "/header.css",
  "/header.js",
  "/offline.html",
  "/sw.js",

  "/pwa",
  "/pwa/init_sw.js",
  "/pwa/manifest.json",

  "/assets",
  "/assets/logo.svg",
  "/assets/add.svg",
  "/assets/avatar_placeholder.svg",
  "/assets/bell.svg",
  "/assets/close.svg",
  "/assets/dashboard.svg",
  "/assets/edit.svg",
  "/assets/hamburger.svg",
  "/assets/notification.svg",
  "/assets/offline.svg",
  "/assets/online.svg",
  "/assets/profile.svg",
  "/assets/students.svg",
  "/assets/tasks.svg",
  "/assets/trash.svg",
  "/assets/logo-128.png",
  "/assets/logo-192.png",
  "/assets/logo-256.png",
  "/assets/logo-512.png",
  "/assets/screenshot-wide.png",
  "/assets/screenshot-narrow.png"
];

// Встановлення Service Worker та кешування файлів
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching files');
      return cache.addAll(ASSETS);
    })
  );
});

// Перехоплення запитів і завантаження з кешу
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});

// Оновлення Service Worker і видалення старого кешу
self.addEventListener("activate", (event) => {
  console.log('Updating cache');
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