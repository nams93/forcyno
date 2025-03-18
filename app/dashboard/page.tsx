"use client"

import { useRef, useState, useEffect } from "react"
import { getDashboardData } from "@/actions/dashboard-actions"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { SatisfactionCharts } from "@/components/dashboard/satisfaction-charts"
import { ResponsesTable } from "@/components/dashboard/responses-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangeFilter } from "@/components/dashboard/date-range-filter"
import { CategoryFilters } from "@/components/dashboard/category-filters"
import { ExportButtons } from "@/components/dashboard/export-buttons"
import { PeriodComparisonChart } from "@/components/dashboard/period-comparison"
import { SavedViews } from "@/components/dashboard/saved-views"
import type { DateRange } from "react-day-picker"
import type { Response } from "@/types/dashboard"
import { filterResponsesByDateRange, filterResponsesByCategory } from "@/lib/dashboard-utils"

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
    <div className="container mx-auto px-4 py-8" ref={dashboardRef}>
      <DashboardHeader />

      <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-2">
          <DateRangeFilter onDateRangeChange={setDateRange} />
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            <CategoryFilters
              title="Satisfaction"
              options={satisfactionOptions}
              onFilterChange={setSatisfactionFilters}
            />
            <CategoryFilters title="Difficulté" options={difficulteOptions} onFilterChange={setDifficulteFilters} />
            <CategoryFilters title="Pédagogie" options={pedagogieOptions} onFilterChange={setPedagogieFilters} />
          </div>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          <SavedViews onViewSelect={handleViewSelect} />
          <ExportButtons responses={filteredResponses} dashboardRef={dashboardRef} />
        </div>
      </div>

      <div className="mt-8">
        <DashboardStats
          stats={{
            ...data.stats,
            totalResponses: filteredResponses.length,
          }}
        />
      </div>

      <div className="mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="charts">Graphiques</TabsTrigger>
            <TabsTrigger value="comparison">Comparaison</TabsTrigger>
            <TabsTrigger value="responses">Réponses</TabsTrigger>
          </TabsList>
          <TabsContent value="charts" className="mt-6">
            <SatisfactionCharts responses={filteredResponses} />
          </TabsContent>
          <TabsContent value="comparison" className="mt-6">
            <PeriodComparisonChart responses={data.responses} />
          </TabsContent>
          <TabsContent value="responses" className="mt-6">
            <ResponsesTable responses={filteredResponses} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

