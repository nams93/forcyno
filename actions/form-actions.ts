"use server"

import { revalidatePath } from "next/cache"
import { saveResponse } from "@/lib/data-service"

type FormData = {
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
}

export async function submitFormData(data: FormData) {
  // Simuler un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Enregistrer les données dans notre service
    await saveResponse(data)

    // Revalider les chemins pour mettre à jour le tableau de bord
    revalidatePath("/")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des données:", error)
    throw new Error("Erreur lors de l'envoi du formulaire")
  }
}

