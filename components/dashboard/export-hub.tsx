"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart, Database, Loader2 } from "lucide-react"
import type { Response } from "@/types/dashboard"
import { exportToCSV, exportToPDF } from "@/lib/export-utils"

interface ExportHubProps {
  responses: Response[]
  dashboardRef: React.RefObject<HTMLDivElement>
}

export function ExportHub({ responses, dashboardRef }: ExportHubProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return

    setIsExporting("pdf")
    try {
      await exportToPDF(dashboardRef.current, "tableau-de-bord-satisfaction")
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error)
    } finally {
      setIsExporting(null)
    }
  }

  const handleExportCSV = () => {
    setIsExporting("csv")
    try {
      exportToCSV(responses, "donnees-satisfaction")
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error)
    } finally {
      setIsExporting(null)
    }
  }

  const handleExportJSON = () => {
    setIsExporting("json")
    try {
      // Formater les données
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

      // Créer un blob et un lien de téléchargement
      const dataStr = JSON.stringify(formattedData, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
      const exportFileDefaultName = "donnees-satisfaction.json"
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    } catch (error) {
      console.error("Erreur lors de l'export JSON:", error)
    } finally {
      setIsExporting(null)
    }
  }

  const handleExportSQL = () => {
    setIsExporting("sql")
    try {
      // Créer un script SQL d'insertion
      let sqlScript = `-- Script d'insertion des données de satisfaction\n`
      sqlScript += `-- Généré le ${new Date().toLocaleString()}\n\n`

      sqlScript += `CREATE TABLE IF NOT EXISTS satisfaction_responses (\n`
      sqlScript += `  id VARCHAR(50) PRIMARY KEY,\n`
      sqlScript += `  created_at TIMESTAMP,\n`
      sqlScript += `  lieu_global VARCHAR(100),\n`
      sqlScript += `  lieu_adapte VARCHAR(10),\n`
      sqlScript += `  lieu_realite VARCHAR(10),\n`
      sqlScript += `  scenarios VARCHAR(100),\n`
      sqlScript += `  difficulte VARCHAR(50),\n`
      sqlScript += `  evolution_difficulte VARCHAR(50),\n`
      sqlScript += `  rythme VARCHAR(50),\n`
      sqlScript += `  duree VARCHAR(50),\n`
      sqlScript += `  attentes VARCHAR(10),\n`
      sqlScript += `  pedagogie VARCHAR(50),\n`
      sqlScript += `  qualite_reponses VARCHAR(50),\n`
      sqlScript += `  disponibilite_formateurs VARCHAR(50),\n`
      sqlScript += `  satisfaction_formation VARCHAR(10),\n`
      sqlScript += `  commentaire_lieu TEXT,\n`
      sqlScript += `  mises_en_situation TEXT,\n`
      sqlScript += `  commentaire_libre TEXT\n`
      sqlScript += `);\n\n`

      // Ajouter les insertions
      responses.forEach((response) => {
        sqlScript += `INSERT INTO satisfaction_responses VALUES (\n`
        sqlScript += `  '${response.id}',\n`
        sqlScript += `  '${new Date(response.createdAt).toISOString()}',\n`
        sqlScript += `  '${response.lieuGlobal.replace(/'/g, "''")}',\n`
        sqlScript += `  '${response.lieuAdapte.replace(/'/g, "''")}',\n`
        sqlScript += `  '${response.lieuRealite.replace(/'/g, "''")}',\n`
        sqlScript += `  '${response.scenarios.replace(/'/g, "''")}',\n`
        sqlScript += `  '${response.difficulte.replace(/'/g, "''")}',\n`
        sqlScript += `  '${response.evolutionDifficulte.replace(/'/g, "''")}',\n`
        sqlScript += `  '${response.rythme.replace(/'/g, "''")}',\n`
        sqlScript += `  '${response.duree.replace(/'/g, "''")}',\n`
        sqlScript += `  '${response.attentes.replace(/'/g, "''")}',\n`
        sqlScript += `  '${response.pedagogie.replace(/'/g, "''")}',\n`
        sqlScript += `  '${response.qualiteReponses.replace(/'/g, "''")}',\n`
        sqlScript += `  '${response.disponibiliteFormateurs.replace(/'/g, "''")}',\n`
        sqlScript += `  '${response.satisfactionFormation.replace(/'/g, "''")}',\n`
        sqlScript += `  '${(response.commentaireLieu || "").replace(/'/g, "''")}',\n`
        sqlScript += `  '${(response.misesEnSituation || "").replace(/'/g, "''")}',\n`
        sqlScript += `  '${(response.commentaireLibre || "").replace(/'/g, "''")}'`
        sqlScript += `\n);\n`
      })

      // Créer un blob et un lien de téléchargement
      const blob = new Blob([sqlScript], { type: "text/plain;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "donnees-satisfaction.sql")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Erreur lors de l'export SQL:", error)
    } finally {
      setIsExporting(null)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Centre d'exportation</CardTitle>
        <CardDescription>Exportez vos données dans différents formats pour analyse externe</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="standard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">Formats standard</TabsTrigger>
            <TabsTrigger value="bi">Outils d'analyse</TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="gap-2 h-24 flex flex-col"
                onClick={handleExportCSV}
                disabled={isExporting !== null}
              >
                {isExporting === "csv" ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Download className="h-6 w-6" />
                )}
                <span className="font-semibold">CSV</span>
                <span className="text-xs text-muted-foreground">Format tabulaire standard</span>
              </Button>

              <Button
                variant="outline"
                className="gap-2 h-24 flex flex-col"
                onClick={handleExportPDF}
                disabled={isExporting !== null}
              >
                {isExporting === "pdf" ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <FileText className="h-6 w-6" />
                )}
                <span className="font-semibold">PDF</span>
                <span className="text-xs text-muted-foreground">Capture du tableau de bord</span>
              </Button>

              <Button
                variant="outline"
                className="gap-2 h-24 flex flex-col"
                onClick={handleExportJSON}
                disabled={isExporting !== null}
              >
                {isExporting === "json" ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Database className="h-6 w-6" />
                )}
                <span className="font-semibold">JSON</span>
                <span className="text-xs text-muted-foreground">Format structuré pour API</span>
              </Button>

              <Button
                variant="outline"
                className="gap-2 h-24 flex flex-col"
                onClick={handleExportSQL}
                disabled={isExporting !== null}
              >
                {isExporting === "sql" ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Database className="h-6 w-6" />
                )}
                <span className="font-semibold">SQL</span>
                <span className="text-xs text-muted-foreground">Script d'insertion pour base de données</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="bi" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="gap-2 h-24 flex flex-col"
                onClick={handleExportCSV}
                disabled={isExporting !== null}
              >
                {isExporting === "csv" ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <BarChart className="h-6 w-6" />
                )}
                <span className="font-semibold">Tableau</span>
                <span className="text-xs text-muted-foreground">Format CSV pour Tableau</span>
              </Button>

              <Button
                variant="outline"
                className="gap-2 h-24 flex flex-col"
                onClick={handleExportCSV}
                disabled={isExporting !== null}
              >
                {isExporting === "csv" ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <BarChart className="h-6 w-6" />
                )}
                <span className="font-semibold">Google Data Studio</span>
                <span className="text-xs text-muted-foreground">Format CSV pour Data Studio</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

