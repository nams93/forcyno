"use client"
import { Bar, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartData,
  type ChartOptions,
} from "chart.js"

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

type ChartDataPoint = {
  name: string
  value: number
  [key: string]: any
}

// Couleurs par défaut pour les graphiques
const defaultColors = [
  "#1A3A72", // Bleu foncé GPIS
  "#A7C1E8", // Bleu clair GPIS
  "#8A8A8A", // Gris GPIS
  "#4CAF50", // Vert
  "#F44336", // Rouge
  "#FF9800", // Orange
  "#9C27B0", // Violet
]

// Couleurs pour la comparaison
const comparisonColors = {
  "Période actuelle": "#1A3A72", // Bleu foncé GPIS
  "Période précédente": "#A7C1E8", // Bleu clair GPIS
}

export function BarChart({
  data,
  isComparison = false,
}: {
  data: ChartDataPoint[]
  isComparison?: boolean
}) {
  let chartData: ChartData<"bar">

  if (isComparison) {
    // Format pour la comparaison entre périodes
    chartData = {
      labels: data.map((item) => item.name),
      datasets: Object.keys(data[0] || {})
        .filter((key) => key !== "name")
        .map((key, index) => ({
          label: key,
          data: data.map((item) => item[key]),
          backgroundColor: comparisonColors[key as keyof typeof comparisonColors] || defaultColors[index],
          borderColor: comparisonColors[key as keyof typeof comparisonColors] || defaultColors[index],
          borderWidth: 1,
        })),
    }
  } else {
    // Format standard
    chartData = {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label: "Nombre de réponses",
          data: data.map((item) => item.value),
          backgroundColor: defaultColors,
          borderColor: defaultColors.map((color) => color),
          borderWidth: 1,
        },
      ],
    }
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  }

  return <Bar data={chartData} options={options} />
}

export function PieChart({
  data,
  colors = defaultColors,
}: {
  data: ChartDataPoint[]
  colors?: string[]
}) {
  const chartData: ChartData<"pie"> = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length).map((color) => color),
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  }

  return <Pie data={chartData} options={options} />
}

