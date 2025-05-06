"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QRCode from "qrcode.react"

export function QRCodeGenerator() {
  const [url, setUrl] = useState("")
  const [customUrl, setCustomUrl] = useState("")
  const [qrSize, setQrSize] = useState(200)
  const [activeTab, setActiveTab] = useState("default")

  // Générer l'URL par défaut basée sur l'emplacement actuel
  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin
      setUrl(`${baseUrl}/form`)
    }
  }, [])

  // Mettre à jour l'URL lorsque l'onglet change
  useEffect(() => {
    if (activeTab === "default" && typeof window !== "undefined") {
      const baseUrl = window.location.origin
      setUrl(`${baseUrl}/form`)
    } else if (activeTab === "custom") {
      setUrl(customUrl)
    }
  }, [activeTab, customUrl])

  // Télécharger le QR code
  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")

      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = "formulaire-satisfaction-qrcode.png"
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="default">URL par défaut</TabsTrigger>
          <TabsTrigger value="custom">URL personnalisée</TabsTrigger>
        </TabsList>

        <TabsContent value="default">
          <p className="text-sm text-gray-500 mb-2">Utilise l'URL par défaut du formulaire</p>
        </TabsContent>

        <TabsContent value="custom">
          <div className="space-y-2">
            <Label htmlFor="custom-url">URL personnalisée</Label>
            <Input
              id="custom-url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://votre-url.com/form"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col items-center space-y-4">
        <Card className="p-4 w-full flex justify-center bg-white">
          <QRCode
            id="qr-code"
            value={url || "https://example.com"}
            size={qrSize}
            level="H"
            includeMargin={true}
            renderAs="canvas"
          />
        </Card>

        <div className="w-full space-y-2">
          <Label htmlFor="qr-size">Taille du QR code</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="qr-size"
              type="range"
              min="100"
              max="300"
              step="10"
              value={qrSize}
              onChange={(e) => setQrSize(Number.parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-500 w-12">{qrSize}px</span>
          </div>
        </div>

        <div className="flex space-x-2 w-full">
          <Button onClick={downloadQRCode} className="w-full">
            Télécharger
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">URL: {url || "Aucune URL spécifiée"}</p>
      </div>
    </div>
  )
}
