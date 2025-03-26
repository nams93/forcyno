"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getLocalStorage, setLocalStorage, clearLocalStorage } from "@/lib/local-storage"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Download, Upload, Trash2, Save, RefreshCw } from "lucide-react"

export function DataManagement() {
  const [exportData, setExportData] = useState<string>("")
  const [importData, setImportData] = useState<string>("")
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  // Exporter toutes les données
  const handleExportData = () => {
    try {
      setIsExporting(true)

      // Récupérer toutes les données
      const responses = getLocalStorage("responses") || []
      const activeConnections = getLocalStorage("activeConnections") || []

      // Créer l'objet d'exportation
      const exportObj = {
        responses,
        activeConnections,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      // Convertir en JSON
      const exportString = JSON.stringify(exportObj, null, 2)
      setExportData(exportString)

      toast({
        title: "Données exportées avec succès",
        description: `${responses.length} réponses exportées.`,
      })
    } catch (error) {
      console.error("Erreur lors de l'exportation des données:", error)
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur s'est produite lors de l'exportation des données.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Télécharger les données exportées
  const handleDownloadExport = () => {
    if (!exportData) {
      toast({
        title: "Aucune donnée à télécharger",
        description: "Veuillez d'abord exporter les données.",
        variant: "destructive",
      })
      return
    }

    const blob = new Blob([exportData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `satisfaction-data-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Téléchargement démarré",
      description: "Les données sont en cours de téléchargement.",
    })
  }

  // Importer des données
  const handleImportData = () => {
    try {
      if (!importData) {
        toast({
          title: "Aucune donnée à importer",
          description: "Veuillez coller les données d'importation dans la zone de texte.",
          variant: "destructive",
        })
        return
      }

      setIsImporting(true)

      // Analyser les données importées
      const importObj = JSON.parse(importData)

      // Vérifier la structure des données
      if (!importObj.responses || !Array.isArray(importObj.responses)) {
        throw new Error("Format de données invalide")
      }

      // Enregistrer les données importées
      setLocalStorage("responses", importObj.responses)

      if (importObj.activeConnections && Array.isArray(importObj.activeConnections)) {
        setLocalStorage("activeConnections", importObj.activeConnections)
      }

      toast({
        title: "Données importées avec succès",
        description: `${importObj.responses.length} réponses importées.`,
      })

      // Réinitialiser le champ d'importation
      setImportData("")
    } catch (error) {
      console.error("Erreur lors de l'importation des données:", error)
      toast({
        title: "Erreur d'importation",
        description: "Le format des données importées est invalide.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  // Effacer toutes les données
  const handleClearAllData = () => {
    try {
      clearLocalStorage()

      toast({
        title: "Données effacées",
        description: "Toutes les données ont été effacées avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de l'effacement des données:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'effacement des données.",
        variant: "destructive",
      })
    }
  }

  // Générer des données de démonstration
  const handleGenerateDemoData = () => {
    try {
      // Créer des données de démonstration
      const demoResponses = [
        {
          id: "demo1",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          satisfactionFormation: "Oui",
          difficulte: "Facile",
          pedagogie: "Très bien",
          commentaires: "Formation très intéressante et bien structurée.",
          session: "Section A",
        },
        {
          id: "demo2",
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          satisfactionFormation: "Oui",
          difficulte: "Facile",
          pedagogie: "Bien",
          commentaires: "Bonne formation, mais un peu rapide par moments.",
          session: "Section A",
        },
        {
          id: "demo3",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          satisfactionFormation: "Non",
          difficulte: "Difficile",
          pedagogie: "Moyen",
          commentaires: "Trop complexe pour une introduction.",
          session: "Section A",
        },
        {
          id: "demo4",
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          satisfactionFormation: "Oui",
          difficulte: "Très facile",
          pedagogie: "Très bien",
          commentaires: "Excellente formation, très claire.",
          session: "Section B",
        },
        {
          id: "demo5",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          satisfactionFormation: "Oui",
          difficulte: "Facile",
          pedagogie: "Bien",
          commentaires: "Bonne formation, formateur compétent.",
          session: "Section B",
        },
        {
          id: "demo6",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          satisfactionFormation: "Non",
          difficulte: "Difficile",
          pedagogie: "Mauvais",
          commentaires: "Pas assez d'exemples pratiques.",
          session: "Section B",
        },
        {
          id: "demo7",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          satisfactionFormation: "Oui",
          difficulte: "Facile",
          pedagogie: "Très bien",
          commentaires: "Très bonne formation, merci !",
          session: "Section C",
        },
        {
          id: "demo8",
          timestamp: new Date().toISOString(),
          satisfactionFormation: "Oui",
          difficulte: "Facile",
          pedagogie: "Bien",
          commentaires: "Formation intéressante et utile.",
          session: "Section C",
        },
      ]

      // Enregistrer les données de démonstration
      setLocalStorage("responses", demoResponses)

      toast({
        title: "Données de démonstration générées",
        description: "8 réponses de démonstration ont été créées.",
      })
    } catch (error) {
      console.error("Erreur lors de la génération des données de démonstration:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération des données de démonstration.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="export" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="export">Exporter</TabsTrigger>
          <TabsTrigger value="import">Importer</TabsTrigger>
          <TabsTrigger value="clear">Effacer</TabsTrigger>
        </TabsList>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Exporter les données</CardTitle>
              <CardDescription>Exportez toutes les données pour les sauvegarder ou les transférer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={handleExportData} className="w-full sm:w-auto gap-2" disabled={isExporting}>
                  {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Exporter les données
                </Button>

                {exportData && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Données exportées</h3>
                      <Button variant="outline" size="sm" onClick={handleDownloadExport} className="gap-2">
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                    <textarea
                      className="w-full h-64 p-2 border rounded-md font-mono text-sm"
                      value={exportData}
                      readOnly
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Importer des données</CardTitle>
              <CardDescription>Importez des données précédemment exportées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  className="w-full h-64 p-2 border rounded-md font-mono text-sm"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Collez ici les données JSON exportées..."
                />

                <Button
                  onClick={handleImportData}
                  className="w-full sm:w-auto gap-2"
                  disabled={isImporting || !importData}
                >
                  {isImporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Importer les données
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clear">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des données</CardTitle>
              <CardDescription>Effacez ou réinitialisez les données de l'application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Effacer toutes les données</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Cette action supprimera définitivement toutes les données de l'application. Assurez-vous d'avoir
                    exporté vos données avant de continuer.
                  </p>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Effacer toutes les données
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Toutes les données seront définitivement supprimées.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAllData}>Oui, effacer tout</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-2">Générer des données de démonstration</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Créez des données de démonstration pour tester l'application. Cette action remplacera toutes les
                    données existantes.
                  </p>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Générer des données de démonstration
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remplacer les données existantes ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action remplacera toutes les données existantes par des données de démonstration.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleGenerateDemoData}>Oui, générer des données</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

