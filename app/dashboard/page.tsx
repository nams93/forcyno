"use client"

import { useRef, useState, useEffect } from "react"
import { getDashboardData } from "@/actions/dashboard-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DateRange } from "react-day-picker"
import type { Response } from "@/types/dashboard"
import { filterResponsesByDateRange, filterResponsesByCategory } from "@/lib/dashboard-utils"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { DataManagement } from "@/components/dashboard/data-management"
import { SatisfactionStats } from "@/components/dashboard/satisfaction-stats"
import { SectionComparison } from "@/components/dashboard/section-comparison"
import { ActiveConnections } from "@/components/dashboard/active-connections"

export type DashboardStatsType = {
  totalResponses: number
  averageSatisfaction: number
  averageDifficulty: number
  averagePedagogy: number
}

export default function DashboardPage() {
  const dashboardRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<{ stats: DashboardStatsType; responses: Response[] } | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [satisfactionFilters, setSatisfactionFilters] = useState<string[]>([])
  const [difficulteFilters, setDifficulteFilters] = useState<string[]>([])
  const [pedagogieFilters, setPedagogieFilters] = useState<string[]>([])
  // Ajouter l'état pour le filtre par section
  const [sectionFilters, setSectionFilters] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("charts")

  // Charger les données du tableau de bord
  useEffect(() => {
    const fetchData = async () => {
      const dashboardData = await getDashboardData()
      setData(dashboardData)
    }

    fetchData()
  }, [])

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-lg text-blue-800">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  // Appliquer les filtres
  let filteredResponses = data.responses

  // Filtre par date
  filteredResponses = filterResponsesByDateRange(filteredResponses, dateRange)

  // Filtres par catégorie
  if (satisfactionFilters.length > 0) {
    filteredResponses = filterResponsesByCategory(filteredResponses, "satisfactionFormation", satisfactionFilters)
  }

  if (difficulteFilters.length > 0) {
    filteredResponses = filterResponsesByCategory(filteredResponses, "difficulte", difficulteFilters)
  }

  if (pedagogieFilters.length > 0) {
    filteredResponses = filterResponsesByCategory(filteredResponses, "pedagogie", pedagogieFilters)
  }

  // Ajouter le filtre par section dans l'application des filtres
  // Après les autres filtres par catégorie
  if (sectionFilters.length > 0) {
    filteredResponses = filterResponsesByCategory(filteredResponses, "session", sectionFilters)
  }

  // Options pour les filtres de catégorie
  const satisfactionOptions = [
    { value: "Oui", label: "Satisfait" },
    { value: "Non", label: "Non satisfait" },
  ]

  const difficulteOptions = [
    { value: "Très difficile", label: "Très difficile" },
    { value: "Difficile", label: "Difficile" },
    { value: "Facile", label: "Facile" },
    { value: "Très facile", label: "Très facile" },
  ]

  const pedagogieOptions = [
    { value: "Très bien", label: "Très bien" },
    { value: "Bien", label: "Bien" },
    { value: "Moyen", label: "Moyen" },
    { value: "Mauvais", label: "Mauvais" },
  ]

  // Gérer la sélection d'une vue sauvegardée
  const handleViewSelect = (view: any) => {
    if (view.dateRange) {
      setDateRange(view.dateRange)
    }

    if (view.filters) {
      setSatisfactionFilters(view.filters.satisfaction || [])
      setDifficulteFilters(view.filters.difficulte || [])
      setPedagogieFilters(view.filters.pedagogie || [])
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <QRCodeGenerator />
        <ActiveConnections />
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
          <TabsTrigger value="data">Gestion des données</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <SatisfactionStats />
        </TabsContent>
        <TabsContent value="comparison">
          <SectionComparison />
        </TabsContent>
        <TabsContent value="data">
          <DataManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

