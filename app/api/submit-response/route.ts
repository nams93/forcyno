import { NextResponse } from "next/server"

// Simuler une base de données avec localStorage côté serveur
let formResponses: any[] = []

// Fonction pour charger les réponses existantes
const loadResponses = () => {
  if (typeof window !== "undefined") {
    const storedResponses = localStorage.getItem("dashboard_responses")
    if (storedResponses) {
      try {
        formResponses = JSON.parse(storedResponses)
      } catch (e) {
        console.error("Erreur lors du chargement des réponses:", e)
      }
    }
  }
}

// Fonction pour sauvegarder les réponses
const saveResponses = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("dashboard_responses", JSON.stringify(formResponses))
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Charger les réponses existantes
    loadResponses()

    // Ajouter un ID unique et un timestamp
    const responseData = {
      ...data,
      id: `response-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      receivedAt: new Date().toISOString(),
    }

    // Ajouter la nouvelle réponse
    formResponses.push(responseData)

    // Sauvegarder les réponses
    saveResponses()

    return NextResponse.json({
      success: true,
      message: "Réponse enregistrée avec succès",
      data: responseData,
    })
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la réponse:", error)
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'enregistrement de la réponse" },
      { status: 500 },
    )
  }
}

// Endpoint pour récupérer toutes les réponses
export async function GET() {
  loadResponses()

  return NextResponse.json({
    success: true,
    responses: formResponses,
  })
}
