import { NextResponse } from "next/server"
import { getLocalStorage } from "@/lib/local-storage"

export async function GET() {
  try {
    // Récupérer les connexions actives
    const activeConnections = getLocalStorage("activeConnections") || []

    // Filtrer les connexions inactives depuis plus de 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
    const filteredConnections = activeConnections.filter((conn: any) => conn.lastActivity > thirtyMinutesAgo)

    return NextResponse.json({ connections: filteredConnections })
  } catch (error) {
    console.error("Erreur lors de la récupération des connexions actives:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des connexions actives" }, { status: 500 })
  }
}

