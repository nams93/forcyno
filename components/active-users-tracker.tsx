"use client"

import { useEffect, useState } from "react"
import { trackActiveUser, removeActiveUser } from "@/lib/storage-service"

export function ActiveUsersTracker() {
  const [userId] = useState(() => {
    // Générer un ID unique pour cet utilisateur
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
  })

  useEffect(() => {
    // Enregistrer l'utilisateur comme actif
    trackActiveUser(userId)

    // Configurer un ping périodique pour maintenir l'utilisateur actif
    const pingInterval = setInterval(() => {
      trackActiveUser(userId)
    }, 30000) // Ping toutes les 30 secondes

    // Nettoyer lorsque l'utilisateur quitte la page
    return () => {
      clearInterval(pingInterval)
      removeActiveUser(userId)
    }
  }, [userId])

  // Ce composant ne rend rien visuellement
  return null
}

