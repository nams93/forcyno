"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { RefreshCcw, UserX, Users } from "lucide-react"

export function ActiveConnections() {
  const [connections, setConnections] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const { toast } = useToast()

  const fetchConnections = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/active-connections")
      const data = await response.json()

      if (data.success) {
        setConnections(data.connections)
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les connexions actives",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des connexions:", error)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les connexions actives",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()

    // Rafraîchir les connexions toutes les 30 secondes
    const interval = setInterval(fetchConnections, 30000)

    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const disconnectUser = async (sessionId: string) => {
    try {
      const response = await fetch("/api/active-connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "unregister",
          sessionId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Succès",
          description: "L'utilisateur a été déconnecté",
        })

        // Mettre à jour la liste des connexions
        setConnections(connections.filter((conn) => conn.sessionId !== sessionId))
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de déconnecter l'utilisateur",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      toast({
        title: "Erreur",
        description: "Impossible de déconnecter l'utilisateur",
        variant: "destructive",
      })
    }
  }

  const disconnectAllUsers = async () => {
    setIsDisconnecting(true)
    try {
      const response = await fetch("/api/active-connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "unregister_all",
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Succès",
          description: "Tous les utilisateurs ont été déconnectés",
        })

        // Mettre à jour la liste des connexions
        setConnections([])
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de déconnecter tous les utilisateurs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion de tous les utilisateurs:", error)
      toast({
        title: "Erreur",
        description: "Impossible de déconnecter tous les utilisateurs",
        variant: "destructive",
      })
    } finally {
      setIsDisconnecting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Connexions actives</CardTitle>
          <CardDescription>Gérer les utilisateurs actuellement connectés au formulaire</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchConnections} disabled={isLoading}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={disconnectAllUsers}
            disabled={isLoading || isDisconnecting || connections.length === 0}
          >
            <UserX className="h-4 w-4 mr-2" />
            Déconnecter tous
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center p-8 text-gray-500 flex flex-col items-center">
            <Users className="h-12 w-12 text-gray-300 mb-2" />
            <p>Aucune connexion active</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID de session</TableHead>
                  <TableHead>Date de connexion</TableHead>
                  <TableHead>Navigateur</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connections.map((connection) => (
                  <TableRow key={connection.sessionId}>
                    <TableCell className="font-mono text-xs">{connection.sessionId.substring(0, 8)}...</TableCell>
                    <TableCell>{formatDate(connection.timestamp)}</TableCell>
                    <TableCell className="max-w-xs truncate">{connection.userAgent}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => disconnectUser(connection.sessionId)}>
                        <UserX className="h-4 w-4 mr-2" />
                        Déconnecter
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
