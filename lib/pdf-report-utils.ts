import jsPDF from "jspdf"
import type { Response } from "@/types/dashboard"
import { Chart, registerables } from "chart.js"
import { prepareChartData } from "./dashboard-utils"

// Enregistrer les composants Chart.js nécessaires
Chart.register(...registerables)

interface ReportOptions {
  includeSummary: boolean
  includeCharts: boolean
  includeResponses: boolean
  includeComments: boolean
  includeSectionComparison: boolean
}

export async function generatePDFReport(responses: Response[], options: ReportOptions): Promise<void> {
  // Créer un nouveau document PDF
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Définir les dimensions de la page
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - 2 * margin

  // Ajouter l'en-tête
  addHeader(pdf, pageWidth, margin)

  let yPosition = 40 // Position Y après l'en-tête

  // Ajouter le titre du rapport
  pdf.setFontSize(18)
  pdf.setTextColor(26, 58, 114) // Bleu GPIS
  pdf.text("Rapport de satisfaction de formation", pageWidth / 2, yPosition, { align: "center" })
  yPosition += 10

  // Ajouter la date du rapport
  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  const today = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  pdf.text(`Généré le ${today}`, pageWidth / 2, yPosition, { align: "center" })
  yPosition += 15

  // Ajouter un résumé statistique si demandé
  if (options.includeSummary) {
    yPosition = addSummarySection(pdf, responses, yPosition, margin, contentWidth)
    yPosition += 10

    // Vérifier si on doit passer à une nouvelle page
    if (yPosition > pageHeight - 30) {
      pdf.addPage()
      yPosition = 20
    }
  }

  // Ajouter les graphiques si demandé
  if (options.includeCharts) {
    yPosition = await addChartsSection(pdf, responses, yPosition, margin, contentWidth, pageWidth, pageHeight)
    yPosition += 10

    // Vérifier si on doit passer à une nouvelle page
    if (yPosition > pageHeight - 30) {
      pdf.addPage()
      yPosition = 20
    }
  }

  // Ajouter la comparaison par section si demandée
  if (options.includeSectionComparison) {
    yPosition = await addSectionComparisonSection(
      pdf,
      responses,
      yPosition,
      margin,
      contentWidth,
      pageWidth,
      pageHeight,
    )
    yPosition += 10

    // Vérifier si on doit passer à une nouvelle page
    if (yPosition > pageHeight - 30) {
      pdf.addPage()
      yPosition = 20
    }
  }

  // Ajouter la liste des réponses si demandée
  if (options.includeResponses) {
    yPosition = addResponsesSection(
      pdf,
      responses,
      yPosition,
      margin,
      contentWidth,
      pageWidth,
      pageHeight,
      options.includeComments,
    )
  }

  // Ajouter le pied de page sur toutes les pages
  const totalPages = pdf.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    addFooter(pdf, pageWidth, pageHeight, i, totalPages)
  }

  // Télécharger le PDF
  pdf.save("rapport-satisfaction-formation.pdf")
}

// Fonction pour ajouter l'en-tête
function addHeader(pdf: jsPDF, pageWidth: number, margin: number): void {
  pdf.setFillColor(26, 58, 114) // Bleu GPIS
  pdf.rect(0, 0, pageWidth, 20, "F")

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.text("GPIS GIE - Formulaire de Satisfaction", margin, 13)

  // Ajouter la date à droite
  const date = new Date().toLocaleDateString("fr-FR")
  pdf.text(date, pageWidth - margin, 13, { align: "right" })
}

// Fonction pour ajouter le pied de page
function addFooter(pdf: jsPDF, pageWidth: number, pageHeight: number, currentPage: number, totalPages: number): void {
  pdf.setFillColor(240, 240, 240)
  pdf.rect(0, pageHeight - 10, pageWidth, 10, "F")

  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(8)
  pdf.text(`© ${new Date().getFullYear()} GPIS GIE - Tous droits réservés`, 15, pageHeight - 4)
  pdf.text(`Page ${currentPage} sur ${totalPages}`, pageWidth - 15, pageHeight - 4, { align: "right" })
}

