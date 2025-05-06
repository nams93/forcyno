"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ExportData() {
  const [format, setFormat] = useState<string>("csv")
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [isImporting, setIsImporting] = useState<boolean>(false)
  const { toast } = useToast()

  const exportData = () => {
    setIsExporting(true)

    try {
      // Récupérer toutes les données
      const responses = JSON.parse(localStorage.getItem("dashboard_responses") || "[]")

      if (responses.length === 0) {
        toast({
          title: "Aucune donnée",
          description: "Aucune donnée à exporter",
          variant: "destructive",
        })
        setIsExporting(false)
        return
      }

      let content = ""
      let filename = `satisfaction-responses-${new Date().toISOString().split("T")[0]}`

      if (format === "csv") {
        // Créer l'en-tête CSV avec toutes les clés possibles
        const allKeys = new Set<string>()
        responses.forEach((response: any) => {
          Object.keys(response).forEach((key) => allKeys.add(key))
        })

        const headers = Array.from(allKeys)
        content = headers.join(",") + "\n"

        // Ajouter les données
        responses.forEach((response: any) => {
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
        content = JSON.stringify(responses, null, 2)
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

      toast({
        title: "Exportation réussie",
        description: `${responses.length} réponses exportées avec succès.`,
      })
    } catch (error) {
      console.error("Erreur lors de l'exportation des données:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'exportation des données",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        let importedData: any[] = []

        if (file.name.endsWith(".json")) {
          importedData = JSON.parse(content)
        } else if (file.name.endsWith(".csv")) {
          // Parsing CSV basique
          const lines = content.split("\n")
          const headers = lines[0].split(",").map((h) => h.trim().replace(/^"(.*)"$/, "$1"))

          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue

            const values = lines[i].split(",")
            const entry: any = {}

            headers.forEach((header, index) => {
              let value = values[index] || ""
              // Nettoyer les guillemets
              value = value.trim().replace(/^"(.*)"$/, "$1")
              entry[header] = value
            })

            importedData.push(entry)
          }
        }

        if (importedData.length > 0) {
          // Fusionner avec les données existantes
          const existingData = JSON.parse(localStorage.getItem("dashboard_responses") || "[]")

          // Dédupliquer par ID
          const mergedData = [...existingData]

          importedData.forEach((item) => {
            if (!item.id) {
              item.id = `imported-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
            }

            const existingIndex = mergedData.findIndex((existing) => existing.id === item.id)
            if (existingIndex >= 0) {
              mergedData[existingIndex] = item
            } else {
              mergedData.push(item)
            }
          })

          // Sauvegarder les données fusionnées
          localStorage.setItem("dashboard_responses", JSON.stringify(mergedData))

          toast({
            title: "Importation réussie",
            description: `${importedData.length} réponses importées avec succès.`,
          })

          // Déclencher un événement pour mettre à jour les statistiques
          window.dispatchEvent(new Event("formSubmitted"))
        } else {
          toast({
            title: "Importation échouée",
            description: "Aucune donnée valide trouvée dans le fichier.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erreur lors de l'importation:", error)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'importation des données",
          variant: "destructive",
        })
      } finally {
        setIsImporting(false)
        // Réinitialiser l'input file
        event.target.value = ""
      }
    }

    reader.onerror = () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la lecture du fichier",
        variant: "destructive",
      })
      setIsImporting(false)
      event.target.value = ""
    }

    if (file.name.endsWith(".json") || file.name.endsWith(".csv")) {
      reader.readAsText(file)
    } else {
      toast({
        title: "Format non supporté",
        description: "Veuillez importer un fichier JSON ou CSV",
        variant: "destructive",
      })
      setIsImporting(false)
      event.target.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exporter/Importer les données</CardTitle>
        <CardDescription>
          Téléchargez toutes les réponses ou importez des données précédemment exportées
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Format d'exportation</Label>
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

        <div className="border-t pt-4">
          <Label htmlFor="import-file" className="block text-sm font-medium mb-2">
            Importer des données
          </Label>
          <div className="flex flex-col space-y-2">
            <Input
              id="import-file"
              type="file"
              accept=".json,.csv"
              onChange={handleImport}
              disabled={isImporting}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Formats supportés: JSON, CSV. Les données importées seront fusionnées avec les données existantes.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
