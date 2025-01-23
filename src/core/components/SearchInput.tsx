import * as Input from "@/core/components/Input"
import { MagnifyingGlass } from "@phosphor-icons/react"
import React, { useState } from "react"

interface SearchInputProps<T> {
  data: T[]
  searchParam: string
  onSearchResult?: (results: T[]) => void
  placeholder?: string
}

export function SearchInput<T>({
  data,
  searchParam,
  onSearchResult,
  placeholder = "Pesquisar",
}: SearchInputProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    const filteredResults = data.filter((item) => {
      const value = item[searchParam]
      return String(value).toLowerCase().includes(term.toLowerCase())
    })

    onSearchResult?.(filteredResults)
  }

  return (
    <Input.Root className="min-w-96">
      <Input.Control
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
      />
      <Input.Icon>
        <MagnifyingGlass className="h-5 w-5" />
      </Input.Icon>
    </Input.Root>
  )
}