// Fonction pour ajouter la section de résumé
function addSummarySection(
  pdf: jsPDF,
  responses: Response[],
  yPosition: number,
  margin: number,
  contentWidth: number,
): number {
  // Titre de la section
  pdf.setFontSize(14)
  pdf.setTextColor(26, 58, 114)
  pdf.text("Résumé statistique", margin, yPosition)
  yPosition += 8

  // Ligne de séparation
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, yPosition, margin + contentWidth, yPosition)
  yPosition += 8

  // Calculer les statistiques
  const totalResponses = responses.length

  // Satisfaction globale
  const satisfiedCount = responses.filter((r) => r.satisfactionFormation === "Oui").length
  const satisfactionRate = Math.round((satisfiedCount / totalResponses) * 100)

  // Difficulté moyenne
  const difficultyMap: Record<string, number> = {
    "Très difficile": 4,
    Difficile: 3,
    Facile: 2,
    "Très facile": 1,
  }
  const difficultySum = responses.reduce((acc, r) => {
    return acc + (difficultyMap[r.difficulte as keyof typeof difficultyMap] || 0)
  }, 0)
  const averageDifficulty = Number((difficultySum / totalResponses).toFixed(1))

  // Commentaires
  const commentCount = responses.filter(
    (r) =>
      (r.commentaireLieu && r.commentaireLieu.trim() !== "") ||
      (r.commentaireLibre && r.commentaireLibre.trim() !== "") ||
      (r.misesEnSituation && r.misesEnSituation.trim() !== ""),
  ).length
  const commentPercentage = Math.round((commentCount / totalResponses) * 100)

  // Sections
  const sectionCounts: Record<string, number> = {}
  responses.forEach((r) => {
    if (r.session) {
      sectionCounts[r.session] = (sectionCounts[r.session] || 0) + 1
    }
  })
  const topSection = Object.entries(sectionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

  // Afficher les statistiques
  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)

  // Créer une grille de statistiques 2x2
  const statItems = [
    { label: "Nombre total de réponses", value: totalResponses.toString() },
    { label: "Taux de satisfaction", value: `${satisfactionRate}%` },
    { label: "Difficulté moyenne", value: `${averageDifficulty}/4` },
    { label: "Commentaires", value: `${commentCount} (${commentPercentage}%)` },
    { label: "Section la plus représentée", value: topSection },
    {
      label: "Date de la dernière réponse",
      value:
        responses.length > 0 ? new Date(responses[responses.length - 1].createdAt).toLocaleDateString("fr-FR") : "N/A",
    },
  ]

  const colWidth = contentWidth / 2
  const currentY = yPosition

  statItems.forEach((item, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    const x = margin + col * colWidth
    const y = currentY + row * 15

    pdf.setFontSize(9)
    pdf.setTextColor(100, 100, 100)
    pdf.text(item.label, x, y)

    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text(item.value, x, y + 6)
  })

  return currentY + Math.ceil(statItems.length / 2) * 15 + 5
}

// Fonction pour ajouter la section des graphiques
async function addChartsSection(
  pdf: jsPDF,
  responses: Response[],
  yPosition: number,
  margin: number,
  contentWidth: number,
  pageWidth: number,
  pageHeight: number,
): Promise<number> {
  // Titre de la section
  pdf.setFontSize(14)
  pdf.setTextColor(26, 58, 114)
  pdf.text("Graphiques", margin, yPosition)
  yPosition += 8

  // Ligne de séparation
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, yPosition, margin + contentWidth, yPosition)
  yPosition += 8

  // Créer et ajouter les graphiques
  const chartTypes = [
    { field: "satisfactionFormation", title: "Satisfaction globale" },
    { field: "difficulte", title: "Niveau de difficulté" },
    { field: "pedagogie", title: "Évaluation de la pédagogie" },
  ]

  for (const chartType of chartTypes) {
    // Vérifier si on doit passer à une nouvelle page
    if (yPosition + 70 > pageHeight - 20) {
      pdf.addPage()
      yPosition = 20
    }

    // Sous-titre du graphique
    pdf.setFontSize(12)
    pdf.setTextColor(26, 58, 114)
    pdf.text(chartType.title, margin, yPosition)
    yPosition += 6

    // Générer le graphique
    const chartData = prepareChartData(responses, chartType.field as keyof Response)
    const chartCanvas = await createChartCanvas(chartData, chartType.title)

    // Convertir le canvas en image
    const chartImage = chartCanvas.toDataURL("image/png")

    // Ajouter l'image au PDF
    const imgWidth = contentWidth
    const imgHeight = 60
    pdf.addImage(chartImage, "PNG", margin, yPosition, imgWidth, imgHeight)

    yPosition += imgHeight + 15
  }

  return yPosition
}

