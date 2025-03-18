import { NextResponse } from "next/server"

// Cette route API permet de servir une image de fond par défaut si aucune n'est fournie
export async function GET() {
  // Rediriger vers une image de fond par défaut
  // Vous pouvez remplacer cette URL par celle de votre choix
  return NextResponse.redirect(
    "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1974&auto=format&fit=crop",
  )
}

