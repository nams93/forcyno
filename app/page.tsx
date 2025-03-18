import { SatisfactionForm } from "@/components/satisfaction-form"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8 max-w-3xl relative">
        {/* Logo en filigrane */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
          <div className="w-[800px] h-[800px] relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gpis%20logo-NmDLvtweM26S2g8vRr0Ifu52jSzQ7I.png"
              alt="GPIS Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        {/* En-tête avec logo et lien vers le tableau de bord */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-full flex justify-end mb-4">
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Tableau de bord
              </Button>
            </Link>
          </div>
          <div className="w-48 h-24 relative mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gpis%20logo-NmDLvtweM26S2g8vRr0Ifu52jSzQ7I.png"
              alt="GPIS Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-blue-800">Formulaire de Satisfaction</h1>
          <p className="text-gray-600">
            Merci de prendre quelques minutes pour nous donner votre avis sur la formation.
          </p>
        </div>

        <SatisfactionForm />

        {/* Pied de page avec logo */}
        <div className="mt-12 text-center text-gray-500 text-sm flex flex-col items-center">
          <p>© {new Date().getFullYear()} GPIS GIE - Tous droits réservés</p>
          <div className="w-24 h-12 relative mt-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gpis%20logo-NmDLvtweM26S2g8vRr0Ifu52jSzQ7I.png"
              alt="GPIS Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}

