import { NextResponse } from "next/server"

// Simuler une base de données pour les connexions actives
// Dans une application réelle, cela serait stocké dans une base de données
let activeConnections: any[] = []

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      connections: activeConnections,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des connexions actives:", error)
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des connexions actives" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { action, sessionId } = await request.json()

    if (action === "register") {
      const connectionData = {
        sessionId,
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get("user-agent") || "Unknown",
      }

      // Vérifier si la connexion existe déjà
      const existingIndex = activeConnections.findIndex((conn) => conn.sessionId === sessionId)
      if (existingIndex >= 0) {
        activeConnections[existingIndex] = connectionData
      } else {
        activeConnections.push(connectionData)
      }

      return NextResponse.json({
        success: true,
        message: "Connexion enregistrée",
      })
    } else if (action === "unregister") {
      // Supprimer la connexion
      activeConnections = activeConnections.filter((conn) => conn.sessionId !== sessionId)

      return NextResponse.json({
        success: true,
        message: "Connexion supprimée",
      })
    } else if (action === "unregister_all") {
      // Supprimer toutes les connexions
      activeConnections = []

      return NextResponse.json({
        success: true,
        message: "Toutes les connexions ont été supprimées",
      })
    }

    return NextResponse.json({ success: false, message: "Action non reconnue" }, { status: 400 })
  } catch (error) {
    console.error("Erreur lors de la gestion des connexions:", error)
    return NextResponse.json({ success: false, message: "Erreur lors de la gestion des connexions" }, { status: 500 })
  }
}

