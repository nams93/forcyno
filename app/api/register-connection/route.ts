import { NextResponse } from "next/server"
import { getLocalStorage, setLocalStorage } from "@/lib/local-storage"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Récupérer les connexions actuelles
    const activeConnections = getLocalStorage("activeConnections") || []

    // Vérifier si cette session existe déjà
    const existingIndex = activeConnections.findIndex((conn: any) => conn.sessionId === data.sessionId)

    if (existingIndex >= 0) {
      // Mettre à jour la connexion existante
      activeConnections[existingIndex] = {
        ...activeConnections[existingIndex],
        lastActivity: new Date().toISOString(),
      }
    } else {
      // Ajouter la nouvelle connexion
      activeConnections.push({
        sessionId: data.sessionId,
        timestamp: data.timestamp || new Date().toISOString(),
        userAgent: data.userAgent || "Unknown",
        lastActivity: new Date().toISOString(),
      })
    }

    // Enregistrer les connexions mises à jour
    setLocalStorage("activeConnections", activeConnections)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la connexion:", error)
    return NextResponse.json({ error: "Erreur lors de l'enregistrement de la connexion" }, { status: 500 })
  }
}

