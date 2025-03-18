"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart } from "@/components/dashboard/charts"
import type { Response } from "@/types/dashboard"
import type { DateRange } from "react-day-picker"
import { DateRangeFilter } from "@/components/dashboard/date-range-filter"
import { filterResponsesByDateRange, prepareComparisonData } from "@/lib/dashboard-utils"

interface PeriodComparisonProps {
  responses: Response[]
}

export function PeriodComparisonChart({ responses }: PeriodComparisonProps) {
  const [currentPeriod, setCurrentPeriod] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(),
  })

  const [previousPeriod, setPreviousPeriod] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0),
  })

  const [comparisonMetric, setComparisonMetric] = useState<string>("satisfaction")

  const currentPeriodResponses = filterResponsesByDateRange(responses, currentPeriod)
  const previousPeriodResponses = filterResponsesByDateRange(responses, previousPeriod)

  const comparisonData = prepareComparisonData(currentPeriodResponses, previousPeriodResponses, comparisonMetric)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison entre périodes</CardTitle>
        <CardDescription>Comparez les résultats entre deux périodes différentes</CardDescription>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-medium mb-2">Période actuelle</p>
            <DateRangeFilter onDateRangeChange={setCurrentPeriod} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Période précédente</p>
            <DateRangeFilter onDateRangeChange={setPreviousPeriod} />
          </div>
        </div>

        <Tabs value={comparisonMetric} onValueChange={setComparisonMetric} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
            <TabsTrigger value="difficulte">Difficulté</TabsTrigger>
            <TabsTrigger value="pedagogie">Pédagogie</TabsTrigger>
            <TabsTrigger value="attentes">Attentes</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <BarChart data={comparisonData} isComparison={true} />
        </div>
      </CardContent>
    </Card>
  )
}

