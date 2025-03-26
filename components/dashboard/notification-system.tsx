"use client"

import { useState, useEffect } from "react"
import { getRealtimeStats } from "@/lib/data-service"
import { toast } from "@/components/ui/use-toast"

export function NotificationSystem() {
  const [lastResponseCount, setLastResponseCount] = useState(0)

  useEffect(() => {
    // Vérifier l'état initial
    const initialStats = getRealtimeStats()
    setLastResponseCount(initialStats.totalResponses)

    // Vérifier périodiquement les nouvelles réponses
    const checkForNewResponses = () => {
      const currentStats = getRealtimeStats()

      // S'il y a de nouvelles réponses
      if (currentStats.totalResponses > lastResponseCount) {
        const newResponsesCount = currentStats.totalResponses - lastResponseCount

        // Afficher une notification
        toast({
          title: `${newResponsesCount} nouvelle${newResponsesCount > 1 ? "s" : ""} réponse${newResponsesCount > 1 ? "s" : ""}`,
          description: "Un utilisateur vient de compléter le formulaire de satisfaction.",
          action: (
            <a href="/dashboard?tab=realtime" className="bg-primary text-white px-3 py-2 rounded-md text-xs">
              Voir les détails
            </a>
          ),
        })

        // Jouer un son de notification (optionnel)
        const audio = new Audio("/notification.mp3")
        audio.play().catch((e) => console.log("Erreur lors de la lecture du son:", e))

        // Mettre à jour le compteur
        setLastResponseCount(currentStats.totalResponses)
      }
    }

    // Vérifier toutes les 15 secondes
    const interval = setInterval(checkForNewResponses, 15000)

    return () => clearInterval(interval)
  }, [lastResponseCount])

  return null // Ce composant n'affiche rien, il gère uniquement les notifications
}

