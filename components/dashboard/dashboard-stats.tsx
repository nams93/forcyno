import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardStats as StatsType } from "@/types/dashboard"

export function DashboardStats({ stats }: { stats: StatsType }) {
  // S'assurer que toutes les valeurs numériques sont valides
  const totalResponses = stats.totalResponses || 0
  const recentIncrease = stats.recentIncrease || 0
  const satisfactionRate = stats.satisfactionRate || 0
  const satisfactionChange = stats.satisfactionChange || 0
  const averageDifficulty = stats.averageDifficulty || 0
  const commentCount = stats.commentCount || 0
  const commentPercentage = stats.commentPercentage || 0

  // Valeurs par défaut pour les nouvelles statistiques
  const sectionCount = typeof stats.sectionCount === "number" ? stats.sectionCount : 4
  const topSection = stats.topSection || "SECTION 1"

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des réponses</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-blue-800"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalResponses}</div>
          <p className="text-xs text-muted-foreground">
            {recentIncrease > 0 ? "+" : ""}
            {recentIncrease} depuis la semaine dernière
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de satisfaction</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-blue-800"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{satisfactionRate}%</div>
          <p className="text-xs text-muted-foreground">
            {satisfactionChange > 0 ? "+" : ""}
            {satisfactionChange}% depuis le mois dernier
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Difficulté moyenne</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-blue-800"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageDifficulty}</div>
          <p className="text-xs text-muted-foreground">Sur une échelle de 1 à 4</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Commentaires</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-blue-800"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{commentCount}</div>
          <p className="text-xs text-muted-foreground">{commentPercentage}% des réponses</p>
        </CardContent>
      </Card>
    </>
  )
}

