"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function LogoutButton({ variant = "ghost", size = "sm" }: LogoutButtonProps) {
  const { toast } = useToast()

  const handleLogout = () => {
    // Supprimer les données d'authentification
    localStorage.removeItem("auth_status")
    localStorage.removeItem("auth_timestamp")

    // Afficher un toast de confirmation
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté du tableau de bord.",
    })

    // Rediriger vers la page d'accueil après un court délai
    setTimeout(() => {
      window.location.href = "/"
    }, 500)
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Déconnexion
    </Button>
  )
}

