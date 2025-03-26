import type { Response } from "@/types/dashboard"
// Importer le nouveau service de stockage
import { loadResponses, saveResponses as saveResponsesToStorage } from "./data-storage-service"

// Variable pour stocker les réponses en mémoire
let demoResponses: Response[] = []

// Remplacer la fonction getResponses existante par celle-ci
export async function getResponses(): Promise<Response[]> {
  // Simuler un délai de chargement
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Charger les données depuis le stockage persistant
  const storedResponses = loadResponses()

  // Si nous avons des données stockées, les utiliser
  if (storedResponses.length > 0) {
    demoResponses = storedResponses
  }
  // Sinon, si demoResponses est vide, initialiser avec des données de démonstration
  else if (demoResponses.length === 0) {
    // Initialiser avec quelques données de démonstration
    demoResponses = generateDemoResponses()
    // Sauvegarder les données de démonstration
    saveResponsesToStorage(demoResponses)
  }

  return demoResponses
}

// Remplacer la fonction saveResponse existante par celle-ci
export async function saveResponse(data: Omit<Response, "id" | "createdAt" | "session">): Promise<Response> {
  // Simuler un délai d'enregistrement
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Récupérer les réponses existantes
  const responses = await getResponses()

  // Créer une nouvelle réponse avec un ID unique et un timestamp
  const newResponse: Response = {
    ...data,
    id: generateUniqueId(),
    createdAt: new Date().toISOString(),
    session: data.session || "SECTION 1", // Valeur par défaut si non spécifiée
  }

  // Ajouter la nouvelle réponse
  responses.push(newResponse)

  // Sauvegarder toutes les réponses avec le nouveau système
  saveResponsesToStorage(responses)

  // Mettre à jour la variable en mémoire
  demoResponses = responses

  return newResponse
}

// Fonction pour obtenir les statistiques en temps réel
export function getRealtimeStats() {
  const totalResponses = demoResponses.length

  // Calculer le nombre de réponses aujourd'hui
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const responsesToday = demoResponses.filter((r) => new Date(r.createdAt) >= today).length

  // Calculer le nombre de réponses cette semaine
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const responsesThisWeek = demoResponses.filter((r) => new Date(r.createdAt) >= startOfWeek).length

  return {
    totalResponses,
    responsesToday,
    responsesThisWeek,
    lastResponse: demoResponses.length > 0 ? demoResponses[demoResponses.length - 1] : null,
  }
}

// Générer un ID unique
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

// Ajouter cette fonction pour générer des données de démonstration
function generateDemoResponses(): Response[] {
  const sections = ["SECTION 1", "SECTION 2", "SECTION 3", "SECTION 4"]
  const satisfactionOptions = ["Oui", "Non"]
  const difficulteOptions = ["Très difficile", "Difficile", "Facile", "Très facile"]
  const pedagogieOptions = ["Très bien", "Bien", "Moyen", "Mauvais"]
  const lieuOptions = ["Très satisfait", "Plutôt satisfait", "Plutôt insatisfait", "Très insatisfait"]

  const demoData: Response[] = []

  // Générer 20 réponses de démonstration
  for (let i = 0; i < 20; i++) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)) // Jusqu'à 30 jours dans le passé

    demoData.push({
      id: `demo-${i + 1}`,
      session: sections[Math.floor(Math.random() * sections.length)],
      lieuGlobal: lieuOptions[Math.floor(Math.random() * lieuOptions.length)],
      lieuAdapte: Math.random() > 0.5 ? "Oui" : "Non",
      lieuRealite: Math.random() > 0.5 ? "Oui" : "Non",
      commentaireLieu: Math.random() > 0.7 ? "Commentaire sur le lieu de formation" : "",
      scenarios: lieuOptions[Math.floor(Math.random() * lieuOptions.length)],
      misesEnSituation: Math.random() > 0.7 ? "Commentaire sur les mises en situation" : "",
      difficulte: difficulteOptions[Math.floor(Math.random() * difficulteOptions.length)],
      evolutionDifficulte: ["Bien équilibré", "Trop difficile", "Trop facile"][Math.floor(Math.random() * 3)],
      rythme: ["Trop lent", "Correct", "Trop rapide"][Math.floor(Math.random() * 3)],
      duree: ["Trop court", "Correct", "Trop long"][Math.floor(Math.random() * 3)],
      attentes: Math.random() > 0.3 ? "Oui" : "Non",
      pedagogie: pedagogieOptions[Math.floor(Math.random() * pedagogieOptions.length)],
      qualiteReponses: pedagogieOptions[Math.floor(Math.random() * pedagogieOptions.length)],
      disponibiliteFormateurs: ["Très disponible", "Disponible", "Peu disponible", "Pas disponible"][
        Math.floor(Math.random() * 4)
      ],
      satisfactionFormation: satisfactionOptions[Math.floor(Math.random() * satisfactionOptions.length)],
      commentaireLibre: Math.random() > 0.7 ? "Commentaire libre sur la formation" : "",
      createdAt: date.toISOString(),
    })
  }

  return demoData
}

