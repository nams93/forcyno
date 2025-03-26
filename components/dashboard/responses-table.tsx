"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Response } from "@/types/dashboard"
import { MoreHorizontal, Search, Download, Trash } from "lucide-react"

export function ResponsesTable({ responses }: { responses: Response[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrer les réponses en fonction du terme de recherche
  const filteredResponses = responses.filter((response) => {
    const searchString = searchTerm.toLowerCase()
    return (
      response.lieuGlobal?.toLowerCase().includes(searchString) ||
      response.commentaireLieu?.toLowerCase().includes(searchString) ||
      response.misesEnSituation?.toLowerCase().includes(searchString) ||
      response.commentaireLibre?.toLowerCase().includes(searchString)
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher dans les réponses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Scénarios</TableHead>
              <TableHead>Difficulté</TableHead>
              <TableHead>Pédagogie</TableHead>
              <TableHead>Satisfaction</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResponses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Aucune réponse trouvée.
                </TableCell>
              </TableRow>
            ) : (
              filteredResponses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell className="font-medium">{response.id}</TableCell>
                  <TableCell>{response.session}</TableCell>
                  <TableCell>{response.lieuGlobal}</TableCell>
                  <TableCell>{response.scenarios}</TableCell>
                  <TableCell>{response.difficulte}</TableCell>
                  <TableCell>{response.pedagogie}</TableCell>
                  <TableCell>{response.satisfactionFormation}</TableCell>
                  <TableCell>{new Date(response.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

