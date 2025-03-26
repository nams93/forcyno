import type { Response } from "@/types/dashboard"

// Clés de stockage localStorage
const STORAGE_KEY = "satisfaction-responses"
const STORAGE_VERSION = "1.0"
const STORAGE_META_KEY = "satisfaction-responses-meta"

// Interface pour les métadonnées
interface StorageMeta {
  version: string
  lastUpdated: string
  totalResponses: number
}

// Fonction pour sauvegarder les réponses de manière persistante
export function saveResponses(responses: Response[]): void {
  if (typeof window !== "undefined") {
    try {
      // Sauvegarder les données
      localStorage.setItem(STORAGE_KEY, JSON.stringify(responses))

      // Mettre à jour les métadonnées
      const meta: StorageMeta = {
        version: STORAGE_VERSION,
        lastUpdated: new Date().toISOString(),
        totalResponses: responses.length,
      }
      localStorage.setItem(STORAGE_META_KEY, JSON.stringify(meta))

      console.log(`Données sauvegardées: ${responses.length} réponses`)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données:", error)

      // En cas d'erreur de quota, essayer de sauvegarder par lots
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        try {
          // Diviser en lots de 50 réponses
          const batchSize = 50
          for (let i = 0; i < responses.length; i += batchSize) {
            const batch = responses.slice(i, i + batchSize)
            localStorage.setItem(`${STORAGE_KEY}_batch_${i / batchSize}`, JSON.stringify(batch))
          }

          // Sauvegarder les métadonnées avec l'information de batch
          const meta: StorageMeta & { batched: boolean; batchCount: number } = {
            version: STORAGE_VERSION,
            lastUpdated: new Date().toISOString(),
            totalResponses: responses.length,
            batched: true,
            batchCount: Math.ceil(responses.length / batchSize),
          }
          localStorage.setItem(STORAGE_META_KEY, JSON.stringify(meta))

          console.log(`Données sauvegardées en ${Math.ceil(responses.length / batchSize)} lots`)
        } catch (batchError) {
          console.error("Erreur lors de la sauvegarde par lots:", batchError)
        }
      }
    }
  }
}

// Fonction pour récupérer les réponses sauvegardées
export function loadResponses(): Response[] {
  if (typeof window !== "undefined") {
    try {
      // Vérifier les métadonnées
      const metaString = localStorage.getItem(STORAGE_META_KEY)
      if (metaString) {
        const meta = JSON.parse(metaString)

        // Si les données sont en lots
        if (meta.batched) {
          const allResponses: Response[] = []
          for (let i = 0; i < meta.batchCount; i++) {
            const batchData = localStorage.getItem(`${STORAGE_KEY}_batch_${i}`)
            if (batchData) {
              const batchResponses = JSON.parse(batchData)
              allResponses.push(...batchResponses)
            }
          }
          console.log(`Chargement de ${allResponses.length} réponses depuis ${meta.batchCount} lots`)
          return allResponses
        }
      }

      // Chargement normal
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const responses = JSON.parse(data)
        console.log(`Chargement de ${responses.length} réponses`)
        return responses
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    }
  }
  return []
}

// Fonction pour exporter toutes les données
export function exportAllData(): { responses: Response[]; meta: StorageMeta } {
  const responses = loadResponses()
  const metaString = localStorage.getItem(STORAGE_META_KEY)
  const meta = metaString
    ? JSON.parse(metaString)
    : {
        version: STORAGE_VERSION,
        lastUpdated: new Date().toISOString(),
        totalResponses: responses.length,
      }

  return { responses, meta }
}

// Fonction pour importer des données
export function importData(data: { responses: Response[]; meta?: StorageMeta }): boolean {
  try {
    saveResponses(data.responses)
    return true
  } catch (error) {
    console.error("Erreur lors de l'importation des données:", error)
    return false
  }
}

// Fonction pour vérifier l'intégrité des données
export function checkDataIntegrity(): {
  isValid: boolean
  totalResponses: number
  lastUpdated: string | null
  errors: string[]
} {
  const result = {
    isValid: true,
    totalResponses: 0,
    lastUpdated: null as string | null,
    errors: [] as string[],
  }

  try {
    const responses = loadResponses()
    result.totalResponses = responses.length

    const metaString = localStorage.getItem(STORAGE_META_KEY)
    if (metaString) {
      const meta = JSON.parse(metaString)
      result.lastUpdated = meta.lastUpdated

      // Vérifier la cohérence entre les métadonnées et les données réelles
      if (meta.totalResponses !== responses.length) {
        result.isValid = false
        result.errors.push(`Incohérence: ${meta.totalResponses} réponses attendues, ${responses.length} trouvées`)
      }
    } else {
      result.isValid = false
      result.errors.push("Métadonnées manquantes")
    }

    // Vérifier l'intégrité des données
    for (let i = 0; i < responses.length; i++) {
      if (!responses[i].id || !responses[i].createdAt) {
        result.isValid = false
        result.errors.push(`Réponse ${i} invalide: ID ou date manquant`)
      }
    }
  } catch (error) {
    result.isValid = false
    result.errors.push(`Erreur lors de la vérification: ${error}`)
  }

  return result
}

