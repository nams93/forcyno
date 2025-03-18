import type { Response } from "@/types/dashboard"
import type { DateRange } from "react-day-picker"

export function filterResponsesByDateRange(responses: Response[], dateRange?: DateRange): Response[] {
  if (!dateRange || !dateRange.from) {
    return responses
  }

  return responses.filter((response) => {
    const responseDate = new Date(response.createdAt)

    if (dateRange.from && dateRange.to) {
      // Ajuster la date de fin pour inclure tout le jour
      const endDate = new Date(dateRange.to)
      endDate.setHours(23, 59, 59, 999)

      return responseDate >= dateRange.from && responseDate <= endDate
    }

    if (dateRange.from) {
      return responseDate >= dateRange.from
    }

    return true
  })
}

export function filterResponsesByCategory(responses: Response[], category: string, values: string[]): Response[] {
  if (!values.length) {
    return responses
  }

  return responses.filter((response) => {
    const fieldValue = response[category as keyof Response] as string
    return values.includes(fieldValue)
  })
}

export function prepareChartData(responses: Response[], field: keyof Response) {
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

export function prepareComparisonData(
  currentPeriodResponses: Response[],
  previousPeriodResponses: Response[],
  metric: string,
) {
  const currentData = prepareChartData(currentPeriodResponses, metric as keyof Response)
  const previousData = prepareChartData(previousPeriodResponses, metric as keyof Response)

  // Fusionner les deux ensembles de données
  const allCategories = new Set([...currentData.map((item) => item.name), ...previousData.map((item) => item.name)])

  return Array.from(allCategories).map((category) => {
    const currentValue = currentData.find((item) => item.name === category)?.value || 0
    const previousValue = previousData.find((item) => item.name === category)?.value || 0

    return {
      name: category,
      "Période actuelle": currentValue,
      "Période précédente": previousValue,
    }
  })
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

