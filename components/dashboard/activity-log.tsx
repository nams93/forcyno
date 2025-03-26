"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Response } from "@/types/dashboard"
import { getResponses } from "@/lib/data-service"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function ActivityLog() {
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les réponses
  useEffect(() => {
    const loadResponses = async () => {
      setIsLoading(true)
      try {
        const data = await getResponses()
        // Trier par date décroissante
        const sortedData = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setResponses(sortedData.slice(0, 10)) // Prendre les 10 plus récentes
      } catch (error) {
        console.error("Erreur lors du chargement des réponses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadResponses()

    // Rafraîchir les données toutes les 30 secondes
    const interval = setInterval(loadResponses, 30000)
    return () => clearInterval(interval)
  }, [])

  // Grouper les réponses par jour
  const groupedResponses: Record<string, Response[]> = {}

  responses.forEach((response) => {
    const date = new Date(response.createdAt)
    const day = format(date, "yyyy-MM-dd")

    if (!groupedResponses[day]) {
      groupedResponses[day] = []
    }

    groupedResponses[day].push(response)
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Journal d'activité</CardTitle>
        <CardDescription>Historique des réponses au formulaire</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : responses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucune activité enregistrée</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedResponses).map(([day, dayResponses]) => (
              <div key={day} className="relative">
                <div className="sticky top-0 bg-background z-10 py-2">
                  <h3 className="font-medium">{format(new Date(day), "EEEE d MMMM yyyy", { locale: fr })}</h3>
                </div>

                <ol className="mt-2 space-y-4 border-l border-muted pl-4">
                  {dayResponses.map((response) => (
                    <li key={response.id} className="relative">
                      <div className="absolute -left-[21px] h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="h-3 w-3 rounded-full bg-background"></span>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <time className="text-xs text-muted-foreground">
                            {format(new Date(response.createdAt), "HH:mm")}
                          </time>
                          <Badge variant={response.satisfactionFormation === "Oui" ? "default" : "destructive"}>
                            {response.satisfactionFormation === "Oui" ? "Satisfait" : "Non satisfait"}
                          </Badge>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <div>
                            <span className="font-medium">Lieu:</span> {response.lieuGlobal}
                          </div>
                          <div>
                            <span className="font-medium">Difficulté:</span> {response.difficulte}
                          </div>
                        </div>

                        {response.commentaireLibre && (
                          <p className="mt-2 text-sm italic">
                            "{response.commentaireLibre.substring(0, 100)}
                            {response.commentaireLibre.length > 100 ? "..." : ""}"
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

