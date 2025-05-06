"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { PatternLogin } from "@/components/auth/pattern-login"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = () => {
      // Vérifier si l'accès au dashboard est autorisé
      const accessCode = localStorage.getItem("dashboard_access")

      if (accessCode === "pattern_verified") {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [toast])

  // Afficher un indicateur de chargement pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  // Si non authentifié, afficher le formulaire de connexion par pattern
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
        <PatternLogin />
      </div>
    )
  }

  // Si authentifié, afficher le contenu protégé
  return <>{children}</>
}
