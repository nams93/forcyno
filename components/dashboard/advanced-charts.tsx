"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Response } from "@/types/dashboard"
import * as d3 from "d3"

interface AdvancedChartsProps {
  responses: Response[]
}

export function AdvancedCharts({ responses }: AdvancedChartsProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || responses.length === 0) return

    // Nettoyer le SVG
    d3.select(svgRef.current).selectAll("*").remove()

    // Dimensions
    const width = 800
    const height = 500
    const margin = { top: 40, right: 30, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Préparer les données
    const satisfactionCounts: Record<string, number> = {}
    const difficultyCounts: Record<string, number> = {}

    responses.forEach((response) => {
      // Compter les niveaux de satisfaction
      satisfactionCounts[response.satisfactionFormation] = (satisfactionCounts[response.satisfactionFormation] || 0) + 1

      // Compter les niveaux de difficulté
      difficultyCounts[response.difficulte] = (difficultyCounts[response.difficulte] || 0) + 1
    })

    // Créer des données pour le graphique
    const satisfactionData = Object.entries(satisfactionCounts).map(([name, value]) => ({ name, value }))
    const difficultyData = Object.entries(difficultyCounts).map(([name, value]) => ({ name, value }))

    // Créer le SVG
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height)

    // Groupe principal avec marge
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Échelles
    const xScale = d3
      .scaleBand()
      .domain(satisfactionData.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.2)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(satisfactionData, (d) => d.value) || 0])
      .range([innerHeight, 0])

    // Axes
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")

    g.append("g").call(yAxis)

    // Titre des axes
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Niveau de satisfaction")

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .text("Nombre de réponses")

    // Barres
    g.selectAll(".bar")
      .data(satisfactionData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name) || 0)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.value))
      .attr("fill", "#1A3A72")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#A7C1E8")

        // Tooltip
        g.append("text")
          .attr("class", "tooltip")
          .attr("x", (xScale(d.name) || 0) + xScale.bandwidth() / 2)
          .attr("y", yScale(d.value) - 5)
          .attr("text-anchor", "middle")
          .text(d.value)
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#1A3A72")
        g.selectAll(".tooltip").remove()
      })
  }, [responses])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyse avancée</CardTitle>
        <CardDescription>Visualisation interactive avec D3.js</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <svg ref={svgRef} />
      </CardContent>
    </Card>
  )
}

