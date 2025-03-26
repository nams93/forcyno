import type { Response } from "@/types/dashboard"

// Clé de stockage localStorage
const STORAGE_KEY = "satisfaction-responses"
const ACTIVE_USERS_KEY = "active-users"

// Fonction pour sauvegarder les réponses de manière persistante
export function saveResponses(responses: Response[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(responses))

      // Envoyer à l'API (simulation)
      console.log("Données sauvegardées dans le stockage persistant", responses.length)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données:", error)
    }
  }
}

// Fonction pour récupérer les réponses sauvegardées
export function loadResponses(): Response[] {
  if (typeof window !== "undefined") {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    }
  }
  return []
}

// Fonctions pour gérer les utilisateurs actifs
export function trackActiveUser(id: string): void {
  if (typeof window !== "undefined") {
    try {
      const activeUsers = getActiveUsers()
      if (!activeUsers.includes(id)) {
        activeUsers.push(id)
        localStorage.setItem(ACTIVE_USERS_KEY, JSON.stringify(activeUsers))
      }
    } catch (error) {
      console.error("Erreur lors du suivi de l'utilisateur actif:", error)
    }
  }
}

export function removeActiveUser(id: string): void {
  if (typeof window !== "undefined") {
    try {
      let activeUsers = getActiveUsers()
      activeUsers = activeUsers.filter((userId) => userId !== id)
      localStorage.setItem(ACTIVE_USERS_KEY, JSON.stringify(activeUsers))
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur actif:", error)
    }
  }
}

export function getActiveUsers(): string[] {
  if (typeof window !== "undefined") {
    try {
      const data = localStorage.getItem(ACTIVE_USERS_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs actifs:", error)
    }
  }
  return []
}

