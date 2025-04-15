"use client"

import { Expense } from "@/@types/expense"
import { SearchArray } from "@/@types/search-array"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { getAccountId } from "@/core/utils/get-account-id"
import { ArrayConfig, populateArrays } from "@/core/utils/populateArrays"
import { getOrganizations } from "@/modules/organization-components/organizations/infra/remote"
import { CaretDown, CaretRight } from "@phosphor-icons/react"
import { useEffect, useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

interface FilterProps {
  onFilterChange: (filters: {
    start_date: Date
    end_date: Date
    organization_id: string
  }) => void
}

export function DREFilter({ onFilterChange }: FilterProps) {
  const account_id = getAccountId()

  const [collapsed, setCollapsed] = useState(false)
  const [isFilterFilled, setIsFilterFilled] = useState(false)

  const [arrayPlaceHolder, setArrayPlaceHolder] = useState("Carregando...")
  const [organizations, setOrganizations] = useState<SearchArray>([])

  const arrayConfigs: ArrayConfig<any>[] = useMemo(
    () => [
      {
        fetchFn: getOrganizations,
        mapFn: (organization) => ({
          label: organization.name,
          value: organization.organization_id,
        }),
        setState: setOrganizations,
      },
    ],
    []
  )

  const currentYear = new Date().getFullYear()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { isSubmitted },
  } = useFormContext<{
    start_date?: string
    end_date?: string
    organization_id?: string
  }>()

  const formValues = watch()

  function onSubmit(data: Expense.GetRequestParams) {
    const cleanedData = {
      ...data,
      start_date: data.start_date ? new Date(data.start_date) : undefined,
      end_date: data.end_date ? new Date(data.end_date) : undefined,
      organization_id: data.organization_id ?? undefined,
    }
    onFilterChange(cleanedData)
  }

  function resetFilters() {
    reset()
    onFilterChange({
      start_date: new Date(currentYear, 0, 1),
      end_date: new Date(currentYear, 11, 31),
      organization_id: "",
    })
  }

  useEffect(() => {
    const hasValue = Object.values(formValues).some(
      (value) => value !== undefined && value !== null && value !== ""
    )
    setIsFilterFilled(hasValue)
  }, [formValues])

  useEffect(() => {
    if (!account_id) return

    populateArrays(
      arrayConfigs,
      account_id,
      () => setArrayPlaceHolder("Digite..."),
      (error) => {
        toast.error("Erro ao buscar dados: " + error.message)
        setArrayPlaceHolder("Erro ao carregar...")
      }
    )
  }, [arrayConfigs, account_id])

  return (
    <div className="max-w-[50rem]">
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

            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="organization_id">Organização</label>
              <Input.Root>
                <Input.SelectInput
                  name="organization_id"
                  control={control}
                  options={[{ label: "", value: "" }].concat(organizations)}
                  placeholder={arrayPlaceHolder}
                />
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
