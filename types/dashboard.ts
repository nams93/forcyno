export interface Response {
  id: string
  session: string
  lieuGlobal: string
  lieuAdapte: string
  lieuRealite: string
  commentaireLieu?: string
  scenarios: string
  misesEnSituation?: string
  difficulte: string
  evolutionDifficulte: string
  rythme: string
  duree: string
  attentes: string
  pedagogie: string
  qualiteReponses: string
  disponibiliteFormateurs: string
  satisfactionFormation: string
  commentaireLibre?: string
  createdAt: string
}

export interface DashboardStats {
  totalResponses: number
  recentIncrease: number
  satisfactionRate: number
  satisfactionChange: number
  averageDifficulty: number
  commentCount: number
  commentPercentage: number
  // Nouvelles propriétés optionnelles
  sectionCount?: number
  topSection?: string
}

