"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface SatisfactionFormProps {
  onSubmit: (data: any) => void
}

export function SatisfactionForm({ onSubmit }: SatisfactionFormProps) {
  // Lieux de la formation
  const [lieuGlobal, setLieuGlobal] = useState<string>("")
  const [lieuAdapte, setLieuAdapte] = useState<string>("")
  const [lieuRealite, setLieuRealite] = useState<string>("")
  const [commentaireLieu, setCommentaireLieu] = useState<string>("")

  // La formation et son contenue
  const [scenarios, setScenarios] = useState<string>("")
  const [misesEnSituation, setMisesEnSituation] = useState<string>("")
  const [difficulte, setDifficulte] = useState<string>("")
  const [evolutionDifficulte, setEvolutionDifficulte] = useState<string>("")
  const [rythme, setRythme] = useState<string>("")
  const [duree, setDuree] = useState<string>("")
  const [objectifsClairs, setObjectifsClairs] = useState<string>("")
  const [ameliorationAnalyse, setAmeliorationAnalyse] = useState<string>("")
  const [articulationExercices, setArticulationExercices] = useState<string>("")
  const [miseEnSituationSouhaite, setMiseEnSituationSouhaite] = useState<string>("")
  const [miseEnSituationMoinsInteresse, setMiseEnSituationMoinsInteresse] = useState<string>("")
  const [horaires, setHoraires] = useState<string>("")
  const [attentes, setAttentes] = useState<string>("")
  const [reponseProblematiques, setReponseProblematiques] = useState<string>("")
  const [applicationMethodes, setApplicationMethodes] = useState<string>("")

  // Les formateurs
  const [complementariteFormateurs, setComplementariteFormateurs] = useState<string>("")
  const [pedagogie, setPedagogie] = useState<string>("")
  const [qualiteReponses, setQualiteReponses] = useState<string>("")
  const [disponibiliteFormateurs, setDisponibiliteFormateurs] = useState<string>("")
  const [pertinenceDebriefings, setPertinenceDebriefings] = useState<string>("")
  const [satisfactionJournee, setSatisfactionJournee] = useState<string>("")
  const [interetNouvelleFormation, setInteretNouvelleFormation] = useState<string>("")
  const [commentaireLibre, setCommentaireLibre] = useState<string>("")

  const [session, setSession] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  // Surveiller l'état de la connexion
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)

    // Définir l'état initial
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!session) {
      newErrors.session = "Veuillez indiquer votre section"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formData = {
        // Lieux de la formation
        lieuGlobal,
        lieuAdapte,
        lieuRealite,
        commentaireLieu,

        // La formation et son contenue
        scenarios,
        misesEnSituation,
        difficulte,
        evolutionDifficulte,
        rythme,
        duree,
        objectifsClairs,
        ameliorationAnalyse,
        articulationExercices,
        miseEnSituationSouhaite,
        miseEnSituationMoinsInteresse,
        horaires,
        attentes,
        reponseProblematiques,
        applicationMethodes,

        // Les formateurs
        complementariteFormateurs,
        pedagogie,
        qualiteReponses,
        disponibiliteFormateurs,
        pertinenceDebriefings,
        satisfactionJournee,
        interetNouvelleFormation,
        commentaireLibre,

        session,
        timestamp: new Date().toISOString(),
        satisfactionFormation: attentes === "Très satisfait" || attentes === "Plutôt satisfait" ? "Oui" : "Non",
      }

      // Si hors ligne, stocker dans IndexedDB
      if (!isOnline) {
        // Stocker dans IndexedDB
        const offlineData = {
          ...formData,
          id: `offline-${Date.now()}`,
          createdAt: new Date().toISOString(),
          pendingSync: true,
        }

        // Récupérer les réponses existantes
        let offlineResponses = []
        try {
          const storedResponses = localStorage.getItem("offlineResponses")
          if (storedResponses) {
            offlineResponses = JSON.parse(storedResponses)
          }
        } catch (e) {
          console.error("Erreur lors de la récupération des réponses hors ligne", e)
        }

        // Ajouter la nouvelle réponse
        offlineResponses.push(offlineData)

        // Sauvegarder les réponses
        localStorage.setItem("offlineResponses", JSON.stringify(offlineResponses))

        // Enregistrer pour synchronisation ultérieure
        if ("serviceWorker" in navigator && "SyncManager" in window) {
          const registration = await navigator.serviceWorker.ready
          await registration.sync.register("sync-responses")
        }

        toast({
          title: "Réponse enregistrée hors ligne",
          description: "Votre réponse sera synchronisée automatiquement lorsque vous serez en ligne.",
        })
      } else {
        // Envoyer normalement
        await onSubmit(formData)

        // Stocker également dans le localStorage du dashboard
        const dashboardResponses = localStorage.getItem("dashboard_responses")
          ? JSON.parse(localStorage.getItem("dashboard_responses") || "[]")
          : []

        dashboardResponses.push({
          ...formData,
          id: `response-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        })

        localStorage.setItem("dashboard_responses", JSON.stringify(dashboardResponses))

        // Déclencher un événement pour mettre à jour les statistiques
        window.dispatchEvent(new Event("formSubmitted"))
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error)
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'envoi du formulaire. Vos réponses ont été sauvegardées localement.",
        variant: "destructive",
      })

      // Sauvegarder localement en cas d'erreur
      const offlineData = {
        // Toutes les données du formulaire
        lieuGlobal,
        lieuAdapte,
        lieuRealite,
        commentaireLieu,
        scenarios,
        misesEnSituation,
        difficulte,
        evolutionDifficulte,
        rythme,
        duree,
        objectifsClairs,
        ameliorationAnalyse,
        articulationExercices,
        miseEnSituationSouhaite,
        miseEnSituationMoinsInteresse,
        horaires,
        attentes,
        reponseProblematiques,
        applicationMethodes,
        complementariteFormateurs,
        pedagogie,
        qualiteReponses,
        disponibiliteFormateurs,
        pertinenceDebriefings,
        satisfactionJournee,
        interetNouvelleFormation,
        commentaireLibre,
        session,

        id: `error-${Date.now()}`,
        createdAt: new Date().toISOString(),
        pendingSync: true,
        satisfactionFormation: attentes === "Très satisfait" || attentes === "Plutôt satisfait" ? "Oui" : "Non",
      }

      // Récupérer les réponses existantes
      let offlineResponses = []
      try {
        const storedResponses = localStorage.getItem("offlineResponses")
        if (storedResponses) {
          offlineResponses = JSON.parse(storedResponses)
        }
      } catch (e) {
        console.error("Erreur lors de la récupération des réponses hors ligne", e)
      }

      // Ajouter la nouvelle réponse
      offlineResponses.push(offlineData)

      // Sauvegarder les réponses
      localStorage.setItem("offlineResponses", JSON.stringify(offlineResponses))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          {!isOnline && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
              <p className="text-amber-800 text-sm">
                Vous êtes actuellement hors ligne. Votre réponse sera enregistrée localement et synchronisée
                automatiquement lorsque vous serez connecté à Internet.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="session" className="text-base font-medium">
              Votre section
            </Label>
            <Select value={session} onValueChange={setSession}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez votre section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SECTION 1">SECTION 1</SelectItem>
                <SelectItem value="SECTION 2">SECTION 2</SelectItem>
                <SelectItem value="SECTION 3">SECTION 3</SelectItem>
                <SelectItem value="SECTION 4">SECTION 4</SelectItem>
              </SelectContent>
            </Select>
            {errors.session && <p className="text-sm text-red-500">{errors.session}</p>}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Lieux de la formation</h2>

            <div className="space-y-2">
              <Label htmlFor="lieuGlobal" className="text-base">
                Appréciation globale du lieu
              </Label>
              <Select value={lieuGlobal} onValueChange={setLieuGlobal}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Très satisfait">Très satisfait</SelectItem>
                  <SelectItem value="Plutôt satisfait">Plutôt satisfait</SelectItem>
                  <SelectItem value="Plutôt insatisfait">Plutôt insatisfait</SelectItem>
                  <SelectItem value="Très insatisfait">Très insatisfait</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lieuAdapte" className="text-base">
                Le lieu était-il adapté à la formation ?
              </Label>
              <Select value={lieuAdapte} onValueChange={setLieuAdapte}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oui, parfaitement">Oui, parfaitement</SelectItem>
                  <SelectItem value="Oui, avec quelques réserves">Oui, avec quelques réserves</SelectItem>
                  <SelectItem value="Non, pas vraiment">Non, pas vraiment</SelectItem>
                  <SelectItem value="Non, pas du tout">Non, pas du tout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lieuRealite" className="text-base">
                Le lieu correspondait-il à la réalité opérationnelle ?
              </Label>
              <Select value={lieuRealite} onValueChange={setLieuRealite}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oui, parfaitement">Oui, parfaitement</SelectItem>
                  <SelectItem value="Oui, avec quelques différences">Oui, avec quelques différences</SelectItem>
                  <SelectItem value="Non, assez différent">Non, assez différent</SelectItem>
                  <SelectItem value="Non, complètement différent">Non, complètement différent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commentaireLieu" className="text-base">
                Commentaires sur le lieu
              </Label>
              <Textarea
                id="commentaireLieu"
                value={commentaireLieu}
                onChange={(e) => setCommentaireLieu(e.target.value)}
                placeholder="Vos commentaires sur le lieu de formation..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">La formation et son contenu</h2>

            <div className="space-y-2">
              <Label htmlFor="scenarios" className="text-base">
                Pertinence des scénarios
              </Label>
              <Select value={scenarios} onValueChange={setScenarios}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Très pertinents">Très pertinents</SelectItem>
                  <SelectItem value="Plutôt pertinents">Plutôt pertinents</SelectItem>
                  <SelectItem value="Peu pertinents">Peu pertinents</SelectItem>
                  <SelectItem value="Pas du tout pertinents">Pas du tout pertinents</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="misesEnSituation" className="text-base">
                Qualité des mises en situation
              </Label>
              <Select value={misesEnSituation} onValueChange={setMisesEnSituation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellente">Excellente</SelectItem>
                  <SelectItem value="Bonne">Bonne</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Insuffisante">Insuffisante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulte" className="text-base">
                Niveau de difficulté
              </Label>
              <Select value={difficulte} onValueChange={setDifficulte}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trop facile">Trop facile</SelectItem>
                  <SelectItem value="Facile">Facile</SelectItem>
                  <SelectItem value="Adapté">Adapté</SelectItem>
                  <SelectItem value="Difficile">Difficile</SelectItem>
                  <SelectItem value="Trop difficile">Trop difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evolutionDifficulte" className="text-base">
                Évolution de la difficulté
              </Label>
              <Select value={evolutionDifficulte} onValueChange={setEvolutionDifficulte}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Progression trop rapide">Progression trop rapide</SelectItem>
                  <SelectItem value="Progression adaptée">Progression adaptée</SelectItem>
                  <SelectItem value="Progression trop lente">Progression trop lente</SelectItem>
                  <SelectItem value="Pas de progression claire">Pas de progression claire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rythme" className="text-base">
                Rythme de la formation
              </Label>
              <Select value={rythme} onValueChange={setRythme}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trop lent">Trop lent</SelectItem>
                  <SelectItem value="Adapté">Adapté</SelectItem>
                  <SelectItem value="Trop rapide">Trop rapide</SelectItem>
                  <SelectItem value="Irrégulier">Irrégulier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duree" className="text-base">
                Durée de la formation
              </Label>
              <Select value={duree} onValueChange={setDuree}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trop courte">Trop courte</SelectItem>
                  <SelectItem value="Adaptée">Adaptée</SelectItem>
                  <SelectItem value="Trop longue">Trop longue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectifsClairs" className="text-base">
                Clarté des objectifs
              </Label>
              <Select value={objectifsClairs} onValueChange={setObjectifsClairs}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Très clairs">Très clairs</SelectItem>
                  <SelectItem value="Plutôt clairs">Plutôt clairs</SelectItem>
                  <SelectItem value="Peu clairs">Peu clairs</SelectItem>
                  <SelectItem value="Pas du tout clairs">Pas du tout clairs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ameliorationAnalyse" className="text-base">
                Amélioration de votre capacité d'analyse
              </Label>
              <Select value={ameliorationAnalyse} onValueChange={setAmeliorationAnalyse}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Forte amélioration">Forte amélioration</SelectItem>
                  <SelectItem value="Amélioration notable">Amélioration notable</SelectItem>
                  <SelectItem value="Légère amélioration">Légère amélioration</SelectItem>
                  <SelectItem value="Aucune amélioration">Aucune amélioration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="articulationExercices" className="text-base">
                Articulation entre les exercices
              </Label>
              <Select value={articulationExercices} onValueChange={setArticulationExercices}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Très cohérente">Très cohérente</SelectItem>
                  <SelectItem value="Plutôt cohérente">Plutôt cohérente</SelectItem>
                  <SelectItem value="Peu cohérente">Peu cohérente</SelectItem>
                  <SelectItem value="Pas du tout cohérente">Pas du tout cohérente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="miseEnSituationSouhaite" className="text-base">
                Mise en situation que vous auriez souhaité voir
              </Label>
              <Textarea
                id="miseEnSituationSouhaite"
                value={miseEnSituationSouhaite}
                onChange={(e) => setMiseEnSituationSouhaite(e.target.value)}
                placeholder="Décrivez une mise en situation que vous auriez aimé voir..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="miseEnSituationMoinsInteresse" className="text-base">
                Mise en situation qui vous a le moins intéressé
              </Label>
              <Textarea
                id="miseEnSituationMoinsInteresse"
                value={miseEnSituationMoinsInteresse}
                onChange={(e) => setMiseEnSituationMoinsInteresse(e.target.value)}
                placeholder="Décrivez une mise en situation qui vous a le moins intéressé..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horaires" className="text-base">
                Satisfaction concernant les horaires
              </Label>
              <Select value={horaires} onValueChange={setHoraires}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Très satisfait">Très satisfait</SelectItem>
                  <SelectItem value="Plutôt satisfait">Plutôt satisfait</SelectItem>
                  <SelectItem value="Plutôt insatisfait">Plutôt insatisfait</SelectItem>
                  <SelectItem value="Très insatisfait">Très insatisfait</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attentes" className="text-base">
                La formation a-t-elle répondu à vos attentes ?
              </Label>
              <Select value={attentes} onValueChange={setAttentes}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Très satisfait">Très satisfait</SelectItem>
                  <SelectItem value="Plutôt satisfait">Plutôt satisfait</SelectItem>
                  <SelectItem value="Plutôt insatisfait">Plutôt insatisfait</SelectItem>
                  <SelectItem value="Très insatisfait">Très insatisfait</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reponseProblematiques" className="text-base">
                La formation a-t-elle répondu à vos problématiques ?
              </Label>
              <Select value={reponseProblematiques} onValueChange={setReponseProblematiques}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oui, totalement">Oui, totalement</SelectItem>
                  <SelectItem value="Oui, partiellement">Oui, partiellement</SelectItem>
                  <SelectItem value="Non, pas vraiment">Non, pas vraiment</SelectItem>
                  <SelectItem value="Non, pas du tout">Non, pas du tout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationMethodes" className="text-base">
                Pensez-vous pouvoir appliquer les méthodes apprises ?
              </Label>
              <Select value={applicationMethodes} onValueChange={setApplicationMethodes}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oui, facilement">Oui, facilement</SelectItem>
                  <SelectItem value="Oui, avec quelques adaptations">Oui, avec quelques adaptations</SelectItem>
                  <SelectItem value="Difficilement">Difficilement</SelectItem>
                  <SelectItem value="Non, pas applicable">Non, pas applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Les formateurs</h2>

            <div className="space-y-2">
              <Label htmlFor="complementariteFormateurs" className="text-base">
                Complémentarité des formateurs
              </Label>
              <Select value={complementariteFormateurs} onValueChange={setComplementariteFormateurs}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellente">Excellente</SelectItem>
                  <SelectItem value="Bonne">Bonne</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Insuffisante">Insuffisante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pedagogie" className="text-base">
                Qualité de la pédagogie
              </Label>
              <Select value={pedagogie} onValueChange={setPedagogie}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Très bien">Très bien</SelectItem>
                  <SelectItem value="Bien">Bien</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="À améliorer">À améliorer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualiteReponses" className="text-base">
                Qualité des réponses aux questions
              </Label>
              <Select value={qualiteReponses} onValueChange={setQualiteReponses}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Très satisfaisante">Très satisfaisante</SelectItem>
                  <SelectItem value="Satisfaisante">Satisfaisante</SelectItem>
                  <SelectItem value="Peu satisfaisante">Peu satisfaisante</SelectItem>
                  <SelectItem value="Insatisfaisante">Insatisfaisante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="disponibiliteFormateurs" className="text-base">
                Disponibilité des formateurs
              </Label>
              <Select value={disponibiliteFormateurs} onValueChange={setDisponibiliteFormateurs}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Très disponibles">Très disponibles</SelectItem>
                  <SelectItem value="Disponibles">Disponibles</SelectItem>
                  <SelectItem value="Peu disponibles">Peu disponibles</SelectItem>
                  <SelectItem value="Pas du tout disponibles">Pas du tout disponibles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pertinenceDebriefings" className="text-base">
                Pertinence des debriefings
              </Label>
              <Select value={pertinenceDebriefings} onValueChange={setPertinenceDebriefings}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Très pertinents">Très pertinents</SelectItem>
                  <SelectItem value="Pertinents">Pertinents</SelectItem>
                  <SelectItem value="Peu pertinents">Peu pertinents</SelectItem>
                  <SelectItem value="Pas du tout pertinents">Pas du tout pertinents</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="satisfactionJournee" className="text-base">
                Satisfaction globale de la journée
              </Label>
              <Select value={satisfactionJournee} onValueChange={setSatisfactionJournee}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Très satisfait">Très satisfait</SelectItem>
                  <SelectItem value="Satisfait">Satisfait</SelectItem>
                  <SelectItem value="Peu satisfait">Peu satisfait</SelectItem>
                  <SelectItem value="Pas du tout satisfait">Pas du tout satisfait</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interetNouvelleFormation" className="text-base">
                Intérêt pour une nouvelle formation
              </Label>
              <Select value={interetNouvelleFormation} onValueChange={setInteretNouvelleFormation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Très intéressé">Très intéressé</SelectItem>
                  <SelectItem value="Intéressé">Intéressé</SelectItem>
                  <SelectItem value="Peu intéressé">Peu intéressé</SelectItem>
                  <SelectItem value="Pas du tout intéressé">Pas du tout intéressé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commentaireLibre" className="text-base">
                Commentaire libre
              </Label>
              <Textarea
                id="commentaireLibre"
                value={commentaireLibre}
                onChange={(e) => setCommentaireLibre(e.target.value)}
                placeholder="Vos commentaires, suggestions ou remarques..."
                className="min-h-[150px]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
