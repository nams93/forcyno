"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import QRCode from "qrcode"

export function QRCodeGenerator() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [formUrl, setFormUrl] = useState<string>("")
  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  // Générer l'URL du formulaire
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Utiliser l'URL actuelle sans le chemin /dashboard
      const baseUrl = window.location.origin
      setFormUrl(`${baseUrl}/form`)
    }
  }, [])

  // Détecter si l'application peut être installée
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Empêcher Chrome d'afficher automatiquement la fenêtre d'installation
        e.preventDefault()
        // Stocker l'événement pour pouvoir le déclencher plus tard
        setDeferredPrompt(e)
        // Mettre à jour l'interface utilisateur
        setCanInstall(true)
      })
    }
  }, [])

  // Générer le QR code
  const generateQRCode = useCallback(async () => {
    if (!formUrl) return

    setIsGenerating(true)
    try {
      // Ajouter un timestamp pour forcer la régénération
      const timestamp = new Date().getTime()
      const url = await QRCode.toDataURL(formUrl + "?t=" + timestamp, {
        width: 300,
        margin: 2,
        color: {
          dark: "#1A3A72", // Bleu foncé GPIS
          light: "#FFFFFF", // Fond blanc
        },
      })
      setQrCodeUrl(url)
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error)
    } finally {
      setIsGenerating(false)
    }
  }, [formUrl])

  // Générer le QR code au chargement du composant
  useEffect(() => {
    if (formUrl) {
      generateQRCode()
    }
  }, [formUrl, generateQRCode])

  // Fonction de régénération explicite pour le bouton
  const handleRegenerate = () => {
    generateQRCode()
  }

  // Télécharger le QR code
  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = "formulaire-satisfaction-qrcode.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Installer l'application
  const handleInstallClick = () => {
    if (!deferredPrompt) return

    // Afficher la fenêtre d'installation
    deferredPrompt.prompt()

    // Attendre que l'utilisateur réponde
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        console.log("L'utilisateur a accepté l'installation")
      } else {
        console.log("L'utilisateur a refusé l'installation")
      }
      // Réinitialiser le prompt différé
      setDeferredPrompt(null)
      setCanInstall(false)
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>QR Code du formulaire</CardTitle>
        <CardDescription>Scannez ce QR code pour accéder directement au formulaire de satisfaction</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {qrCodeUrl ? (
          <div className="flex flex-col items-center gap-4">
            <div className="border-4 border-blue-200 rounded-lg p-2 bg-white">
              <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code du formulaire" className="w-64 h-64" />
            </div>
            <p className="text-sm text-center text-muted-foreground break-all max-w-xs">{formUrl}</p>
            <p className="text-xs text-center text-green-600 mt-2">
              Ce QR code dirige directement vers le formulaire de satisfaction. Il fonctionne même sans connexion
              internet une fois l'application installée.
            </p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              <Button variant="outline" className="gap-2" onClick={handleRegenerate} disabled={isGenerating}>
                {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Régénérer
              </Button>
              <Button className="gap-2" onClick={downloadQRCode}>
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
              {canInstall && (
                <Button className="gap-2" onClick={handleInstallClick}>
                  <Download className="h-4 w-4" />
                  Installer l'application
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
            <p className="text-muted-foreground">Génération du QR code...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

