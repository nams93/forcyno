"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export function SectionComparison() {
  const [sections, setSections] = useState<string[]>([])
  const [selectedSection1, setSelectedSection1] = useState<string>("")
  const [selectedSection2, setSelectedSection2] = useState<string>("")
  const [comparisonData, setComparisonData] = useState<any>({
    satisfaction: [],
    difficulte: [],
    pedagogie: [],
    radar: [],
  })

  // Charger les sections disponibles
  useEffect(() => {
    const responses = getLocalStorage("responses") || []

    // Extraire les sections uniques
    const uniqueSections = Array.from(
      new Set(responses.filter((r: any) => r.session && r.session.trim() !== "").map((r: any) => r.session)),
    ) as string[]

    setSections(uniqueSections)

    // Sélectionner les deux premières sections par défaut
    if (uniqueSections.length >= 2) {
      setSelectedSection1(uniqueSections[0])
      setSelectedSection2(uniqueSections[1])
    } else if (uniqueSections.length === 1) {
      setSelectedSection1(uniqueSections[0])
    }
  }, [])

  // Mettre à jour les données de comparaison lorsque les sections sélectionnées changent
  useEffect(() => {
    if (!selectedSection1 && !selectedSection2) return

    const responses = getLocalStorage("responses") || []

    // Filtrer les réponses par section
    const section1Responses = responses.filter((r: any) => r.session === selectedSection1)
    const section2Responses = responses.filter((r: any) => r.session === selectedSection2)

    // Calculer les pourcentages de satisfaction
    const calculateSatisfactionPercentage = (responses: any[]) => {
      if (responses.length === 0) return 0
      const satisfiedCount = responses.filter((r: any) => r.satisfactionFormation === "Oui").length
      return Math.round((satisfiedCount / responses.length) * 100)
    }

    const section1SatisfactionPercentage = calculateSatisfactionPercentage(section1Responses)
    const section2SatisfactionPercentage = calculateSatisfactionPercentage(section2Responses)

    // Données de satisfaction
    const satisfactionData = [
      {
        name: "Satisfaction",
        [selectedSection1]: section1SatisfactionPercentage,
        [selectedSection2]: selectedSection2 ? section2SatisfactionPercentage : 0,
      },
    ]

    // Calculer la répartition des niveaux de difficulté
    const calculateDifficulteDistribution = (responses: any[]) => {
      const total = responses.length
      if (total === 0) return { "Très difficile": 0, Difficile: 0, Facile: 0, "Très facile": 0 }

      const counts = responses.reduce((acc: any, r: any) => {
        const value = r.difficulte || "Non spécifié"
        acc[value] = (acc[value] || 0) + 1
        return acc
      }, {})

      return {
        "Très difficile": Math.round(((counts["Très difficile"] || 0) / total) * 100),
        Difficile: Math.round(((counts["Difficile"] || 0) / total) * 100),
        Facile: Math.round(((counts["Facile"] || 0) / total) * 100),
        "Très facile": Math.round(((counts["Très facile"] || 0) / total) * 100),
      }
    }

    const section1DifficulteDistribution = calculateDifficulteDistribution(section1Responses)
    const section2DifficulteDistribution = calculateDifficulteDistribution(section2Responses)

    // Données de difficulté
    const difficulteData = [
      {
        name: "Très difficile",
        [selectedSection1]: section1DifficulteDistribution["Très difficile"],
        [selectedSection2]: selectedSection2 ? section2DifficulteDistribution["Très difficile"] : 0,
      },
      {
        name: "Difficile",
        [selectedSection1]: section1DifficulteDistribution["Difficile"],
        [selectedSection2]: selectedSection2 ? section2DifficulteDistribution["Difficile"] : 0,
      },
      {
        name: "Facile",
        [selectedSection1]: section1DifficulteDistribution["Facile"],
        [selectedSection2]: selectedSection2 ? section2DifficulteDistribution["Facile"] : 0,
      },
      {
        name: "Très facile",
        [selectedSection1]: section1DifficulteDistribution["Très facile"],
        [selectedSection2]: selectedSection2 ? section2DifficulteDistribution["Très facile"] : 0,
      },
    ]

    // Calculer la répartition des niveaux de pédagogie
    const calculatePedagogieDistribution = (responses: any[]) => {
      const total = responses.length
      if (total === 0) return { "Très bien": 0, Bien: 0, Moyen: 0, Mauvais: 0 }

      const counts = responses.reduce((acc: any, r: any) => {
        const value = r.pedagogie || "Non spécifié"
        acc[value] = (acc[value] || 0) + 1
        return acc
      }, {})

      return {
        "Très bien": Math.round(((counts["Très bien"] || 0) / total) * 100),
        Bien: Math.round(((counts["Bien"] || 0) / total) * 100),
        Moyen: Math.round(((counts["Moyen"] || 0) / total) * 100),
        Mauvais: Math.round(((counts["Mauvais"] || 0) / total) * 100),
      }
    }

    const section1PedagogieDistribution = calculatePedagogieDistribution(section1Responses)
    const section2PedagogieDistribution = calculatePedagogieDistribution(section2Responses)

    // Données de pédagogie
    const pedagogieData = [
      {
        name: "Très bien",
        [selectedSection1]: section1PedagogieDistribution["Très bien"],
        [selectedSection2]: selectedSection2 ? section2PedagogieDistribution["Très bien"] : 0,
      },
      {
        name: "Bien",
        [selectedSection1]: section1PedagogieDistribution["Bien"],
        [selectedSection2]: selectedSection2 ? section2PedagogieDistribution["Bien"] : 0,
      },
      {
        name: "Moyen",
        [selectedSection1]: section1PedagogieDistribution["Moyen"],
        [selectedSection2]: selectedSection2 ? section2PedagogieDistribution["Moyen"] : 0,
      },
      {
        name: "Mauvais",
        [selectedSection1]: section1PedagogieDistribution["Mauvais"],
        [selectedSection2]: selectedSection2 ? section2PedagogieDistribution["Mauvais"] : 0,
      },
    ]

    // Données pour le graphique radar
    const radarData = [
      {
        subject: "Satisfaction",
        [selectedSection1]: section1SatisfactionPercentage,
        [selectedSection2]: selectedSection2 ? section2SatisfactionPercentage : 0,
        fullMark: 100,
      },
      {
        subject: "Facilité",
        [selectedSection1]: section1DifficulteDistribution["Facile"] + section1DifficulteDistribution["Très facile"],
        [selectedSection2]: selectedSection2
          ? section2DifficulteDistribution["Facile"] + section2DifficulteDistribution["Très facile"]
          : 0,
        fullMark: 100,
      },
      {
        subject: "Pédagogie",
        [selectedSection1]: section1PedagogieDistribution["Très bien"] + section1PedagogieDistribution["Bien"],
        [selectedSection2]: selectedSection2
          ? section2PedagogieDistribution["Très bien"] + section2PedagogieDistribution["Bien"]
          : 0,
        fullMark: 100,
      },
      {
        subject: "Participation",
        [selectedSection1]: section1Responses.length,
        [selectedSection2]: section2Responses.length,
        fullMark: Math.max(section1Responses.length, section2Responses.length) * 1.2,
      },
    ]

    setComparisonData({
      satisfaction: satisfactionData,
      difficulte: difficulteData,
      pedagogie: pedagogieData,
      radar: radarData,
    })
  }, [selectedSection1, selectedSection2])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comparaison des sections</CardTitle>
          <CardDescription>Comparez les résultats entre différentes sections de formation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section 1</label>
              <Select value={selectedSection1} onValueChange={setSelectedSection1}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section 2</label>
              <Select value={selectedSection2} onValueChange={setSelectedSection2}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedSection1 && (
            <div className="space-y-8">
              <div className="h-80">
                <h3 className="text-lg font-medium mb-2">Vue d'ensemble</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={comparisonData.radar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar
                      name={selectedSection1}
                      dataKey={selectedSection1}
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    {selectedSection2 && (
                      <Radar
                        name={selectedSection2}
                        dataKey={selectedSection2}
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                    )}
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80">
                <h3 className="text-lg font-medium mb-2">Satisfaction</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData.satisfaction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={selectedSection1} name={selectedSection1} fill="#8884d8" />
                    {selectedSection2 && <Bar dataKey={selectedSection2} name={selectedSection2} fill="#82ca9d" />}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80">
                <h3 className="text-lg font-medium mb-2">Difficulté</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData.difficulte}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={selectedSection1} name={selectedSection1} fill="#8884d8" />
                    {selectedSection2 && <Bar dataKey={selectedSection2} name={selectedSection2} fill="#82ca9d" />}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80">
                <h3 className="text-lg font-medium mb-2">Pédagogie</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData.pedagogie}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={selectedSection1} name={selectedSection1} fill="#8884d8" />
                    {selectedSection2 && <Bar dataKey={selectedSection2} name={selectedSection2} fill="#82ca9d" />}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

