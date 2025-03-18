"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null)

  useEffect(() => {
    // Vous pouvez personnaliser l'URL de l'image de fond ici
    // ou utiliser l'API route pour obtenir une image dynamique
    setBackgroundUrl("/api/background")
  }, [])

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="min-h-screen bg-black/30 backdrop-blur-sm py-8">{children}</div>
    </div>
  )
}

