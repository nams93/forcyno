import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import type { Response } from "@/types/dashboard"

export async function exportToPDF(element: HTMLElement, filename: string): Promise<void> {
  // Créer une copie de l'élément pour éviter les problèmes de style
  const clone = element.cloneNode(true) as HTMLElement
  clone.style.width = `${element.offsetWidth}px`
  clone.style.height = `${element.offsetHeight}px`

  // Ajouter temporairement au DOM pour le rendu
  clone.style.position = "absolute"
  clone.style.left = "-9999px"
  document.body.appendChild(clone)

  try {
    // Capturer l'élément en tant qu'image
    const canvas = await html2canvas(clone, {
      scale: 2, // Meilleure qualité
      useCORS: true, // Pour les images externes
      logging: false,
      allowTaint: true,
      backgroundColor: "#ffffff",
    })

    // Créer le PDF
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Ajouter l'image au PDF
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

    // Télécharger le PDF
    pdf.save(`${filename}.pdf`)
  } finally {
    // Nettoyer
    document.body.removeChild(clone)
  }
}

export function exportToCSV(data: Response[], filename: string): void {
  // Définir les en-têtes
  const headers = [
    "ID",
    "Date",
    "Lieu Global",
    "Lieu Adapté",
    "Lieu Réalité",
    "Scénarios",
    "Difficulté",
    "Rythme",
    "Durée",
    "Attentes",
    "Pédagogie",
    "Qualité Réponses",
    "Disponibilité Formateurs",
    "Satisfaction Formation",
  ]

  // Formater les données
  const csvRows = [
    headers.join(","), // En-têtes
    ...data.map((row) => {
      const values = [
        row.id,
        new Date(row.createdAt).toLocaleDateString(),
        `"${row.lieuGlobal}"`,
        `"${row.lieuAdapte}"`,
        `"${row.lieuRealite}"`,
        `"${row.scenarios}"`,
        `"${row.difficulte}"`,
        `"${row.rythme}"`,
        `"${row.duree}"`,
        `"${row.attentes}"`,
        `"${row.pedagogie}"`,
        `"${row.qualiteReponses}"`,
        `"${row.disponibiliteFormateurs}"`,
        `"${row.satisfactionFormation}"`,
      ]
      return values.join(",")
    }),
  ]

  // Créer le contenu CSV
  const csvContent = csvRows.join("\n")

  // Créer un blob et un lien de téléchargement
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

