const CACHE_NAME = "satisfaction-form-cache-v1"
const urlsToCache = [
  "/",
  "/form",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/offline.html",
]

// Installation du service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache ouvert")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Récupération des ressources
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - retourner la réponse
      if (response) {
        return response
      }

      // Cloner la requête
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest)
        .then((response) => {
          // Vérifier si la réponse est valide
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Cloner la réponse
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Fallback pour les requêtes qui échouent
          if (event.request.url.indexOf("/api/") !== -1) {
            return new Response(
              JSON.stringify({
                error: "Vous êtes hors ligne",
              }),
              {
                headers: { "Content-Type": "application/json" },
              },
            )
          }

          // Pour les pages HTML, retourner la page offline.html
          if (event.request.headers.get("Accept").includes("text/html")) {
            return caches.match("/offline.html")
          }
        })
    }),
  )
})

// Activation et nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      ),
    ),
  )
})

