"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface TableauEmbedProps {
  viewUrl?: string
}

export function TableauEmbed({ viewUrl = "https://public.tableau.com/views/YourView" }: TableauEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Charger le SDK Tableau
    const loadTableauSDK = async () => {
      try {
        // Vérifier si le SDK est déjà chargé
        if (window.tableau) {
          initTableau()
          return
        }

        // Charger le SDK Tableau
        const script = document.createElement("script")
        script.src = "https://public.tableau.com/javascripts/api/tableau-2.min.js"
        script.async = true
        script.onload = initTableau
        script.onerror = () => {
          setError("Impossible de charger le SDK Tableau")
          setIsLoading(false)
        }
        document.body.appendChild(script)
      } catch (err) {
        setError("Une erreur est survenue lors du chargement du SDK Tableau")
        setIsLoading(false)
      }
    }

    // Initialiser Tableau
    const initTableau = () => {
      try {
        if (!containerRef.current || !window.tableau) return

        // Options de configuration
        const options = {
          hideTabs: true,
          hideToolbar: false,
          onFirstInteractive: () => {
            setIsLoading(false)
          },
        }

        // Créer la visualisation
        new window.tableau.Viz(containerRef.current, viewUrl, options)
      } catch (err) {
        console.error("Erreur lors de l'initialisation de Tableau:", err)
        setError("Impossible d'initialiser la visualisation Tableau")
        setIsLoading(false)
      }
    }

    loadTableauSDK()
  }, [viewUrl])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rapport Tableau</CardTitle>
        <CardDescription>Visualisez vos données avec Tableau</CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[600px] relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-center p-4">
              <p className="text-destructive mb-2">{error}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setError(null)
                  setIsLoading(true)
                  // Tenter de recharger la visualisation
                  if (containerRef.current) {
                    containerRef.current.innerHTML = ""
                    if (window.tableau) {
                      new window.tableau.Viz(containerRef.current, viewUrl, {
                        hideTabs: true,
                        onFirstInteractive: () => {
                          setIsLoading(false)
                        },
                      })
                    }
                  }
                }}
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" style={{ minHeight: "600px" }} />
      </CardContent>
    </Card>
  )
}

