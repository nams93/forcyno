import { type NextRequest, NextResponse } from "next/server"
import { getResponses } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de requête
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const format = searchParams.get("format") || "json"

    // Récupérer les données
    const responses = await getResponses()

    // Filtrer par date si nécessaire
    let filteredResponses = [...responses]
    if (startDate) {
      const start = new Date(startDate)
      filteredResponses = filteredResponses.filter((r) => new Date(r.createdAt) >= start)
    }
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Fin de journée
      filteredResponses = filteredResponses.filter((r) => new Date(r.createdAt) <= end)
    }

    // Formater la réponse selon le format demandé
    if (format === "csv") {
      // Générer un CSV
      const headers = [
        "id",
        "createdAt",
        "lieuGlobal",
        "lieuAdapte",
        "lieuRealite",
        "scenarios",
        "difficulte",
        "evolutionDifficulte",
        "rythme",
        "duree",
        "attentes",
        "pedagogie",
        "qualiteReponses",
        "disponibiliteFormateurs",
        "satisfactionFormation",
        "commentaireLieu",
        "misesEnSituation",
        "commentaireLibre",
      ]

      const rows = filteredResponses.map((r) =>
        headers
          .map((h) => {
            const value = r[h as keyof typeof r]
            return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
          })
          .join(","),
      )

      const csvContent = [headers.join(","), ...rows].join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="donnees-satisfaction.csv"',
        },
      })
    }

    // Par défaut, retourner du JSON
    return NextResponse.json(filteredResponses)
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

