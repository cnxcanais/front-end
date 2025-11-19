"use client"

import { CaretDown, CaretUp, MagnifyingGlass } from "@phosphor-icons/react"
import { useState } from "react"
import { Button } from "../Button"
import * as Input from "../Input"

export interface FilterField {
  name: string
  label: string
  placeholder?: string
  type?: "text" | "select"
  options?: { label: string; value: string }[]
}

interface FilterFormProps {
  fields: FilterField[]
  onFilter: (filters: Record<string, string>) => void
  defaultOpen?: boolean
}

export function FilterForm({ fields, onFilter, defaultOpen = true }: FilterFormProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [filters, setFilters] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter(filters)
  }

  const handleClear = () => {
    setFilters({})
    onFilter({})
  }

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 hover:bg-gray-50">
        <span className="font-semibold">Filtros</span>
        {isOpen ? <CaretUp size={20} /> : <CaretDown size={20} />}
      </button>
      
      {isOpen && (
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="mb-1 block text-sm font-medium">
                  {field.label}
                </label>
                <Input.Root>
                  {field.type === "select" && field.options ? (
                    <Input.SelectInput
                      options={field.options}
                      placeholder={field.placeholder}
                      value={filters[field.name] || ""}
                      onChange={(value) =>
                        setFilters((prev) => ({ ...prev, [field.name]: value || "" }))
                      }
                    />
                  ) : (
                    <Input.Control
                      placeholder={field.placeholder}
                      value={filters[field.name] || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, [field.name]: e.target.value }))
                      }
                    />
                  )}
                </Input.Root>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button type="submit" variant="secondary" className="flex items-center gap-2">
              <MagnifyingGlass size={18} />
              Buscar
            </Button>
            <Button type="button" variant="tertiary" onClick={handleClear}>
              Limpar
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
