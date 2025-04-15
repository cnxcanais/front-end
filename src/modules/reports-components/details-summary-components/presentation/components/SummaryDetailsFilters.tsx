import { IncomeDetails } from "@/@types/income-details"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { CaretDown, CaretRight } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"

interface FilterProps {
  onFilterChange: (filters: any) => void
}

export function SummaryDetailsFilters({ onFilterChange }: FilterProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [isFilterFilled, setIsFilterFilled] = useState(false)

  const { register, handleSubmit, control, reset } =
    useFormContext<IncomeDetails.QueryParams>()

  const formValues = useWatch({ control })

  function onSubmit(data: IncomeDetails.QueryParams) {
    const adjustMonth = (month: string | undefined, isStart: boolean) => {
      if (!month) return undefined
      const [year, monthIndex] = month.split("-").map(Number)
      return isStart ?
          new Date(year, monthIndex - 1, 1)
        : new Date(year, monthIndex, 0)
    }

    const cleanedData = {
      ...data,
      start_date: adjustMonth(data.start_date, true)
        ?.toISOString()
        .split("T")[0],
      end_date: adjustMonth(data.end_date, false)?.toISOString().split("T")[0],
    }

    onFilterChange(cleanedData)
  }

  function resetFilters() {
    reset()
    onFilterChange({})
  }

  useEffect(() => {
    const hasValue = Object.values(formValues).some(
      (value) => value !== undefined && value !== null && value !== ""
    )

    setIsFilterFilled(hasValue)
  }, [formValues])

  return (
    <div className="max-w-[40rem]">
      <div className="my-2 flex gap-4" onClick={() => setCollapsed(!collapsed)}>
        <h1 className="mb-2 text-xl font-semibold">Filtros</h1>
        {collapsed ?
          <CaretRight className="h-7 w-7 cursor-pointer" />
        : <CaretDown className="h-7 w-7 cursor-pointer" />}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex-1 rounded-lg border border-black bg-gray-100 p-3 ${collapsed ? "invisible hidden" : ""}`}>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="start_date">Data Inicial</label>
                <Input.Root>
                  <Input.Control {...register("start_date")} type="month" />
                </Input.Root>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="end_date">Data Final</label>
                <Input.Root>
                  <Input.Control {...register("end_date")} type="month" />
                </Input.Root>
              </div>
            </div>
            <div className="flex h-12 w-full gap-2">
              <Button
                className="w-full"
                disabled={!isFilterFilled}
                onClick={resetFilters}
                variant="secondary"
                type="button">
                Limpar
              </Button>

              <Button
                className="w-full"
                disabled={!isFilterFilled}
                variant="secondary"
                type="submit">
                Pesquisar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
