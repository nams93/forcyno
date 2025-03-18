"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookmarkIcon, Plus, Star, Trash } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { toast } from "@/components/ui/use-toast"

interface SavedView {
  id: string
  name: string
  dateRange?: DateRange
  filters: {
    satisfaction?: string[]
    difficulte?: string[]
    pedagogie?: string[]
  }
}

interface SavedViewsProps {
  onViewSelect: (view: SavedView) => void
}

export function SavedViews({ onViewSelect }: SavedViewsProps) {
  const [savedViews, setSavedViews] = useState<SavedView[]>([])
  const [newViewName, setNewViewName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<any>({})

  // Charger les vues sauvegardées depuis le localStorage
  useEffect(() => {
    const storedViews = localStorage.getItem("dashboardViews")
    if (storedViews) {
      try {
        setSavedViews(JSON.parse(storedViews))
      } catch (e) {
        console.error("Erreur lors du chargement des vues sauvegardées:", e)
      }
    }
  }, [])

  // Sauvegarder les vues dans le localStorage
  useEffect(() => {
    if (savedViews.length > 0) {
      localStorage.setItem("dashboardViews", JSON.stringify(savedViews))
    }
  }, [savedViews])

  const saveCurrentView = () => {
    if (!newViewName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à cette vue",
        variant: "destructive",
      })
      return
    }

    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName,
      filters: currentFilters,
    }

    setSavedViews([...savedViews, newView])
    setNewViewName("")
    setIsDialogOpen(false)

    toast({
      title: "Vue sauvegardée",
      description: `La vue "${newViewName}" a été sauvegardée avec succès.`,
    })
  }

  const deleteView = (id: string) => {
    setSavedViews(savedViews.filter((view) => view.id !== id))

    toast({
      title: "Vue supprimée",
      description: "La vue a été supprimée avec succès.",
    })
  }

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <BookmarkIcon className="h-4 w-4" />
              Vues sauvegardées
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mes vues</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {savedViews.length === 0 ? (
              <DropdownMenuItem disabled>Aucune vue sauvegardée</DropdownMenuItem>
            ) : (
              savedViews.map((view) => (
                <DropdownMenuItem key={view.id} className="flex justify-between" onClick={() => onViewSelect(view)}>
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    {view.name}
                  </span>
                  <Trash
                    className="h-4 w-4 text-destructive opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteView(view.id)
                    }}
                  />
                </DropdownMenuItem>
              ))
            )}

            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                Sauvegarder la vue actuelle
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sauvegarder la vue actuelle</DialogTitle>
            <DialogDescription>Donnez un nom à cette configuration pour la retrouver facilement.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                placeholder="Ex: Formations du trimestre"
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={saveCurrentView}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

