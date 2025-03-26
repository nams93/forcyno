// Stockage en mémoire pour simuler localStorage côté serveur
let memoryStorage: Record<string, any> = {}

// Fonction pour récupérer une valeur du stockage
export function getLocalStorage(key: string): any {
  try {
    // Si nous sommes côté client, utiliser localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }

    // Sinon, utiliser le stockage en mémoire
    return memoryStorage[key] || null
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${key}:`, error)
    return null
  }
}

// Fonction pour définir une valeur dans le stockage
export function setLocalStorage(key: string, value: any): void {
  try {
    // Si nous sommes côté client, utiliser localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value))
    }

    // Toujours mettre à jour le stockage en mémoire
    memoryStorage[key] = value
  } catch (error) {
    console.error(`Erreur lors de la définition de ${key}:`, error)
  }
}

// Fonction pour supprimer une valeur du stockage
export function removeLocalStorage(key: string): void {
  try {
    // Si nous sommes côté client, utiliser localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key)
    }

    // Toujours supprimer du stockage en mémoire
    delete memoryStorage[key]
  } catch (error) {
    console.error(`Erreur lors de la suppression de ${key}:`, error)
  }
}

// Fonction pour vider tout le stockage
export function clearLocalStorage(): void {
  try {
    // Si nous sommes côté client, utiliser localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.clear()
    }

    // Toujours vider le stockage en mémoire
    memoryStorage = {}
  } catch (error) {
    console.error("Erreur lors du vidage du stockage:", error)
  }
}

