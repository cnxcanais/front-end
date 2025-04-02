"use client"

import { Income } from "@/@types/income"
import { SearchArray } from "@/@types/search-array"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { getAccountId } from "@/core/utils/get-account-id"
import { ArrayConfig, populateArrays } from "@/core/utils/populateArrays"
import { useIncomeByIdQuery } from "@/modules/income-components/income-components/infra/use-income-by-id-query"
import { editIncome } from "@/modules/income-components/income-components/remote"
import { getAllIncomeGroups } from "@/modules/income-components/income-groups-components/remote/income-group"
import { getIncomeSources } from "@/modules/income-components/income-source-components/income-sources/infra/remote"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { getOrganizations } from "@/modules/organization-components/organizations/infra/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { editIncomeSchema } from "../validation/schema"

export function EditIncomeForm({ income_id }: { income_id: string }) {
  const { push } = useRouter()

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const account_id = getAccountId()

  const [organizations, setOrganizations] = useState<SearchArray>([])
  const [incomeGroups, setIncomeGroups] = useState<SearchArray>([])
  const [arrayPlaceHolder, setArrayPlaceHolder] = useState("Carregando...")
  const [incomeSource, setIncomeSource] = useState<SearchArray>([])

  const { data: income, isLoading } = useIncomeByIdQuery(income_id)

  const arrayConfigs: ArrayConfig<any>[] = useMemo(
    () => [
      {
        fetchFn: getOrganizations,
        mapFn: (org) => ({
          label: org.name,
          value: org.organization_id,
        }),
        setState: setOrganizations,
      },
      {
        fetchFn: getAllIncomeGroups,
        mapFn: (group) => ({
          label: group.group_name,
          value: group.income_group_id,
        }),
        setState: setIncomeGroups,
      },
      {
        fetchFn: getIncomeSources,
        mapFn: (income) => ({
          label: income.name,
          value: income.income_source_id,
        }),
        setState: setIncomeSource,
      },
    ],
    []
  )

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

  const income_input_fields_amount = permissions?.["income_input_fields_amount"]
  const income_input_fields_income_qty =
    permissions?.["income_input_fields_income_qty"]
  const income_input_fields_income_percentage =
    permissions?.["income_input_fields_income_percentage"]
  const income_input_fields_date = permissions?.["income_input_fields_date"]
  const income_input_fields_document =
    permissions?.["income_input_fields_document"]
  const income_input_fields_description =
    permissions?.["income_input_fields_description"]
  const income_input_fields_income_source_id =
    permissions?.["income_input_fields_income_source_id"]
  const income_input_fields_organization_id =
    permissions?.["income_input_fields_organization_id"]
  const income_input_fields_income_group_id =
    permissions?.["income_input_fields_income_group_id"]

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = useForm<Income.UpdateRequest>({
    resolver: zodResolver(editIncomeSchema),
    values: {
      income_percentage: Number(income?.income_percentage ?? 100),
      date: income?.date.substring(0, 10),
      document: income?.document,
      description: income?.description,
      income_source_id: income?.income_source_id,
      organization_id: income?.organization_id,
      income_group_id: income?.income_group_id,
      income_id: income?.income_id,
    },
  })

  async function onSubmit(data: Income.UpdateRequest) {
    try {
      await editIncome(data)
      toast.success("Receita editada com sucesso!")
      setTimeout(() => push("/incomes"), 2000)
    } catch (error) {
      toast.error("Erro ao editar receita: " + error)
    }
  }

  if (!income || isLoading || permissionLoading) return <LoadingScreen />

  return (
    <>
      <form
        className="mt-6 flex max-w-[1000px] flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex min-w-[500px] flex-col gap-2">
              <label htmlFor="income_source_id">Gerador da Receita</label>
              <Input.Root
                variant={errors.income_source_id ? "error" : "primary"}>
                <Input.SelectInput
                  name="income_source_id"
                  control={control}
                  disabled={!income_input_fields_income_source_id}
                  options={incomeSource}
                  placeholder={arrayPlaceHolder}
                />
              </Input.Root>
              {errors.income_source_id && (
                <span className="text-xs text-red-500">
                  {errors.income_source_id.message}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="city">Item de Receitas</label>
              <Input.Root
                variant={errors.income_group_id ? "error" : "primary"}>
                <Input.SelectInput
                  name="income_group_id"
                  control={control}
                  disabled={!income_input_fields_income_group_id}
                  options={incomeGroups}
                  placeholder={arrayPlaceHolder}
                />
              </Input.Root>
              {errors.income_group_id && (
                <span className="text-xs text-red-500">
                  {errors.income_group_id.message}
                </span>
              )}
            </div>

            <div className="flex max-w-[150px] flex-1 flex-col gap-2">
              <label htmlFor="cpf_cnpj">Data</label>
              <Input.Root variant={errors.date ? "error" : "primary"}>
                <Input.Control
                  disabled={!income_input_fields_date}
                  {...register("date")}
                  type="date"
                />
              </Input.Root>
              {errors.date && (
                <span className="text-xs text-red-500">
                  {errors.date.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <label className="min-w-[600px]" htmlFor="address_1">
                Descrição
              </label>
              <Input.Root variant={errors.description ? "error" : "primary"}>
                <Input.Control
                  disabled={!income_input_fields_description}
                  {...register("description")}
                  type="text"
                />
              </Input.Root>
              {errors.description && (
                <span className="text-xs text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="phone">NF/Recibo</label>
              <Input.Root variant={errors.document ? "error" : "primary"}>
                <Input.Control
                  disabled={!income_input_fields_document}
                  {...register("document")}
                  type="text"
                />
              </Input.Root>
              {errors.document && (
                <span className="text-xs text-red-500">
                  {errors.document.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex max-w-[100px] flex-1 flex-col gap-2">
              <label htmlFor="income_percentage">Percentual</label>
              <Input.Root
                variant={errors.income_percentage ? "error" : "primary"}>
                <Input.Control
                  disabled={!income_input_fields_income_percentage}
                  {...register("income_percentage")}
                  type="text"
                />
              </Input.Root>
              {errors.income_percentage && (
                <span className="text-xs text-red-500">
                  {errors.income_percentage.message}
                </span>
              )}
            </div>

            <div className="flex min-w-[400px] flex-col gap-2">
              <label htmlFor="cep">Organização</label>
              <Input.Root>
                <Input.SelectInput
                  name="organization_id"
                  control={control}
                  disabled={!income_input_fields_organization_id}
                  options={organizations}
                  placeholder={arrayPlaceHolder}
                />
              </Input.Root>
              {errors.organization_id && (
                <span className="text-xs text-red-500">
                  {errors.organization_id.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="my-2 flex gap-4">
          <Button type="submit" disabled={isSubmitting} variant="primary">
            Editar
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => push("/incomes")}
            variant="tertiary">
            Voltar
          </Button>
        </div>
      </form>
    </>
  )
}