// Fonction pour ajouter la section de comparaison par section
async function addSectionComparisonSection(
  pdf: jsPDF,
  responses: Response[],
  yPosition: number,
  margin: number,
  contentWidth: number,
  pageWidth: number,
  pageHeight: number,
): Promise<number> {
  // Titre de la section
  pdf.setFontSize(14)
  pdf.setTextColor(26, 58, 114)
  pdf.text("Comparaison par section", margin, yPosition)
  yPosition += 8

  // Ligne de séparation
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, yPosition, margin + contentWidth, yPosition)
  yPosition += 8

  // Obtenir toutes les sections
  const sections = Array.from(new Set(responses.map((r) => r.session))).filter(Boolean)

  if (sections.length <= 1) {
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text("Pas assez de sections pour effectuer une comparaison.", margin, yPosition)
    return yPosition + 10
  }

  // Créer un graphique de comparaison pour la satisfaction
  const comparisonCanvas = await createSectionComparisonCanvas(
    responses,
    sections,
    "satisfactionFormation",
    "Satisfaction par section",
  )

  // Convertir le canvas en image
  const comparisonImage = comparisonCanvas.toDataURL("image/png")

  // Ajouter l'image au PDF
  const imgWidth = contentWidth
  const imgHeight = 70
  pdf.addImage(comparisonImage, "PNG", margin, yPosition, imgWidth, imgHeight)

  yPosition += imgHeight + 15

  // Vérifier si on doit passer à une nouvelle page
  if (yPosition + 70 > pageHeight - 20) {
    pdf.addPage()
    yPosition = 20
  }

  // Créer un graphique de comparaison pour la difficulté
  const difficultyCanvas = await createSectionComparisonCanvas(
    responses,
    sections,
    "difficulte",
    "Difficulté par section",
  )

  // Convertir le canvas en image
  const difficultyImage = difficultyCanvas.toDataURL("image/png")

  // Ajouter l'image au PDF
  pdf.addImage(difficultyImage, "PNG", margin, yPosition, imgWidth, imgHeight)

  return yPosition + imgHeight + 10
}

