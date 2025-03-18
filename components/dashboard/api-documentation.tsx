"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { Input } from "@/components/ui/input"

export function ApiDocumentation() {
  const [copied, setCopied] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("votre-clé-api")

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const baseUrl =
    typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "https://votre-domaine.com"

  const curlExample = `curl "${baseUrl}/api/data" \\
  -H "Authorization: Bearer ${apiKey}"`

  const pythonExample = `import requests

url = "${baseUrl}/api/data"
headers = {"Authorization": "Bearer ${apiKey}"}

response = requests.get(url, headers=headers)
data = response.json()

print(f"Nombre de réponses: {len(data)}")`

  const rExample = `library(httr)
library(jsonlite)

url <- "${baseUrl}/api/data"
headers <- c("Authorization" = paste("Bearer", "${apiKey}"))

response <- GET(url, add_headers(headers))
data <- fromJSON(content(response, "text"))

print(paste("Nombre de réponses:", length(data)))`

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API de données</CardTitle>
        <CardDescription>
          Accédez à vos données via notre API REST pour intégration avec n'importe quel outil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="text-sm font-medium">Votre clé API</label>
          <div className="flex gap-2 mt-1">
            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Entrez votre clé API" />
            <Button variant="outline">Générer</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Cette clé est utilisée pour authentifier vos requêtes à l'API.
          </p>
        </div>

        <Tabs defaultValue="curl" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="r">R</TabsTrigger>
          </TabsList>

          <TabsContent value="curl" className="mt-4">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{curlExample}</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(curlExample, "curl")}
              >
                {copied === "curl" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="python" className="mt-4">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{pythonExample}</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(pythonExample, "python")}
              >
                {copied === "python" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="r" className="mt-4">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{rExample}</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(rExample, "r")}
              >
                {copied === "r" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="text-lg font-medium">Paramètres de requête</h3>
          <div className="mt-2 border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Paramètre</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Exemple</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 font-mono text-sm">startDate</td>
                  <td className="px-4 py-2">Date de début (format ISO)</td>
                  <td className="px-4 py-2 font-mono text-sm">2023-01-01</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-mono text-sm">endDate</td>
                  <td className="px-4 py-2">Date de fin (format ISO)</td>
                  <td className="px-4 py-2 font-mono text-sm">2023-12-31</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sm">format</td>
                  <td className="px-4 py-2">Format de sortie (json ou csv)</td>
                  <td className="px-4 py-2 font-mono text-sm">csv</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

