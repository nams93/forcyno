"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle2 } from "lucide-react"
import type { Response } from "@/types/dashboard"
import { getRealtimeStats } from "@/lib/data-service"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

export function RecentResponses() {
  const [stats, setStats] = useState<{
    totalResponses: number
    responsesToday: number
    responsesThisWeek: number
    lastResponse: Response | null
  }>({
    totalResponses: 0,
    responsesToday: 0,
    responsesThisWeek: 0,
    lastResponse: null,
  })

  const [newResponseAlert, setNewResponseAlert] = useState(false)

  // Charger les statistiques initiales
  useEffect(() => {
    const initialStats = getRealtimeStats()
    setStats(initialStats)
  }, [])

  // Simuler la réception de nouvelles réponses (dans un environnement réel,
  // cela serait fait avec des WebSockets ou des requêtes périodiques)
  useEffect(() => {
    const checkForNewResponses = () => {
      const currentStats = getRealtimeStats()

      // Vérifier s'il y a une nouvelle réponse
      if (currentStats.totalResponses > stats.totalResponses) {
        // Afficher une alerte
        setNewResponseAlert(true)

        // Mettre à jour les statistiques
        setStats(currentStats)

        // Masquer l'alerte après 5 secondes
        setTimeout(() => {
          setNewResponseAlert(false)
        }, 5000)
      }
    }

    // Vérifier toutes les 10 secondes (pour la démonstration)
    const interval = setInterval(checkForNewResponses, 10000)

    return () => clearInterval(interval)
  }, [stats.totalResponses])

  return (
    <Card className="w-full">
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          Réponses récentes
          {newResponseAlert && (
            <Badge className="bg-green-500 animate-pulse">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Nouvelle réponse
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Suivi en temps réel des nouvelles réponses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-3xl font-bold">{stats.totalResponses}</p>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Aujourd'hui</p>
            <p className="text-3xl font-bold">{stats.responsesToday}</p>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Cette semaine</p>
            <p className="text-3xl font-bold">{stats.responsesThisWeek}</p>
          </div>
        </div>

        {stats.lastResponse ? (
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">Dernière réponse</h3>
                <p className="text-sm text-muted-foreground">
                  il y a {formatDistanceToNow(new Date(stats.lastResponse.createdAt), { locale: fr })}
                </p>
              </div>
              <Badge variant={stats.lastResponse.satisfactionFormation === "Oui" ? "default" : "destructive"}>
                {stats.lastResponse.satisfactionFormation === "Oui" ? "Satisfait" : "Non satisfait"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <p className="text-sm font-medium">Lieu</p>
                <p className="text-sm">{stats.lastResponse.lieuGlobal}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Difficulté</p>
                <p className="text-sm">{stats.lastResponse.difficulte}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Pédagogie</p>
                <p className="text-sm">{stats.lastResponse.pedagogie}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Attentes</p>
                <p className="text-sm">{stats.lastResponse.attentes}</p>
              </div>
            </div>

            {stats.lastResponse.commentaireLibre && (
              <div className="mt-4">
                <p className="text-sm font-medium">Commentaire</p>
                <p className="text-sm italic bg-muted p-2 rounded mt-1">"{stats.lastResponse.commentaireLibre}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucune réponse enregistrée pour le moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

