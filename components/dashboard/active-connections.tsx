"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { RefreshCw } from "lucide-react"

interface Connection {
  sessionId: string
  timestamp: string
  userAgent: string
  lastActivity: string
  hasSubmitted?: boolean
}

export function ActiveConnections() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchConnections = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/active-connections")

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des connexions actives")
      }

      const data = await response.json()
      setConnections(data.connections || [])
      setError(null)
    } catch (error) {
      console.error("Erreur:", error)
      setError("Impossible de récupérer les connexions actives")
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les connexions actives",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()

    // Rafraîchir toutes les 10 secondes
    const interval = setInterval(fetchConnections, 10000)

    return () => clearInterval(interval)
  }, [])

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Fonction pour calculer le temps écoulé depuis la dernière activité
  const getTimeSinceLastActivity = (lastActivity: string) => {
    const lastActivityTime = new Date(lastActivity).getTime()
    const now = Date.now()
    const diffInMinutes = Math.floor((now - lastActivityTime) / (1000 * 60))

    if (diffInMinutes < 1) return "À l'instant"
    if (diffInMinutes === 1) return "Il y a 1 minute"
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} minutes`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours === 1) return "Il y a 1 heure"
    return `Il y a ${diffInHours} heures`
  }

  // Fonction pour déterminer le type d'appareil
  const getDeviceType = (userAgent: string) => {
    const ua = userAgent.toLowerCase()
    if (ua.includes("mobile")) return "Mobile"
    if (ua.includes("tablet")) return "Tablette"
    return "Ordinateur"
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Connexions actives</CardTitle>
          <CardDescription>Utilisateurs actuellement connectés au formulaire</CardDescription>
        </div>
        <button onClick={fetchConnections} className="p-2 rounded-full hover:bg-gray-100" title="Rafraîchir">
          <RefreshCw className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : connections.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Aucune connexion active pour le moment</div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {connections.length} utilisateur{connections.length > 1 ? "s" : ""} actif
                {connections.length > 1 ? "s" : ""}
              </p>
              <Badge variant="outline" className="bg-green-50">
                {connections.filter((c) => c.hasSubmitted).length} formulaire
                {connections.filter((c) => c.hasSubmitted).length > 1 ? "s" : ""} soumis
              </Badge>
            </div>
            <div className="divide-y">
              {connections.map((connection) => (
                <div key={connection.sessionId} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{getDeviceType(connection.userAgent)}</span>
                        {connection.hasSubmitted && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Formulaire soumis</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">Connecté depuis {formatDate(connection.timestamp)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Dernière activité:</p>
                      <p className="text-sm font-medium">{getTimeSinceLastActivity(connection.lastActivity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

