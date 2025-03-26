"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Filter } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Response } from "@/types/dashboard"

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface EnhancedFilterProps {
  title: string
  field: keyof Response
  responses: Response[]
  onFilterChange: (values: string[]) => void
  selectedValues: string[]
}

export function EnhancedFilter({ title, field, responses, onFilterChange, selectedValues }: EnhancedFilterProps) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<FilterOption[]>([])

  // Générer dynamiquement les options basées sur les données
  useEffect(() => {
    const valueMap: Record<string, number> = {}

    responses.forEach((response) => {
      const value = response[field] as string
      if (value) {
        valueMap[value] = (valueMap[value] || 0) + 1
      }
    })

    const newOptions = Object.entries(valueMap).map(([value, count]) => ({
      value,
      label: value,
      count,
    }))

    // Trier par nombre d'occurrences (décroissant)
    newOptions.sort((a, b) => (b.count || 0) - (a.count || 0))

    setOptions(newOptions)
  }, [responses, field])

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]

    onFilterChange(newSelectedValues)
  }

  const clearFilters = () => {
    onFilterChange([])
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between min-w-[200px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="truncate">{title}</span>
              {selectedValues.length > 0 && (
                <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                  {selectedValues.length}
                </Badge>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder={`Rechercher par ${title.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(option.value) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="flex-1">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.count}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {selectedValues.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem onSelect={clearFilters} className="justify-center text-center">
                      Effacer les filtres
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {selectedValues.map((value) => {
            const option = options.find((o) => o.value === value)
            return (
              <Badge key={value} variant="secondary" className="cursor-pointer" onClick={() => handleSelect(value)}>
                {option?.label || value}
                <span className="ml-1">×</span>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}

