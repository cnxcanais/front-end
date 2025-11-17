"use client"

import { ChangeEvent, forwardRef, useEffect, useRef, useState } from "react"
import * as Input from "../Input"

type Option = {
  text: string
  value: string
}

type AutocompleteInputProps = {
  options: Option[]
  label: string
  field_name: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void
  name?: string
  value?: string
  defaultValue?: string
}

export const AutocompleteInput = forwardRef<
  HTMLInputElement,
  AutocompleteInputProps
>(
  (
    {
      options,
      label,
      field_name,
      onChange,
      onBlur,
      name,
      value,
      defaultValue,
      ...rest
    },
    ref
  ) => {
    const [search, setSearch] = useState(defaultValue || "")
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const hiddenInputRef = useRef<HTMLInputElement>(null)
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
      const initialValue = value || defaultValue
      if (initialValue && options.length > 0 && !initialized) {
        const option = options.find(
          (opt) => opt.value === initialValue || opt.text.includes(initialValue)
        )
        if (option) {
          setSearch(option.text)
          setInitialized(true)
        }
      }
    }, [value, defaultValue, options, initialized])

    const filteredOptions = options.filter(
      (option) =>
        option.text?.toLowerCase().includes(search.toLowerCase()) ||
        String(option.value || "").toLowerCase().includes(search.toLowerCase())
    )

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (option: Option) => {
      setSearch(option.text)
      setIsOpen(false)

      if (hiddenInputRef.current && onChange) {
        hiddenInputRef.current.value = option.value
        const event = new Event("change", { bubbles: true }) as any
        Object.defineProperty(event, "target", {
          value: hiddenInputRef.current,
          enumerable: true,
        })
        onChange(event)
      }
    }

    return (
      <div ref={containerRef} className="relative flex flex-col gap-2">
        <label htmlFor={field_name}>{label}</label>
        <Input.Root variant="primary">
          <Input.Control
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
          />
        </Input.Root>
        <input
          ref={(e) => {
            hiddenInputRef.current = e
            if (typeof ref === "function") ref(e)
            else if (ref) ref.current = e
          }}
          type="hidden"
          name={name || field_name}
          onChange={onChange}
          onBlur={onBlur}
          defaultValue={defaultValue}
          {...rest}
        />

        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
            {filteredOptions.map((option, index) => (
              <div
                key={`${option.value}-${index}`}
                className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                onClick={() => handleSelect(option)}>
                {option.text}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

AutocompleteInput.displayName = "AutocompleteInput"
