"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "lucide-react"

export function FormControl() {
  const [isFormOpen, setIsFormOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Charger l'état du formulaire au chargement du composant
  useEffect(() => {
    const formStatus = localStorage.getItem("form_status")
    if (formStatus) {
      setIsFormOpen(formStatus === "open")
    } else {
      // Par défaut, le formulaire est ouvert
      localStorage.setItem("form_status", "open")
    }
    setIsLoading(false)
  }, [])

  // Mettre à jour l'état du formulaire
  const toggleFormStatus = () => {
    const newStatus = !isFormOpen
    setIsFormOpen(newStatus)
    localStorage.setItem("form_status", newStatus ? "open" : "closed")
    localStorage.setItem("form_status_updated", new Date().toISOString())

    toast({
      title: newStatus ? "Formulaire ouvert" : "Formulaire fermé",
      description: newStatus
        ? "Les utilisateurs peuvent maintenant accéder au formulaire."
        : "L'accès au formulaire est maintenant bloqué.",
    })
  }

  // Formater la date de dernière mise à jour
  const getLastUpdated = () => {
    const lastUpdated = localStorage.getItem("form_status_updated")
    if (!lastUpdated) return "Jamais"

    const date = new Date(lastUpdated)
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrôle du formulaire</CardTitle>
        <CardDescription>Gérer l'accès au formulaire de satisfaction</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="form-status">État du formulaire</Label>
            <p className="text-sm text-gray-500">
              {isFormOpen ? "Le formulaire est actuellement ouvert" : "Le formulaire est actuellement fermé"}
            </p>
          </div>
          <Switch id="form-status" checked={isFormOpen} onCheckedChange={toggleFormStatus} />
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Dernière mise à jour: {getLastUpdated()}</span>
          </div>
        </div>

        <div className="pt-4">
          <Button variant={isFormOpen ? "destructive" : "default"} onClick={toggleFormStatus} className="w-full">
            {isFormOpen ? "Fermer le formulaire" : "Ouvrir le formulaire"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

