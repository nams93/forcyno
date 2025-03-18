"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CategoryOption {
  value: string
  label: string
}

interface CategoryFiltersProps {
  title: string
  options: CategoryOption[]
  onFilterChange: (values: string[]) => void
}

export function CategoryFilters({ title, options, onFilterChange }: CategoryFiltersProps) {
  const [open, setOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]

    setSelectedValues(newSelectedValues)
    onFilterChange(newSelectedValues)
  }

  const clearFilters = () => {
    setSelectedValues([])
    onFilterChange([])
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[250px] justify-between">
            {title}
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
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
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
                {option?.label}
                <span className="ml-1">×</span>
              </Badge>
            )
          })}
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={clearFilters}>
            Effacer tout
          </Badge>
        </div>
      )}
    </div>
  )
}

