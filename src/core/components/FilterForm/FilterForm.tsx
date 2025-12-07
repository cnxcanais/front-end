"use client"

import { CaretDown, CaretUp, MagnifyingGlass } from "@phosphor-icons/react"
import { useState } from "react"
import { Button } from "../Button"
import * as Input from "../Input"

export interface FilterField {
  name: string
  label: string
  placeholder?: string
  type?: "text" | "select" | "date"
  options?: { label: string; value: string }[]
  disabled?: boolean
  onSelectChange?: (fieldName: string, value: string) => void
}

interface FilterSection {
  title: string
  fields: FilterField[]
  defaultOpen?: boolean
}

interface FilterFormProps {
  fields?: FilterField[]
  sections?: FilterSection[]
  onFilter: (filters: Record<string, string>) => void
  onSelectChange?: (fieldName: string, value: string) => void
  defaultOpen?: boolean
  appliedFilters?: Record<string, string>
  title?: string
  hideAppliedFilters?: boolean
}

export function FilterForm({ fields, sections, onFilter, onSelectChange, defaultOpen = true, appliedFilters: externalAppliedFilters, title = "Filtros", hideAppliedFilters = false }: FilterFormProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    sections?.reduce((acc, section, idx) => ({ ...acc, [idx]: section.defaultOpen ?? true }), {}) || {}
  )
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({})
  
  const displayedFilters = externalAppliedFilters || appliedFilters
  const allFields = fields || sections?.flatMap(s => s.fields) || []

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

  const toggleSection = (idx: number) => {
    setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 hover:bg-gray-50">
        <span className="font-semibold">{title}</span>
        {isOpen ? <CaretUp size={20} /> : <CaretDown size={20} />}
      </button>
      
      {isOpen && (
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          {sections ? (
            <>
              {sections.map((section, idx) => (
                <div key={idx} className="mb-6">
                  <button
                    type="button"
                    onClick={() => toggleSection(idx)}
                    className="flex w-full items-center justify-between mb-3 text-sm font-medium hover:text-blue-600">
                    <span>{section.title}</span>
                    {expandedSections[idx] ? <CaretUp size={16} /> : <CaretDown size={16} />}
                  </button>
                  {expandedSections[idx] && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {section.fields.map((field) => (
                        <div key={field.name} className={field.disabled ? "opacity-50 pointer-events-none" : ""}>
                          <label className="mb-1 block text-sm font-medium">
                            {field.label}
                          </label>
                          <Input.Root>
                            {field.type === "select" && field.options ? (
                              <Input.SelectInput
                                options={field.options}
                                placeholder={field.placeholder}
                                value={filters[field.name] || ""}
                                onChange={(value) => {
                                  setFilters((prev) => ({ ...prev, [field.name]: value || "" }))
                                  onSelectChange?.(field.name, value || "")
                                }}
                                disabled={field.disabled}
                              />
                            ) : (
                              <Input.Control
                                type={field.type === "date" ? "date" : "text"}
                                placeholder={field.placeholder}
                                value={filters[field.name] || ""}
                                onChange={(e) =>
                                  setFilters((prev) => ({ ...prev, [field.name]: e.target.value }))
                                }
                                disabled={field.disabled}
                              />
                            )}
                          </Input.Root>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {fields?.map((field) => (
                <div key={field.name} className={field.disabled ? "opacity-50 pointer-events-none" : ""}>
                  <label className="mb-1 block text-sm font-medium">
                    {field.label}
                  </label>
                  <Input.Root>
                    {field.type === "select" && field.options ? (
                      <Input.SelectInput
                        options={field.options}
                        placeholder={field.placeholder}
                        value={filters[field.name] || ""}
                        onChange={(value) => {
                          setFilters((prev) => ({ ...prev, [field.name]: value || "" }))
                          onSelectChange?.(field.name, value || "")
                        }}
                        disabled={field.disabled}
                      />
                    ) : (
                      <Input.Control
                        type={field.type === "date" ? "date" : "text"}
                        placeholder={field.placeholder}
                        value={filters[field.name] || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, [field.name]: e.target.value }))
                        }
                        disabled={field.disabled}
                      />
                    )}
                  </Input.Root>
                </div>
              ))}
            </div>
          )}
          
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
      
      {!hideAppliedFilters && Object.keys(displayedFilters).length > 0 && (
        <div className={isOpen ? "border-t border-gray-200 p-4" : "p-4"}>
          <div className="flex flex-wrap gap-2">
            {Object.keys(displayedFilters).map(key => {
              const value = displayedFilters[key]
              const field = allFields.find(f => f.name === key)
              const displayValue = field?.type === "select" && field?.options 
                ? field.options.find(option => option.value === value)?.label || value
                : value
              return (
                <div
                  key={key}
                  className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm">
                  <span className="font-medium">{field?.label}:</span>
                  <span>{displayValue}</span>
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
