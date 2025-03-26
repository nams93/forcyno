"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"
import type { Response } from "@/types/dashboard"
import { generatePDFReport } from "@/lib/pdf-report-utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface PDFReportGeneratorProps {
  responses: Response[]
}

export function PDFReportGenerator({ responses }: PDFReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [options, setOptions] = useState({
    includeSummary: true,
    includeCharts: true,
    includeResponses: true,
    includeComments: true,
    includeSectionComparison: true,
  })

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }))
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      await generatePDFReport(responses, options)
    } catch (error) {
      console.error("Erreur lors de la génération du rapport PDF:", error)
    } finally {
      setIsGenerating(false)
      setIsDialogOpen(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Rapport PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Générer un rapport PDF</DialogTitle>
          <DialogDescription>Sélectionnez les éléments à inclure dans votre rapport PDF.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-summary"
              checked={options.includeSummary}
              onCheckedChange={() => handleOptionChange("includeSummary")}
            />
            <Label htmlFor="include-summary">Résumé statistique</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-charts"
              checked={options.includeCharts}
              onCheckedChange={() => handleOptionChange("includeCharts")}
            />
            <Label htmlFor="include-charts">Graphiques</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-section-comparison"
              checked={options.includeSectionComparison}
              onCheckedChange={() => handleOptionChange("includeSectionComparison")}
            />
            <Label htmlFor="include-section-comparison">Comparaison par section</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-responses"
              checked={options.includeResponses}
              onCheckedChange={() => handleOptionChange("includeResponses")}
            />
            <Label htmlFor="include-responses">Liste des réponses</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-comments"
              checked={options.includeComments}
              onCheckedChange={() => handleOptionChange("includeComments")}
            />
            <Label htmlFor="include-comments">Commentaires</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              "Générer le rapport"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

