"use server"

import type { DashboardStats, Response } from "@/types/dashboard"
import { getResponses } from "@/lib/data-service"

export async function getDashboardData() {
  // Récupérer les réponses depuis la base de données ou le stockage
  const responses = await getResponses()

  // Calculer les statistiques
  const stats: DashboardStats = {
    totalResponses: responses.length,
    recentIncrease: 5, // Exemple: 5 nouvelles réponses cette semaine
    satisfactionRate: calculateSatisfactionRate(responses),
    satisfactionChange: 2.5, // Exemple: augmentation de 2.5% depuis le mois dernier
    averageDifficulty: calculateAverageDifficulty(responses),
    commentCount: countComments(responses),
    commentPercentage: Math.round((countComments(responses) / responses.length) * 100),
  }

  return {
    stats,
    responses,
  }
}

// Fonction pour calculer le taux de satisfaction
function calculateSatisfactionRate(responses: Response[]): number {
  const satisfiedCount = responses.filter(
    (r) =>
      r.satisfactionFormation === "Oui" || r.lieuGlobal === "Très satisfait" || r.lieuGlobal === "Plutôt satisfait",
  ).length

  return Math.round((satisfiedCount / responses.length) * 100)
}

// Fonction pour calculer la difficulté moyenne
function calculateAverageDifficulty(responses: Response[]): number {
  const difficultyMap: Record<string, number> = {
    "Très difficile": 4,
    Difficile: 3,
    Facile: 2,
    "Très facile": 1,
  }

  const sum = responses.reduce((acc, response) => {
    const difficultyValue = difficultyMap[response.difficulte as string] || 0
    return acc + difficultyValue
  }, 0)

  return Number.parseFloat((sum / responses.length).toFixed(1))
}

// Fonction pour compter les commentaires
function countComments(responses: Response[]): number {
  return responses.filter(
    (r) =>
      (r.commentaireLieu && r.commentaireLieu.trim() !== "") ||
      (r.commentaireLibre && r.commentaireLibre.trim() !== "") ||
      (r.misesEnSituation && r.misesEnSituation.trim() !== ""),
  ).length
}

