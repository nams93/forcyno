import { NextResponse } from "next/server"
import { getLocalStorage, setLocalStorage } from "@/lib/local-storage"

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    // Récupérer les connexions actuelles
    const activeConnections = getLocalStorage("activeConnections") || []

    // Filtrer pour supprimer la connexion
    const updatedConnections = activeConnections.filter((conn: any) => conn.sessionId !== sessionId)

    // Enregistrer les connexions mises à jour
    setLocalStorage("activeConnections", updatedConnections)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error)
    return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 })
  }
}

