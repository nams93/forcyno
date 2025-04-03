import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-10">
        <div className="max-w-3xl text-center md:text-left">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Formulaire de satisfaction GPIS</h1>
          <p className="text-xl text-gray-600">
            Plateforme de collecte et d'analyse des retours sur les formations GPIS
          </p>
        </div>
        <Link href="/help" className="hidden md:block">
          <Button variant="outline" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Aide
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Remplir le formulaire</CardTitle>
            <CardDescription>Donnez votre avis sur la formation que vous avez suivie</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/form" passHref>
              <Button size="lg">Accéder au formulaire</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tableau de bord</CardTitle>
            <CardDescription>Consultez les statistiques et générez des QR codes</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/dashboard" passHref>
              <Button size="lg" variant="outline">
                Accéder au dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Fonctionnalités principales</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  ✓
                </span>
                <span>Formulaire accessible sur tous les appareils (mobile, tablette, ordinateur)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  ✓
                </span>
                <span>Fonctionne même sans connexion internet (mode hors ligne)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  ✓
                </span>
                <span>Synchronisation automatique des données lorsque la connexion est rétablie</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  ✓
                </span>
                <span>Tableau de bord avec statistiques en temps réel</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  ✓
                </span>
                <span>Génération de QR codes pour un accès facile au formulaire</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  ✓
                </span>
                <span>Exportation des données en CSV ou JSON</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Link href="/help" className="md:hidden">
          <Button variant="outline" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Aide
          </Button>
        </Link>
      </div>
    </div>
  )
}

