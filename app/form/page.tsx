"use client"

import { useState, useEffect, useRef } from "react"
import { SatisfactionForm } from "@/components/satisfaction-form"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function FormPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const { toast } = useToast()
  const [isOnline, setIsOnline] = useState(true)
  const [pendingResponses, setPendingResponses] = useState<any[]>([])
  const initialized = useRef(false)
  const [formSubmittedEvent, setFormSubmittedEvent] = useState(() => new Event("formSubmitted"))
  const [redirectToHome, setRedirectToHome] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Vérifier si le formulaire est ouvert
  useEffect(() => {
    const checkFormStatus = () => {
      const formStatus = localStorage.getItem("form_status")
      setIsFormOpen(formStatus !== "closed")
      setIsLoading(false)
    }

    checkFormStatus()

    // Vérifier périodiquement si le statut du formulaire a changé
    const interval = setInterval(checkFormStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  // Générer un ID de session unique pour suivre cet utilisateur
  useEffect(() => {
    // Éviter les exécutions multiples avec useRef
    if (initialized.current) return
    initialized.current = true

    const newSessionId = uuidv4()
    setSessionId(newSessionId)

    // Récupérer les réponses en attente du localStorage
    const storedResponses = localStorage.getItem("pendingResponses")
    if (storedResponses) {
      setPendingResponses(JSON.parse(storedResponses))
    }

    // Enregistrer la connexion
    const registerConnection = async () => {
      try {
        const response = await fetch("/api/active-connections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "register",
            sessionId: newSessionId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            online: navigator.onLine,
          }),
        })

        if (!response.ok) {
          // Si hors ligne, stocker pour synchronisation ultérieure
          const connectionData = {
            sessionId: newSessionId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            type: "connection",
          }
          const updatedResponses = [...pendingResponses, connectionData]
          setPendingResponses(updatedResponses)
          localStorage.setItem("pendingResponses", JSON.stringify(updatedResponses))
        }
      } catch (error) {
        // Si hors ligne, stocker pour synchronisation ultérieure
        const connectionData = {
          sessionId: newSessionId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          type: "connection",
        }
        const updatedResponses = [...pendingResponses, connectionData]
        setPendingResponses(updatedResponses)
        localStorage.setItem("pendingResponses", JSON.stringify(updatedResponses))
      }
    }

    registerConnection()

    // Nettoyer à la fermeture
    return () => {
      // Enregistrer la déconnexion si possible
      fetch("/api/active-connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "unregister",
          sessionId: newSessionId,
        }),
      }).catch(() => {
        // Ignorer les erreurs de déconnexion
      })
    }
  }, [])

  // Surveiller l'état de la connexion
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)

      // Si de retour en ligne, essayer de synchroniser les réponses en attente
      if (navigator.onLine && pendingResponses.length > 0) {
        synchronizePendingResponses()
      }
    }

    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)

    // Définir l'état initial
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [pendingResponses])

  // Fonction pour synchroniser les réponses en attente
  const synchronizePendingResponses = async () => {
    const newPendingResponses = [...pendingResponses]
    let hasChanges = false

    for (let i = 0; i < newPendingResponses.length; i++) {
      const item = newPendingResponses[i]

      try {
        let endpoint = ""
        if (item.type === "connection") {
          endpoint = "/api/register-connection"
        } else if (item.type === "response") {
          endpoint = "/api/submit-response"
        }

        if (!endpoint) continue

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        })

        if (response.ok) {
          // Supprimer de la liste des réponses en attente
          newPendingResponses.splice(i, 1)
          i--
          hasChanges = true
        }
      } catch (error) {
        // Continuer avec la prochaine réponse
        console.error("Erreur lors de la synchronisation:", error)
      }
    }

    if (hasChanges) {
      setPendingResponses(newPendingResponses)
      localStorage.setItem("pendingResponses", JSON.stringify(newPendingResponses))
    }
  }

  const handleSubmit = async (data: any) => {
    // Ajouter l'ID de session aux données
    const formData = {
      ...data,
      sessionId,
      timestamp: new Date().toISOString(),
      type: "response",
    }

    try {
      if (isOnline) {
        const response = await fetch("/api/submit-response", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi de la réponse")
        }

        // Déclencher un événement personnalisé pour mettre à jour les statistiques
        window.dispatchEvent(formSubmittedEvent)

        // Mettre à jour le localStorage pour les composants qui écoutent les changements de stockage
        const currentResponses = JSON.parse(localStorage.getItem("responses") || "[]")
        localStorage.setItem("responses", JSON.stringify([...currentResponses, formData]))
      } else {
        // Stocker la réponse localement pour synchronisation ultérieure
        const updatedResponses = [...pendingResponses, formData]
        setPendingResponses(updatedResponses)
        localStorage.setItem("pendingResponses", JSON.stringify(updatedResponses))

        // Stocker également dans offlineResponses pour les statistiques
        const offlineResponses = JSON.parse(localStorage.getItem("offlineResponses") || "[]")
        const offlineData = {
          ...formData,
          id: `offline-${Date.now()}`,
          createdAt: new Date().toISOString(),
          pendingSync: true,
        }
        localStorage.setItem("offlineResponses", JSON.stringify([...offlineResponses, offlineData]))

        // Déclencher l'événement de mise à jour
        window.dispatchEvent(formSubmittedEvent)
      }

      // Afficher l'écran de remerciement
      setSubmitted(true)

      // Afficher un toast de confirmation
      toast({
        title: "Merci pour votre participation !",
        description: isOnline
          ? "Votre réponse a été enregistrée avec succès."
          : "Votre réponse sera envoyée dès que vous serez connecté à Internet.",
      })
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)

      // Stocker la réponse localement en cas d'erreur
      const updatedResponses = [...pendingResponses, formData]
      setPendingResponses(updatedResponses)
      localStorage.setItem("pendingResponses", JSON.stringify(updatedResponses))

      // Stocker également dans offlineResponses pour les statistiques
      const offlineResponses = JSON.parse(localStorage.getItem("offlineResponses") || "[]")
      const offlineData = {
        ...formData,
        id: `error-${Date.now()}`,
        createdAt: new Date().toISOString(),
        pendingSync: true,
      }
      localStorage.setItem("offlineResponses", JSON.stringify([...offlineResponses, offlineData]))

      // Afficher l'écran de remerciement quand même
      setSubmitted(true)

      toast({
        title: "Merci pour votre participation !",
        description: "Votre réponse sera envoyée dès que possible.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        // Enregistrer la déconnexion
        fetch("/api/active-connections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "unregister",
            sessionId,
          }),
        }).catch(() => {
          // Ignorer les erreurs de déconnexion
        })

        // Rediriger vers la page d'accueil
        setRedirectToHome(true)
      }, 30000) // 30 secondes

      return () => clearTimeout(timer)
    }
  }, [submitted, sessionId])

  useEffect(() => {
    if (redirectToHome) {
      window.location.href = "/"
    }
  }, [redirectToHome])

  // Afficher un indicateur de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  // Afficher un message si le formulaire est fermé
  if (isFormOpen === false) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-2" />
            <CardTitle className="text-2xl">Formulaire temporairement fermé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Le formulaire de satisfaction n'est pas disponible pour le moment. Veuillez réessayer ultérieurement.
            </p>
            <div className="flex justify-center">
              <Link href="/">
                <Button>Retour à l'accueil</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Merci d'avoir participé !</h2>
            <p className="mt-2 text-gray-600">Votre avis est important pour nous aider à améliorer nos services.</p>
            {!isOnline && (
              <p className="mt-4 text-sm text-amber-600">
                Vous êtes actuellement hors ligne. Votre réponse sera envoyée automatiquement dès que vous serez
                connecté à Internet.
              </p>
            )}
            <p className="mt-6 text-sm text-gray-500">Vous serez automatiquement redirigé dans 30 secondes.</p>
            <div className="mt-4">
              <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                Retourner à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-blue-900">Formulaire de satisfaction GPIS</h1>
          <p className="text-gray-600">Merci de prendre quelques instants pour nous donner votre avis</p>
          {!isOnline && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-600">
                Vous êtes actuellement hors ligne. Votre réponse sera enregistrée localement et envoyée automatiquement
                dès que vous serez connecté à Internet.
              </p>
            </div>
          )}
        </div>
        <SatisfactionForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

