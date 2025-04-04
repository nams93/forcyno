"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Lock } from "lucide-react"

export function LoginForm() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const { toast } = useToast()

  // Effet pour gérer la redirection après connexion réussie
  useEffect(() => {
    if (redirecting) {
      // Utiliser window.location pour une redirection plus fiable
      window.location.href = "/dashboard"
    }
  }, [redirecting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Vérification simple côté client
      if (password === "2/He$@gJr3iwU") {
        // Stocker un indicateur simple d'authentification
        localStorage.setItem("auth_status", "authenticated")
        localStorage.setItem("auth_timestamp", Date.now().toString())

        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté au tableau de bord.",
        })

        // Déclencher la redirection après un court délai
        setTimeout(() => {
          setRedirecting(true)
        }, 500)
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Mot de passe incorrect.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la tentative de connexion.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Tableau de bord GPIS</CardTitle>
        <CardDescription className="text-center">
          Entrez le mot de passe pour accéder au tableau de bord
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Entrez le mot de passe"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading || redirecting}>
            {isLoading ? "Connexion en cours..." : redirecting ? "Redirection..." : "Se connecter"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

