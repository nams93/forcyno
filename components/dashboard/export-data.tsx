"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLocalStorage } from "@/lib/local-storage"
import { Download } from "lucide-react"

export function ExportData() {
  const [format, setFormat] = useState<string>("csv")
  const [isExporting, setIsExporting] = useState<boolean>(false)

  const exportData = () => {
    setIsExporting(true)

    try {
      // Récupérer toutes les données
      const responses = getLocalStorage("responses") || []
      const offlineResponses = JSON.parse(localStorage.getItem("offlineResponses") || "[]")
      const allResponses = [...responses, ...offlineResponses]

      if (allResponses.length === 0) {
        alert("Aucune donnée à exporter")
        setIsExporting(false)
        return
      }

      let content = ""
      let filename = `satisfaction-responses-${new Date().toISOString().split("T")[0]}`

      if (format === "csv") {
        // Créer l'en-tête CSV avec toutes les clés possibles
        const allKeys = new Set<string>()
        allResponses.forEach((response) => {
          Object.keys(response).forEach((key) => allKeys.add(key))
        })

        const headers = Array.from(allKeys)
        content = headers.join(",") + "\n"

        // Ajouter les données
        allResponses.forEach((response) => {
          const row = headers.map((header) => {
            const value = response[header]
            // Échapper les virgules et les guillemets
            if (typeof value === "string") {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value || ""
          })
          content += row.join(",") + "\n"
        })

        filename += ".csv"
      } else if (format === "json") {
        content = JSON.stringify(allResponses, null, 2)
        filename += ".json"
      }

      // Créer et télécharger le fichier
      const blob = new Blob([content], { type: format === "csv" ? "text/csv;charset=utf-8" : "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Erreur lors de l'exportation des données:", error)
      alert("Une erreur est survenue lors de l'exportation des données")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exporter les données</CardTitle>
        <CardDescription>Téléchargez toutes les réponses au formulaire</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Format d'exportation</label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV (Excel, Google Sheets)</SelectItem>
              <SelectItem value="json">JSON (Données brutes)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportData} disabled={isExporting} className="w-full">
          {isExporting ? (
            "Exportation en cours..."
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Exporter les données
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          L'exportation inclut toutes les réponses, y compris celles stockées localement
        </p>
      </CardContent>
    </Card>
  )
}

