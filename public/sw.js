importScripts("https://unpkg.com/localforage@1.10.0/dist/localforage.min.js")

const CACHE_NAME = "satisfaction-form-cache-v2"
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
  // Force le nouveau service worker à prendre le contrôle immédiatement
  self.skipWaiting()
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
  // Permet au service worker de contrôler toutes les pages immédiatement
  event.waitUntil(self.clients.claim())
})

// Récupération des ressources avec stratégie "network first, fallback to cache"
self.addEventListener("fetch", (event) => {
  // Ne pas intercepter les requêtes API
  if (event.request.url.includes("/api/")) {
    return
  }

  event.respondWith(
    fetch(event.request)
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
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }

          // Pour les pages HTML, retourner la page offline.html
          if (event.request.headers.get("Accept").includes("text/html")) {
            return caches.match("/offline.html")
          }
        })
      }),
  )
})

// Intercepter les requêtes API en mode hors ligne et les stocker
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/") && event.request.method === "POST") {
    event.respondWith(
      fetch(event.request.clone())
        .then((response) => response)
        .catch(async () => {
          // Stocker la requête pour la synchroniser plus tard
          const requestData = await event.request.clone().json()

          // Récupérer les requêtes en attente
          let pendingRequests = []
          try {
            const storedData = await localforage.getItem("pendingRequests")
            if (storedData) {
              pendingRequests = JSON.parse(storedData)
            }
          } catch (e) {
            console.error("Erreur lors de la récupération des requêtes en attente", e)
          }

          // Ajouter la nouvelle requête
          pendingRequests.push({
            url: event.request.url,
            method: event.request.method,
            data: requestData,
            timestamp: Date.now(),
          })

          // Sauvegarder les requêtes en attente
          try {
            await localforage.setItem("pendingRequests", JSON.stringify(pendingRequests))
          } catch (e) {
            console.error("Erreur lors de la sauvegarde des requêtes en attente", e)
          }

          // Retourner une réponse simulée
          return new Response(
            JSON.stringify({
              success: true,
              offline: true,
              message: "Données enregistrées localement et seront synchronisées lorsque vous serez en ligne.",
            }),
            {
              headers: { "Content-Type": "application/json" },
            },
          )
        }),
    )
  }
})

// Synchroniser les données lorsque la connexion est rétablie
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-responses") {
    event.waitUntil(syncPendingRequests())
  }
})

async function syncPendingRequests() {
  try {
    // Récupérer les requêtes en attente
    const storedData = await localforage.getItem("pendingRequests")
    if (!storedData) return

    const pendingRequests = JSON.parse(storedData)
    if (!pendingRequests.length) return

    // Traiter chaque requête
    const successfulRequests = []

    for (let i = 0; i < pendingRequests.length; i++) {
      const request = pendingRequests[i]
      try {
        await fetch(request.url, {
          method: request.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request.data),
        })
        successfulRequests.push(i)
      } catch (error) {
        console.error("Échec de synchronisation pour la requête", request, error)
      }
    }

    // Supprimer les requêtes réussies
    const remainingRequests = pendingRequests.filter((_, index) => !successfulRequests.includes(index))

    // Mettre à jour le stockage
    try {
      await localforage.setItem("pendingRequests", JSON.stringify(remainingRequests))
    } catch (e) {
      console.error("Erreur lors de la sauvegarde des requêtes restantes", e)
    }

    // Notifier l'utilisateur
    if (successfulRequests.length > 0) {
      self.registration.showNotification("Synchronisation terminée", {
        body: `${successfulRequests.length} réponse(s) synchronisée(s) avec succès.`,
        icon: "/icons/icon-192x192.png",
      })
    }
  } catch (error) {
    console.error("Erreur lors de la synchronisation des requêtes", error)
  }
}

