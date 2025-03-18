"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChartBig, Loader2 } from "lucide-react"
import type { Response } from "@/types/dashboard"

interface PowerBIExportProps {
  responses: Response[]
}

export function PowerBIExport({ responses }: PowerBIExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportToPowerBI = async () => {
    setIsExporting(true)
    try {
      // Formater les données pour Power BI
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
        // Convertir les commentaires en chaînes vides s'ils sont null
        commentaireLieu: response.commentaireLieu || "",
        misesEnSituation: response.misesEnSituation || "",
        commentaireLibre: response.commentaireLibre || "",
      }))

      // Créer un fichier JSON pour Power BI
      const dataStr = JSON.stringify(formattedData, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      // Créer un lien de téléchargement
      const exportFileDefaultName = "donnees-satisfaction-powerbi.json"
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    } catch (error) {
      console.error("Erreur lors de l'export pour Power BI:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" className="gap-2" onClick={handleExportToPowerBI} disabled={isExporting}>
      {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChartBig className="h-4 w-4" />}
      Exporter pour Power BI
    </Button>
  )
}

