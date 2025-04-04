"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { LoginForm } from "@/components/auth/login-form"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Vérification simple de l'authentification
    const checkAuth = () => {
      const authStatus = localStorage.getItem("auth_status")
      const authTimestamp = localStorage.getItem("auth_timestamp")

      // Vérifier si l'authentification existe et n'est pas expirée (24 heures)
      const isValid =
        authStatus === "authenticated" &&
        authTimestamp &&
        Date.now() - Number.parseInt(authTimestamp) < 24 * 60 * 60 * 1000

      if (isValid) {
        console.log("Authentification valide, affichage du contenu protégé")
        setIsAuthenticated(true)
      } else {
        // Nettoyer les données d'authentification expirées
        if (authStatus) {
          localStorage.removeItem("auth_status")
          localStorage.removeItem("auth_timestamp")

          toast({
            title: "Session expirée",
            description: "Votre session a expiré. Veuillez vous reconnecter.",
            variant: "destructive",
          })
        }
        console.log("Authentification invalide, affichage du formulaire de connexion")
        setIsAuthenticated(false)
      }
    }

    // Vérifier l'authentification après un court délai pour s'assurer que localStorage est disponible
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [toast])

  // Afficher un indicateur de chargement pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  // Si non authentifié, afficher le formulaire de connexion
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
        <LoginForm />
      </div>
    )
  }

  // Si authentifié, afficher le contenu protégé
  return <>{children}</>
}

