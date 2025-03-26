"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
      await onSubmit({
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
      })
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-6">
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

          {/* Lieux de la formation */}
          <div>
            <h2 className="text-xl font-bold mb-4">Lieux de la formation</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  1 – Globalement, qu'avez-vous pensé du lieu de formation ?
                </Label>
                <Select value={lieuGlobal} onValueChange={setLieuGlobal}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">2 – Pensez-vous que les lieux sont adaptés ?</Label>
                <Select value={lieuAdapte} onValueChange={setLieuAdapte}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">
                  3 – Les lieux correspondent-ils à la réalité de votre activité professionnelle ?
                </Label>
                <Select value={lieuRealite} onValueChange={setLieuRealite}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label htmlFor="commentaire-lieu" className="text-base font-medium">
                  4 – Commentaire :
                </Label>
                <Textarea
                  id="commentaire-lieu"
                  placeholder="Votre commentaire..."
                  value={commentaireLieu}
                  onChange={(e) => setCommentaireLieu(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* La formation et son contenue */}
          <div>
            <h2 className="text-xl font-bold mb-4">La formation et son contenue</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  1– Quel est votre niveau de satisfaction vis-à-vis des scénarios proposés ?
                </Label>
                <Select value={scenarios} onValueChange={setScenarios}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label htmlFor="mises-en-situation" className="text-base font-medium">
                  2 – Les mises en situation vous ont-elles semblé pertinente ?
                </Label>
                <Textarea
                  id="mises-en-situation"
                  placeholder="Votre réponse..."
                  value={misesEnSituation}
                  onChange={(e) => setMisesEnSituation(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  3 – Comment évaluez-vous le niveau de difficulté de la formation ?
                </Label>
                <Select value={difficulte} onValueChange={setDifficulte}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Très difficile">Très difficile</SelectItem>
                    <SelectItem value="Difficile">Difficile</SelectItem>
                    <SelectItem value="Facile">Facile</SelectItem>
                    <SelectItem value="Très facile">Très facile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  4 - Que pensez-vous de l'évolution du niveau de difficulté durant la journée ?
                </Label>
                <Select value={evolutionDifficulte} onValueChange={setEvolutionDifficulte}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">5 – Qu'avez-vous pensé du rythme de la formation ?</Label>
                <Select value={rythme} onValueChange={setRythme}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">6 – Que pensez-vous de la durée de la formation ?</Label>
                <Select value={duree} onValueChange={setDuree}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">
                  7 – Selon vous, les objectifs de la formation ont-ils été clairement formulés en début de session ?
                </Label>
                <Select value={objectifsClairs} onValueChange={setObjectifsClairs}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">
                  9 – Pensez-vous que la formation suivie vous a aidé à améliorer votre analyse opérationnelle ?
                </Label>
                <Select value={ameliorationAnalyse} onValueChange={setAmeliorationAnalyse}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">
                  10 – Que pensez-vous de l'articulation entre les phases d'exercices et les débriefings ?
                </Label>
                <Select value={articulationExercices} onValueChange={setArticulationExercices}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label htmlFor="mise-en-situation-souhaite" className="text-base font-medium">
                  11 – Quelle mise en situation de la formation auriez-vous souhaité développer ?
                </Label>
                <Textarea
                  id="mise-en-situation-souhaite"
                  placeholder="Votre réponse..."
                  value={miseEnSituationSouhaite}
                  onChange={(e) => setMiseEnSituationSouhaite(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mise-en-situation-moins-interesse" className="text-base font-medium">
                  12 – Quelle mise en situation vous a le moins intéressé ?
                </Label>
                <Textarea
                  id="mise-en-situation-moins-interesse"
                  placeholder="Votre réponse..."
                  value={miseEnSituationMoinsInteresse}
                  onChange={(e) => setMiseEnSituationMoinsInteresse(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">13 – Que pensez-vous des horaires de la formation</Label>
                <Select value={horaires} onValueChange={setHoraires}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">14 – La formation a-t-elle répondu à vos attentes ?</Label>
                <Select value={attentes} onValueChange={setAttentes}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">
                  15 – La formation vous a-telle permis de répondre à des problématiques rencontrées sur le terrain ?
                </Label>
                <Select value={reponseProblematiques} onValueChange={setReponseProblematiques}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label htmlFor="application-methodes" className="text-base font-medium">
                  16 – Avez-vous pu mettre en application les méthodes opérationnelles vue lors de la formation ?
                </Label>
                <Textarea
                  id="application-methodes"
                  placeholder="Votre réponse..."
                  value={applicationMethodes}
                  onChange={(e) => setApplicationMethodes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Les formateurs */}
          <div>
            <h2 className="text-xl font-bold mb-4">Les formateurs</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  1 – Qu'avez-vous pensé de la complémentarité des responsables de formation ?
                </Label>
                <Select value={complementariteFormateurs} onValueChange={setComplementariteFormateurs}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">
                  2 – Globalement, comment évaluez-vous la pédagogie utilisée ?
                </Label>
                <Select value={pedagogie} onValueChange={setPedagogie}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">
                  3 – Qu'avez-vous pensé de la qualité des réponses apportées ?
                </Label>
                <Select value={qualiteReponses} onValueChange={setQualiteReponses}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">
                  4 – Comment évaluez-vous la disponibilité des formateurs ?
                </Label>
                <Select value={disponibiliteFormateurs} onValueChange={setDisponibiliteFormateurs}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label className="text-base font-medium">
                  5 - Les débriefings après chaque scénario vous ont-ils semblé pertinent ?
                </Label>
                <Select value={pertinenceDebriefings} onValueChange={setPertinenceDebriefings}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label htmlFor="satisfaction-journee" className="text-base font-medium">
                  6 – Etes-vous satisfait de cette journée de formation ?
                </Label>
                <Textarea
                  id="satisfaction-journee"
                  placeholder="Votre réponse..."
                  value={satisfactionJournee}
                  onChange={(e) => setSatisfactionJournee(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  7 – Seriez-vous intéressé pour suivre une nouvelle formation ?
                </Label>
                <Select value={interetNouvelleFormation} onValueChange={setInteretNouvelleFormation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre réponse" />
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
                <Label htmlFor="commentaire-libre" className="text-base font-medium">
                  8 – Commentaire libre :
                </Label>
                <Textarea
                  id="commentaire-libre"
                  placeholder="Votre commentaire..."
                  value={commentaireLibre}
                  onChange={(e) => setCommentaireLibre(e.target.value)}
                  rows={4}
                />
              </div>
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

