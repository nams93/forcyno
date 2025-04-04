import { SatisfactionStats } from "@/components/dashboard/satisfaction-stats"
import { QRCodeGenerator } from "@/components/dashboard/qr-code-generator"
import { ExportData } from "@/components/dashboard/export-data"
import { ActiveConnections } from "@/components/dashboard/active-connections"
import { FormControl } from "@/components/dashboard/form-control"
import { LogoutButton } from "@/components/auth/logout-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ListFilter } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Tableau de bord GPIS</h1>
          <p className="text-gray-600">Suivi des réponses au formulaire de satisfaction</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/responses">
            <Button>
              <ListFilter className="mr-2 h-4 w-4" />
              Voir toutes les réponses
            </Button>
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SatisfactionStats />
        </div>

        <div className="space-y-6">
          {/* Ajout du composant de contrôle du formulaire */}
          <FormControl />

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">QR Code du formulaire</h2>
            <p className="text-gray-600 mb-4">Scannez ce QR code pour accéder au formulaire de satisfaction</p>
            <QRCodeGenerator />
          </div>

          <ExportData />

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-medium">1.</span> Partagez le QR code avec les participants
              </p>
              <p className="text-gray-700">
                <span className="font-medium">2.</span> Les participants peuvent scanner le code pour accéder au
                formulaire
              </p>
              <p className="text-gray-700">
                <span className="font-medium">3.</span> Les réponses sont collectées en temps réel
              </p>
              <p className="text-gray-700">
                <span className="font-medium">4.</span> Les statistiques sont mises à jour automatiquement
              </p>
              <p className="text-gray-700">
                <span className="font-medium">5.</span> Le formulaire fonctionne même hors ligne
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ajout de la section des connexions actives */}
      <div className="mt-6">
        <ActiveConnections />
      </div>
    </div>
  )
}

