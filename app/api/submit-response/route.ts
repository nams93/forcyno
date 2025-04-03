import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Ici, vous pourriez enregistrer les données dans une base de données
    // Par exemple avec Prisma, Supabase, Firebase, etc.

    // Pour l'instant, simulons un enregistrement réussi
    console.log("Nouvelle réponse reçue:", data)

    // Stocker dans le localStorage côté serveur n'est pas possible
    // Mais nous pouvons renvoyer les données pour que le client les stocke

    return NextResponse.json({
      success: true,
      message: "Réponse enregistrée avec succès",
      data: data,
    })
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la réponse:", error)
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'enregistrement de la réponse" },
      { status: 500 },
    )
  }
}

