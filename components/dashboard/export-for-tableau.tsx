"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart, Loader2 } from "lucide-react"
import type { Response } from "@/types/dashboard"

interface ExportForTableauProps {
  responses: Response[]
}

export function ExportForTableau({ responses }: ExportForTableauProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportForTableau = async () => {
    setIsExporting(true)
    try {
      // Formater les données pour Tableau
      const formattedData = responses.map((response) => ({
        id: response.id,
        date: new Date(response.createdAt).toISOString(),
        lieuGlobal: response.lieuGlobal,
        lieuAdapte: response.lieuAdapte,
        lieuRealite: response.lieuRealite,
        scenarios: response.scenarios,
        difficulte: response.difficulte,
        evolutionDifficulte: response.evolutionDifficulte,
        rythme: response.rythme,
        duree: response.duree,
        attentes: response.attentes,
        pedagogie: response.pedagogie,
        qualiteReponses: response.qualiteReponses,
        disponibiliteFormateurs: response.disponibiliteFormateurs,
        satisfactionFormation: response.satisfactionFormation,
        commentaireLieu: response.commentaireLieu || "",
        misesEnSituation: response.misesEnSituation || "",
        commentaireLibre: response.commentaireLibre || "",
      }))

      // Créer un fichier CSV pour Tableau
      const headers = Object.keys(formattedData[0]).join(",")
      const rows = formattedData.map((row) =>
        Object.values(row)
          .map((value) => (typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value))
          .join(","),
      )
      const csvContent = [headers, ...rows].join("\n")

      // Créer un blob et un lien de téléchargement
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "donnees-satisfaction-tableau.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Erreur lors de l'export pour Tableau:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" className="gap-2" onClick={handleExportForTableau} disabled={isExporting}>
      {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart className="h-4 w-4" />}
      Exporter pour Tableau
    </Button>
  )
}

