"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Response } from "@/types/dashboard"
import { PieChart, BarChart } from "@/components/dashboard/charts"

export function SatisfactionCharts({ responses }: { responses: Response[] }) {
  const [chartView, setChartView] = useState("lieu")

  // Préparation des données pour les graphiques
  const lieuData = prepareChartData(responses, "lieuGlobal")
  const scenariosData = prepareChartData(responses, "scenarios")
  const difficulteData = prepareChartData(responses, "difficulte")
  const pedagogieData = prepareChartData(responses, "pedagogie")

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Répartition des avis</CardTitle>
          <CardDescription>Visualisation des réponses par catégorie</CardDescription>
          <Tabs value={chartView} onValueChange={setChartView} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="lieu">Lieu</TabsTrigger>
              <TabsTrigger value="scenarios">Scénarios</TabsTrigger>
              <TabsTrigger value="difficulte">Difficulté</TabsTrigger>
              <TabsTrigger value="pedagogie">Pédagogie</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            {chartView === "lieu" && <BarChart data={lieuData} />}
            {chartView === "scenarios" && <BarChart data={scenariosData} />}
            {chartView === "difficulte" && <BarChart data={difficulteData} />}
            {chartView === "pedagogie" && <BarChart data={pedagogieData} />}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Satisfaction globale</CardTitle>
          <CardDescription>Répartition des niveaux de satisfaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <PieChart data={lieuData} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attentes satisfaites</CardTitle>
          <CardDescription>La formation a-t-elle répondu aux attentes ?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <PieChart data={prepareChartData(responses, "attentes")} colors={["#4CAF50", "#F44336"]} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function prepareChartData(responses: Response[], field: keyof Response) {
  const counts: Record<string, number> = {}

  responses.forEach((response) => {
    const value = response[field] as string
    if (value) {
      counts[value] = (counts[value] || 0) + 1
    }
  })

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }))
}

