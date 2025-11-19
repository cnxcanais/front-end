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
  appliedFilters?: Record<string, string>
}

export function FilterForm({ fields, onFilter, defaultOpen = true, appliedFilters: externalAppliedFilters }: FilterFormProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({})
  
  const displayedFilters = externalAppliedFilters || appliedFilters


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned: Record<string, string> = {}
    Object.keys(filters).forEach(key => {
      const value = filters[key]
      if (value && value.trim()) {
        cleaned[key] = value
      }
    })
    setAppliedFilters(() => cleaned)
    onFilter(cleaned)
  }

  const handleClear = () => {
    setFilters({})
    setAppliedFilters({})
    onFilter({})
  }

  const handleRemoveTag = (key: string) => {
    const newApplied: Record<string, string> = {}
    const newFilters: Record<string, string> = {}
    
    Object.keys(displayedFilters).forEach(k => {
      if (k !== key) newApplied[k] = displayedFilters[k]
    })
    
    Object.keys(filters).forEach(k => {
      if (k !== key) newFilters[k] = filters[k]
    })
    
    setFilters(newFilters)
    setAppliedFilters(newApplied)
    onFilter(newApplied)
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
      
      {Object.keys(displayedFilters).length > 0 && (
        <div className={isOpen ? "border-t border-gray-200 p-4" : "p-4"}>
          <div className="flex flex-wrap gap-2">
            {Object.keys(displayedFilters).map(key => {
              const value = displayedFilters[key]
              const field = fields.find(f => f.name === key)
              return (
                <div
                  key={key}
                  className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm">
                  <span className="font-medium">{field?.label}:</span>
                  <span>{value}</span>
                  <button
                    onClick={() => handleRemoveTag(key)}
                    className="ml-1 hover:text-red-500">
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
