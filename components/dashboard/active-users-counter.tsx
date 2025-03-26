"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { getActiveUsers } from "@/lib/storage-service"

export function ActiveUsersCounter() {
  const [activeUsers, setActiveUsers] = useState<number>(0)

  useEffect(() => {
    // Fonction pour mettre à jour le compteur
    const updateCounter = () => {
      const users = getActiveUsers()
      setActiveUsers(users.length)
    }

    // Mettre à jour immédiatement
    updateCounter()

    // Puis mettre à jour toutes les 5 secondes
    const interval = setInterval(updateCounter, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
        <Users className="h-4 w-4 text-blue-800" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{activeUsers}</div>
        <p className="text-xs text-muted-foreground">Personnes actuellement sur le formulaire</p>
      </CardContent>
    </Card>
  )
}