// Fonction pour ajouter la section des réponses
function addResponsesSection(
  pdf: jsPDF,
  responses: Response[],
  yPosition: number,
  margin: number,
  contentWidth: number,
  pageWidth: number,
  pageHeight: number,
  includeComments: boolean,
): number {
  // Titre de la section
  pdf.setFontSize(14)
  pdf.setTextColor(26, 58, 114)
  pdf.text("Liste des réponses", margin, yPosition)
  yPosition += 8

  // Ligne de séparation
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, yPosition, margin + contentWidth, yPosition)
  yPosition += 8

  // Trier les réponses par date
  const sortedResponses = [...responses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // Limiter à 20 réponses pour éviter un PDF trop long
  const limitedResponses = sortedResponses.slice(0, 20)

  if (limitedResponses.length === 0) {
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text("Aucune réponse enregistrée.", margin, yPosition)
    return yPosition + 10
  }

  // En-têtes de tableau
  pdf.setFontSize(9)
  pdf.setTextColor(100, 100, 100)
  pdf.text("Date", margin, yPosition)
  pdf.text("Section", margin + 30, yPosition)
  pdf.text("Satisfaction", margin + 60, yPosition)
  pdf.text("Difficulté", margin + 90, yPosition)
  pdf.text("Pédagogie", margin + 120, yPosition)
  yPosition += 5

  // Ligne sous les en-têtes
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, yPosition, margin + contentWidth, yPosition)
  yPosition += 5

  // Données du tableau
  pdf.setFontSize(8)
  pdf.setTextColor(0, 0, 0)

  for (const response of limitedResponses) {
    // Vérifier si on doit passer à une nouvelle page
    if (yPosition + (includeComments ? 25 : 10) > pageHeight - 20) {
      pdf.addPage()
      yPosition = 20

      // Répéter les en-têtes
      pdf.setFontSize(9)
      pdf.setTextColor(100, 100, 100)
      pdf.text("Date", margin, yPosition)
      pdf.text("Section", margin + 30, yPosition)
      pdf.text("Satisfaction", margin + 60, yPosition)
      pdf.text("Difficulté", margin + 90, yPosition)
      pdf.text("Pédagogie", margin + 120, yPosition)
      yPosition += 5

      // Ligne sous les en-têtes
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, yPosition, margin + contentWidth, yPosition)
      yPosition += 5

      pdf.setFontSize(8)
      pdf.setTextColor(0, 0, 0)
    }

    const date = new Date(response.createdAt).toLocaleDateString("fr-FR")
    pdf.text(date, margin, yPosition)
    pdf.text(response.session || "N/A", margin + 30, yPosition)
    pdf.text(response.satisfactionFormation, margin + 60, yPosition)
    pdf.text(response.difficulte, margin + 90, yPosition)
    pdf.text(response.pedagogie, margin + 120, yPosition)

    // Ajouter les commentaires si demandé
    if (includeComments && (response.commentaireLibre || response.commentaireLieu)) {
      yPosition += 4

      if (response.commentaireLibre) {
        pdf.setFontSize(7)
        pdf.setTextColor(80, 80, 80)

        // Limiter la longueur du commentaire
        const comment =
          response.commentaireLibre.length > 100
            ? response.commentaireLibre.substring(0, 100) + "..."
            : response.commentaireLibre

        pdf.text(`Commentaire: ${comment}`, margin + 5, yPosition, {
          maxWidth: contentWidth - 10,
        })
        yPosition += 4
      }
    }

    // Ligne de séparation entre les réponses
    pdf.setDrawColor(240, 240, 240)
    pdf.line(margin, yPosition + 2, margin + contentWidth, yPosition + 2)
    yPosition += 6
  }

  // Ajouter une note si on a limité le nombre de réponses
  if (sortedResponses.length > limitedResponses.length) {
    pdf.setFontSize(8)
    pdf.setTextColor(100, 100, 100)
    pdf.text(
      `Note: Affichage limité aux ${limitedResponses.length} réponses les plus récentes sur un total de ${sortedResponses.length}.`,
      margin,
      yPosition + 5,
    )
    yPosition += 10
  }

  return yPosition
}

// Fonction pour créer un canvas avec un graphique
async function createChartCanvas(data: any[], title: string): Promise<HTMLCanvasElement> {
  // Créer un canvas
  const canvas = document.createElement("canvas")
  canvas.width = 600
  canvas.height = 300

  // Créer le graphique
  new Chart(canvas, {
    type: "pie",
    data: {
      labels: data.map((item) => item.name),
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: [
            "#1A3A72", // Bleu foncé GPIS
            "#A7C1E8", // Bleu clair GPIS
            "#8A8A8A", // Gris GPIS
            "#4CAF50", // Vert
            "#F44336", // Rouge
            "#FF9800", // Orange
          ],
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
          },
        },
        legend: {
          position: "right",
          labels: {
            font: {
              size: 12,
            },
          },
        },
      },
    },
  })

  return canvas
}

// Fonction pour créer un canvas avec un graphique de comparaison par section
async function createSectionComparisonCanvas(
  responses: Response[],
  sections: string[],
  field: keyof Response,
  title: string,
): Promise<HTMLCanvasElement> {
  // Créer un canvas
  const canvas = document.createElement("canvas")
  canvas.width = 600
  canvas.height = 350

  // Préparer les données
  const fieldValues = Array.from(new Set(responses.map((r) => r[field] as string))).filter(Boolean)

  const datasets = sections.map((section, index) => {
    const sectionResponses = responses.filter((r) => r.session === section)

    return {
      label: section,
      data: fieldValues.map((value) => {
        return sectionResponses.filter((r) => r[field] === value).length
      }),
      backgroundColor: [
        "#1A3A72", // Bleu foncé GPIS
        "#A7C1E8", // Bleu clair GPIS
        "#8A8A8A", // Gris GPIS
        "#4CAF50", // Vert
      ][index % 4],
    }
  })

  // Créer le graphique
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: fieldValues,
      datasets,
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
          },
        },
        legend: {
          position: "top",
          labels: {
            font: {
              size: 12,
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Nombre de réponses",
          },
        },
      },
    },
  })

  return canvas
}

