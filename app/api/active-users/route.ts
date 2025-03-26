import { NextResponse } from "next/server"
import { getActiveUsers, trackActiveUser } from "@/lib/storage-service"

// Endpoint pour obtenir le nombre d'utilisateurs actifs
export async function GET() {
  try {
    const activeUsers = getActiveUsers()

    // Nettoyer les utilisateurs inactifs (plus de 2 minutes sans activité)
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000
    const activeUserCount = activeUsers.length

    return NextResponse.json({
      count: activeUserCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs actifs:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// Endpoint pour enregistrer un utilisateur actif
export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "ID utilisateur requis" }, { status: 400 })
    }

    // Enregistrer l'utilisateur comme actif
    trackActiveUser(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur actif:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

