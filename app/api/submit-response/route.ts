import { NextResponse } from "next/server"
import { getLocalStorage, setLocalStorage } from "@/lib/local-storage"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Récupérer les réponses existantes
    const responses = getLocalStorage("responses") || []

    // Ajouter la nouvelle réponse
    responses.push({
      ...data,
      timestamp: data.timestamp || new Date().toISOString(),
    })

    // Enregistrer les réponses mises à jour
    setLocalStorage("responses", responses)

    // Mettre à jour l'activité de la connexion
    const activeConnections = getLocalStorage("activeConnections") || []
    const updatedConnections = activeConnections.map((conn: any) => {
      if (conn.sessionId === data.sessionId) {
        return {
          ...conn,
          lastActivity: new Date().toISOString(),
          hasSubmitted: true,
        }
      }
      return conn
    })

    setLocalStorage("activeConnections", updatedConnections)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la réponse:", error)
    return NextResponse.json({ error: "Erreur lors de l'enregistrement de la réponse" }, { status: 500 })
  }
}

