"use client"

import { Expense } from "@/@types/expense"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { CaretDown, CaretRight } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

interface FilterProps {
  onFilterChange: (filters: { start_date: Date; end_date: Date }) => void
}

export function CashflowFilter({ onFilterChange }: FilterProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [isFilterFilled, setIsFilterFilled] = useState(false)

  const currentYear = new Date().getFullYear()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitted },
  } = useForm<{ start_date: string; end_date: string }>()

  const formValues = watch()

  function onSubmit(data: Expense.GetRequestParams) {
    const cleanedData = {
      ...data,
      start_date: data.start_date ? new Date(data.start_date) : undefined,
      end_date: data.end_date ? new Date(data.end_date) : undefined,
    }
    onFilterChange(cleanedData)
  }

  function resetFilters() {
    reset()
    onFilterChange({
      start_date: new Date(currentYear, 0, 1),
      end_date: new Date(currentYear, 11, 31),
    })
  }

  useEffect(() => {
    const hasValue = Object.values(formValues).some(
      (value) => value !== undefined && value !== null && value !== ""
    )
    setIsFilterFilled(hasValue)
  }, [formValues])

  return (
    <div className="max-w-[30rem]">
      <div className="my-2 flex gap-4" onClick={() => setCollapsed(!collapsed)}>
        <h1 className="mb-2 text-xl font-semibold">Filtros</h1>
        {collapsed ?
          <CaretRight className="h-7 w-7 cursor-pointer" />
        : <CaretDown className="h-7 w-7 cursor-pointer" />}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`rounded-lg border border-black bg-gray-100 p-3 ${collapsed ? "invisible hidden" : ""}`}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-1 gap-2">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="start_date">Data Inicial</label>
              <Input.Root>
                <Input.Control {...register("start_date")} type="date" />
              </Input.Root>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="end_date">Data Final</label>
              <Input.Root>
                <Input.Control {...register("end_date")} type="date" />
              </Input.Root>
            </div>
          </div>

          <div className="flex flex-1 gap-2">
            <Button
              onClick={resetFilters}
              disabled={!isSubmitted}
              className="w-full"
              variant="secondary"
              type="button">
              Limpar
            </Button>

            <Button
              disabled={!isFilterFilled}
              className="w-full"
              variant="secondary"
              type="submit">
              Pesquisar
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
