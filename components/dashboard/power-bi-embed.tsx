"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface PowerBIEmbedProps {
  reportId?: string
  workspaceId?: string
}

export function PowerBIEmbed({ reportId = "votre-report-id", workspaceId = "votre-workspace-id" }: PowerBIEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // Vérifier si les IDs sont configurés
    if (reportId === "votre-report-id" || workspaceId === "votre-workspace-id") {
      setIsConfigured(false)
      setIsLoading(false)
      return
    }

    setIsConfigured(true)

    // Charger le SDK Power BI
    const loadPowerBISDK = async () => {
      try {
        // Vérifier si le SDK est déjà chargé
        if (window.powerbi) {
          await embedReport()
          return
        }

        // Charger le SDK Power BI
        const script = document.createElement("script")
        script.src =
          "https://microsoft.github.io/PowerBI-JavaScript/demo/node_modules/powerbi-client/dist/powerbi.min.js"
        script.async = true
        script.onload = embedReport
        script.onerror = () => {
          setError("Impossible de charger le SDK Power BI")
          setIsLoading(false)
        }
        document.body.appendChild(script)
      } catch (err) {
        setError("Une erreur est survenue lors du chargement du SDK Power BI")
        setIsLoading(false)
      }
    }

    // Intégrer le rapport Power BI
    const embedReport = async () => {
      try {
        if (!containerRef.current || !window.powerbi) return

        // Ici, vous devriez obtenir un token d'accès depuis votre backend
        // Pour des raisons de sécurité, cette requête doit être faite côté serveur
        const response = await fetch("/api/power-bi/token")
        const { accessToken, expiry } = await response.json()

        if (!accessToken) {
          throw new Error("Impossible d'obtenir un token d'accès")
        }

        // Configuration pour l'intégration
        const embedConfig = {
          type: "report",
          id: reportId,
          embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}`,
          accessToken: accessToken,
          tokenType: 1, // AAD token
          settings: {
            navContentPaneEnabled: false,
            filterPaneEnabled: true,
          },
        }

        // Intégrer le rapport
        const report = window.powerbi.embed(containerRef.current, embedConfig)

        // Gérer les événements
        report.on("loaded", () => {
          setIsLoading(false)
        })

        report.on("error", (event) => {
          setError(event.detail.message || "Une erreur est survenue")
          setIsLoading(false)
        })
      } catch (err) {
        console.error("Erreur lors de l'intégration du rapport Power BI:", err)
        setError("Impossible d'intégrer le rapport Power BI")
        setIsLoading(false)
      }
    }

    loadPowerBISDK()

    // Nettoyage
    return () => {
      if (containerRef.current && window.powerbi) {
        window.powerbi.reset(containerRef.current)
      }
    }
  }, [reportId, workspaceId])

  if (!isConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intégration Power BI</CardTitle>
          <CardDescription>Configuration requise pour l'intégration Power BI</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-center mb-4">
            Pour intégrer un rapport Power BI, vous devez configurer les IDs de rapport et d'espace de travail.
          </p>
          <Button
            variant="outline"
            onClick={() =>
              window.open(
                "https://docs.microsoft.com/fr-fr/power-bi/developer/embedded/embed-sample-for-customers",
                "_blank",
              )
            }
          >
            Voir la documentation
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rapport Power BI</CardTitle>
        <CardDescription>Visualisez vos données avec les outils avancés de Power BI</CardDescription>
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
                  // Tenter de recharger le rapport
                  if (window.powerbi && containerRef.current) {
                    window.powerbi.reset(containerRef.current)
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

