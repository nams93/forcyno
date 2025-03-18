"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { submitFormData } from "@/actions/form-actions"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  lieuGlobal: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  lieuAdapte: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  lieuRealite: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  commentaireLieu: z.string().optional(),
  scenarios: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  misesEnSituation: z.string().optional(),
  difficulte: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  evolutionDifficulte: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  rythme: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  duree: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  attentes: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  pedagogie: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  qualiteReponses: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  disponibiliteFormateurs: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  satisfactionFormation: z.string().min(1, { message: "Veuillez sélectionner une option" }),
  commentaireLibre: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function SatisfactionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commentaireLieu: "",
      misesEnSituation: "",
      commentaireLibre: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      await submitFormData(data)
      toast({
        title: "Formulaire envoyé",
        description: "Merci pour votre retour d'expérience !",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du formulaire.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
        <Card className="w-full border-blue-200 shadow-md bg-white">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2 border-blue-100">
              Lieux de la formation
            </h2>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="lieuGlobal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1 – Globalement, qu'avez-vous pensé du lieu de formation ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Très satisfait">Très satisfait</SelectItem>
                        <SelectItem value="Plutôt satisfait">Plutôt satisfait</SelectItem>
                        <SelectItem value="Plutôt insatisfait">Plutôt insatisfait</SelectItem>
                        <SelectItem value="Très insatisfait">Très insatisfait</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lieuAdapte"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2 – Pensez-vous que les lieux sont adaptés ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Oui">Oui</SelectItem>
                        <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lieuRealite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      3 – Les lieux correspondent-ils à la réalité de votre activité professionnelle ?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Oui">Oui</SelectItem>
                        <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commentaireLieu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>4 – Commentaire :</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Votre commentaire sur les lieux de formation"
                        className="resize-none border-blue-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="w-full border-blue-200 shadow-md bg-white">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2 border-blue-100">
              La formation et son contenu
            </h2>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="scenarios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1 – Niveau de satisfaction vis-à-vis des scénarios proposés :</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Très satisfait">Très satisfait</SelectItem>
                        <SelectItem value="Plutôt satisfait">Plutôt satisfait</SelectItem>
                        <SelectItem value="Plutôt insatisfait">Plutôt insatisfait</SelectItem>
                        <SelectItem value="Très insatisfait">Très insatisfait</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="misesEnSituation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2 – Les mises en situation vous ont-elles semblé pertinentes ?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Votre avis sur les mises en situation"
                        className="resize-none border-blue-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulte"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>3 – Niveau de difficulté de la formation :</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Très difficile">Très difficile</SelectItem>
                        <SelectItem value="Difficile">Difficile</SelectItem>
                        <SelectItem value="Facile">Facile</SelectItem>
                        <SelectItem value="Très facile">Très facile</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="evolutionDifficulte"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>4 – Évolution du niveau de difficulté :</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bien équilibré">Bien équilibré</SelectItem>
                        <SelectItem value="Trop difficile">Trop difficile</SelectItem>
                        <SelectItem value="Trop facile">Trop facile</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rythme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>5 – Rythme de la formation :</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Trop lent">Trop lent</SelectItem>
                        <SelectItem value="Correct">Correct</SelectItem>
                        <SelectItem value="Trop rapide">Trop rapide</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>6 – Durée de la formation :</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Trop court">Trop court</SelectItem>
                        <SelectItem value="Correct">Correct</SelectItem>
                        <SelectItem value="Trop long">Trop long</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attentes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>7 – La formation a-t-elle répondu à vos attentes ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Oui">Oui</SelectItem>
                        <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="w-full border-blue-200 shadow-md bg-white">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2 border-blue-100">Les formateurs</h2>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="pedagogie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1 – Évaluation de la pédagogie :</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Très bien">Très bien</SelectItem>
                        <SelectItem value="Bien">Bien</SelectItem>
                        <SelectItem value="Moyen">Moyen</SelectItem>
                        <SelectItem value="Mauvais">Mauvais</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualiteReponses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2 – Qualité des réponses apportées :</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Très bien">Très bien</SelectItem>
                        <SelectItem value="Bien">Bien</SelectItem>
                        <SelectItem value="Moyen">Moyen</SelectItem>
                        <SelectItem value="Mauvais">Mauvais</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="disponibiliteFormateurs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>3 – Disponibilité des formateurs :</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Très disponible">Très disponible</SelectItem>
                        <SelectItem value="Disponible">Disponible</SelectItem>
                        <SelectItem value="Peu disponible">Peu disponible</SelectItem>
                        <SelectItem value="Pas disponible">Pas disponible</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="satisfactionFormation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>4 – Êtes-vous satisfait de cette formation ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Oui">Oui</SelectItem>
                        <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commentaireLibre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>5 – Commentaire libre :</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Votre commentaire sur la formation"
                        className="resize-none border-blue-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button
            type="submit"
            size="lg"
            className="px-8 py-6 text-lg font-semibold shadow-lg bg-blue-800 hover:bg-blue-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer le formulaire"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

