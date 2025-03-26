"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { exportToPDF } from "@/lib/export-utils"
import type { Response } from "@/types/dashboard"
import { exportToCSV } from "@/lib/export-utils"
import { PDFReportGenerator } from "@/components/dashboard/pdf-report-generator"

interface ExportButtonsProps {
  responses: Response[]
  dashboardRef: React.RefObject<HTMLDivElement>
}

export function ExportButtons({ responses, dashboardRef }: ExportButtonsProps) {
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

  return (
    <div className="flex gap-2">
      <Button variant="outline" className="gap-2" onClick={handleExportCSV} disabled={isExporting !== null}>
        {isExporting === "csv" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Exporter CSV
      </Button>

      <PDFReportGenerator responses={responses} />
    </div>
  )
}

