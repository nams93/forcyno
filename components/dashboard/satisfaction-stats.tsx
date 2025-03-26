"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getLocalStorage } from "@/lib/local-storage"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function SatisfactionStats() {
  const [stats, setStats] = useState({
    totalResponses: 0,
    satisfactionData: [] as any[],
    difficulteData: [] as any[],
    pedagogieData: [] as any[],
    commentairesRecents: [] as any[],
  })

  useEffect(() => {
    // Récupérer les données des réponses
    const responses = getLocalStorage("responses") || []

    // Calculer les statistiques
    const totalResponses = responses.length

    // Données de satisfaction
    const satisfactionCounts = responses.reduce((acc: any, response: any) => {
      const value = response.satisfactionFormation || "Non spécifié"
      acc[value] = (acc[value] || 0) + 1
      return acc
    }, {})

    const satisfactionData = Object.keys(satisfactionCounts).map((key) => ({
      name: key,
      value: satisfactionCounts[key],
    }))

    // Données de difficulté
    const difficulteCounts = responses.reduce((acc: any, response: any) => {
      const value = response.difficulte || "Non spécifié"
      acc[value] = (acc[value] || 0) + 1
      return acc
    }, {})

    const difficulteData = Object.keys(difficulteCounts).map((key) => ({
      name: key,
      value: difficulteCounts[key],
    }))

    // Données de pédagogie
    const pedagogieCounts = responses.reduce((acc: any, response: any) => {
      const value = response.pedagogie || "Non spécifié"
      acc[value] = (acc[value] || 0) + 1
      return acc
    }, {})

    const pedagogieData = Object.keys(pedagogieCounts).map((key) => ({
      name: key,
      value: pedagogieCounts[key],
    }))

    // Commentaires récents
    const commentairesRecents = responses
      .filter((response: any) => response.commentaires && response.commentaires.trim() !== "")
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
      .map((response: any) => ({
        commentaire: response.commentaires,
        date: new Date(response.timestamp).toLocaleDateString("fr-FR"),
        satisfaction: response.satisfactionFormation,
      }))

    setStats({
      totalResponses,
      satisfactionData,
      difficulteData,
      pedagogieData,
      commentairesRecents,
    })
  }, [])

  // Couleurs pour les graphiques
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  // Formater le pourcentage pour le graphique en camembert
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total des réponses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalResponses}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {stats.satisfactionData.find((item) => item.name === "Oui")?.value || 0}
              <span className="text-lg text-gray-500 ml-2">
                (
                {stats.totalResponses
                  ? Math.round(
                      ((stats.satisfactionData.find((item) => item.name === "Oui")?.value || 0) /
                        stats.totalResponses) *
                        100,
                    )
                  : 0}
                %)
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Difficulté moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {stats.difficulteData.find((item) => item.name === "Facile")?.value || 0}
              <span className="text-lg text-gray-500 ml-2">
                (
                {stats.totalResponses
                  ? Math.round(
                      ((stats.difficulteData.find((item) => item.name === "Facile")?.value || 0) /
                        stats.totalResponses) *
                        100,
                    )
                  : 0}
                %)
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pédagogie</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {stats.pedagogieData.find((item) => item.name === "Très bien")?.value || 0}
              <span className="text-lg text-gray-500 ml-2">
                (
                {stats.totalResponses
                  ? Math.round(
                      ((stats.pedagogieData.find((item) => item.name === "Très bien")?.value || 0) /
                        stats.totalResponses) *
                        100,
                    )
                  : 0}
                %)
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="satisfaction" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="difficulte">Difficulté</TabsTrigger>
          <TabsTrigger value="pedagogie">Pédagogie</TabsTrigger>
          <TabsTrigger value="commentaires">Commentaires</TabsTrigger>
        </TabsList>

        <TabsContent value="satisfaction">
          <Card>
            <CardHeader>
              <CardTitle>Répartition de la satisfaction</CardTitle>
              <CardDescription>Pourcentage des participants satisfaits de la formation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.satisfactionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.satisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="difficulte">
          <Card>
            <CardHeader>
              <CardTitle>Niveau de difficulté perçu</CardTitle>
              <CardDescription>Répartition des avis sur la difficulté de la formation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.difficulteData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Nombre de réponses" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pedagogie">
          <Card>
            <CardHeader>
              <CardTitle>Qualité de la pédagogie</CardTitle>
              <CardDescription>Évaluation de la qualité pédagogique de la formation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.pedagogieData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Nombre de réponses" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commentaires">
          <Card>
            <CardHeader>
              <CardTitle>Commentaires récents</CardTitle>
              <CardDescription>Les 5 derniers commentaires laissés par les participants</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.commentairesRecents.length > 0 ? (
                <div className="space-y-4">
                  {stats.commentairesRecents.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-500">{item.date}</span>
                        <span
                          className={`text-sm px-2 py-1 rounded-full ${
                            item.satisfaction === "Oui" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.satisfaction === "Oui" ? "Satisfait" : "Non satisfait"}
                        </span>
                      </div>
                      <p className="text-gray-700">{item.commentaire}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">Aucun commentaire disponible pour le moment</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

