import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 relative">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gpis%20logo-NmDLvtweM26S2g8vRr0Ifu52jSzQ7I.png"
            alt="GPIS Logo"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Tableau de Bord</h1>
          <p className="text-gray-600">Statistiques des formulaires de satisfaction</p>
        </div>
      </div>
      <Link href="/">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour au formulaire
        </Button>
      </Link>
    </div>
  )
}

