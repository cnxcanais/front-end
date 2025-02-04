"use client"

import { Income } from "@/@types/income"
import { SearchArray } from "@/@types/search-array"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { ArrayConfig, populateArrays } from "@/core/utils/populateArrays"
import { getCookie } from "@/lib/cookies"
import { createIncomeFormSchema } from "@/modules/income-components/income-components/income/create-income/presentation/validation/schema"
import { createIncome } from "@/modules/income-components/income-components/income/remote/create-income"
import { getAllIncomeGroups } from "@/modules/income-components/income-groups-components/remote/income-group"
import { getIncomeSources } from "@/modules/income-components/income-source-components/income-sources/infra/remote"
import { getOrganizations } from "@/modules/organization-components/organizations/infra/remote"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateIncomeForm() {
  const { push } = useRouter()

  const account_id = getCookie("accountId")

  const [paymentQty, setPaymentQty] = useState<number | undefined>(1)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [organizations, setOrganizations] = useState<SearchArray>([])
  const [incomeGroups, setIncomeGroups] = useState<SearchArray>([])
  const [arrayPlaceHolder, setArrayPlaceHolder] = useState("Carregando...")
  const [incomeSource, setIncomeSource] = useState<SearchArray>([])

  const arrayConfigs: ArrayConfig<any>[] = [
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
  ]

  useEffect(() => {
    populateArrays(
      arrayConfigs,
      { account_id },
      () => setArrayPlaceHolder("Digite..."),
      (error) => {
        toast.error("Erro ao buscar dados: " + error.message)
        setArrayPlaceHolder("Erro ao carregar...")
      }
    )
  }, [])

  const {
    income_input_fields_amount,
    income_input_fields_income_qty,
    income_input_fields_income_percentage,
    income_input_fields_date,
    income_input_fields_document,
    income_input_fields_description,
    income_input_fields_income_source_id,
    income_input_fields_organization_id,
    income_input_fields_income_group_id,
  } = JSON.parse(getCookie("permissions")).componentAccess

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = useForm<Income.CreateResquest>({
    resolver: zodResolver(createIncomeFormSchema),
    values: {
      account_id,
      date: null,
      description: "",
      document: "",
      income_group_id: "",
      income_percentage: 100,
      income_source_id: "",
      organization_id: "",
    },
  })

  async function onSubmit(data: Income.CreateResquest) {
    try {
      const response = await createIncome(data)
      toast.success(response)
      setTimeout(() => push("/incomes"), 2000)
    } catch (error) {
      toast.error("Erro ao criar fonte de receita: " + error)
    }
  }

  return (
    <>
      <form
        className="mt-6 flex max-w-[1000px] flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex min-w-[500px] flex-col gap-2">
              <label className="text-lg" htmlFor="income_source_id">
                Gerador da Receita
              </label>
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
              <label className="text-lg" htmlFor="city">
                Grupo de Receitas
              </label>
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
              <label className="text-lg" htmlFor="cpf_cnpj">
                Data
              </label>
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
              <label className="min-w-[600px] text-lg" htmlFor="address_1">
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
              <label className="text-lg" htmlFor="phone">
                NF/Recibo
              </label>
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
            <div className="flex max-w-[150px] flex-1 flex-col gap-2">
              <label className="text-lg" htmlFor="name">
                Valor
              </label>
              <Input.Root>
                <Input.Currency
                  name="amount"
                  disabled={!income_input_fields_amount}
                  value={paymentAmount}
                  onChange={(value: number) => {
                    setPaymentAmount(value)
                  }}
                />
              </Input.Root>
            </div>

            <div className="flex max-w-[100px] flex-1 flex-col gap-2">
              <label className="text-lg" htmlFor="income_percentage">
                Percentual
              </label>
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
              <label className="text-lg" htmlFor="cep">
                Organização
              </label>
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

            <div className="flex max-w-[100px] flex-1 flex-col gap-2">
              <label className="text-lg" htmlFor="income_qty">
                Parcelas
              </label>
              <Input.Root variant="primary" className="max-w-100px">
                <Input.Control
                  disabled={!income_input_fields_income_qty}
                  type="number"
                  value={paymentQty}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value
                    setPaymentQty(value && Number(value))
                  }}
                />
              </Input.Root>
            </div>
          </div>
        </div>

        <div className="my-2 flex gap-4">
          <Button type="submit" disabled={isSubmitting} variant="primary">
            Salvar
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
      {process.env.NODE_ENV === "development" && <DevTool control={control} />}
    </>
  )
}
