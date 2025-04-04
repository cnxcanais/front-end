"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { getAccountId } from "@/core/utils/get-account-id"
import { getUsers } from "@/modules/user-components/users/infra/remote"
import { CaretDown, CaretRight } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

interface LogsFiltersProps {
  onFilterChange: (filters: {
    start_date?: string
    end_date?: string
    user_id?: string
  }) => void
}

export function LogsFilters({ onFilterChange }: LogsFiltersProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [isFilterFilled, setIsFilterFilled] = useState(false)

  const accountId = getAccountId()

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(accountId),
  })

  const { register, handleSubmit, reset, watch, control } = useForm<{
    user_id?: string
    start_date?: string
    end_date?: string
  }>()

  const formValues = watch()

  const onSubmit = (data: {
    user_id?: string
    start_date?: string
    end_date?: string
  }) => {
    onFilterChange({
      user_id: data.user_id,
      start_date:
        data.start_date ?
          new Date(data.start_date).toISOString().split("T")[0]
        : "",
      end_date:
        data.end_date ?
          new Date(data.end_date).toISOString().split("T")[0]
        : "",
    })
  }

  const resetFilters = () => {
    reset()
    onFilterChange({})
  }

  useEffect(() => {
    const hasValue = Object.values(formValues).some(
      (v) => v !== undefined && v !== ""
    )
    setIsFilterFilled(hasValue)
  }, [formValues])

  if (isLoading || !users) return <></>

  return (
    <div>
      <div className="my-2 flex gap-4" onClick={() => setCollapsed(!collapsed)}>
        <h1 className="mb-2 text-xl font-semibold">Filtros</h1>
        {collapsed ?
          <CaretRight className="h-7 w-7 cursor-pointer" />
        : <CaretDown className="h-7 w-7 cursor-pointer" />}
      </div>

      {!collapsed && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg border border-black bg-gray-100 p-4">
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="user_id">Usuário</label>
                <Input.Root variant={"primary"}>
                  <Input.SelectInput
                    name="user_id"
                    control={control}
                    options={users.map((user) => {
                      return {
                        value: user.user_id,
                        label: user.name,
                      }
                    })}
                  />
                </Input.Root>
              </div>
            </div>

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

          <div
            className={`mt-4 flex ${isFilterFilled ? "max-w-[50%]" : "max-w-[30%]"} gap-2`}>
            {isFilterFilled && (
              <Button
                type="button"
                onClick={resetFilters}
                variant="secondary"
                className="w-full">
                Limpar
              </Button>
            )}
            <Button type="submit" variant="secondary" className="w-full">
              Pesquisar
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
