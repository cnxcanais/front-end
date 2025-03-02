"use client"

import { SearchArray } from "@/@types/search-array"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { usePermissions } from "@/core/utils/hooks/use-permission"
import { ArrayConfig, populateArrays } from "@/core/utils/populateArrays"
import { useGetAccountsQuery } from "@/modules/accounts-components/accounts/infra/hooks/use-get-accounts-query"
import { useFetchBankAccountsQuery } from "@/modules/bank-accounts-components/bank-accounts/infra/hooks/use-fetch-bank-accounts-query"
import { FormType } from "@/modules/expenses-components/expense-components/create-expense/presentation/components/CreateExpenseForm"
import { getAllExpenseGroups } from "@/modules/expenses-components/expense-groups-components/remote/expense-groups-methods"
import { getSuppliers } from "@/modules/expenses-components/supplier-components/suppliers/infra/remote"
import { useGetOrganizationsQuery } from "@/modules/organization-components/organizations/infra/hooks/use-get-organizations-query"
import { getOrganizations } from "@/modules/organization-components/organizations/infra/remote"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

type Props = {
  account_id: string
  setSecondPage: Dispatch<SetStateAction<boolean>>
}

export function ExpenseForm({ account_id, setSecondPage }: Props) {
  const { push } = useRouter()

  const {
    register,
    trigger,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useFormContext<FormType>()

  const [organizations, setOrganizations] = useState<SearchArray>([])
  const [expenseGroups, setExpenseGroups] = useState<SearchArray>([])
  const [arrayPlaceHolder, setArrayPlaceHolder] = useState("Carregando...")
  const [suppliers, setSuppliers] = useState<SearchArray>([])
  const [accounts, setAccounts] = useState<SearchArray>([])
  const [franchiseOrganizations, setFranchiseOrganizations] =
    useState<SearchArray>([])
  const [destinyFranchiseBankAccounts, setDestinyFranchiseBankAccounts] =
    useState<SearchArray>([])
  const [masterMode, setMasterMode] = useState<boolean>(false)

  const destinyFranchiseId = watch("destinyFranchiseId")
  const destinyFranchiseBankAccountId = watch("destinyFranchiseBankId")
  const destinyFranchiseOrganizationId = watch("destinyFranchiseOrganizationId")

  const { data: accountList } = useGetAccountsQuery()
  const {
    data: organizationList,
    refetch: refetchOrganization,
    isLoading: isLoadingOrganization,
  } = useGetOrganizationsQuery(destinyFranchiseId)

  const {
    data: bankAccountList,
    refetch,
    isLoading,
  } = useFetchBankAccountsQuery(destinyFranchiseId)

  useEffect(() => {
    refetch()
    refetchOrganization()
    setValue("destinyFranchiseBankId", "")
    setValue("destinyFranchiseOrganizationId", "")
  }, [destinyFranchiseId])

  //SET DESTINY FRANCHISE BANK ACCOUNTS TO BE USED WHEN MASTER MODE
  useEffect(() => {
    if (bankAccountList) {
      const bankAccountSearchArray: SearchArray = [
        { label: "", value: "" },
      ].concat(
        bankAccountList.map((account) => ({
          label: `AG: ${account.agency} | CC: ${account.account_number}`,
          value: account.bank_account_id,
        }))
      )
      setDestinyFranchiseBankAccounts(bankAccountSearchArray)
    }
  }, [bankAccountList])

  //SET DESTINY FRANCHISE EXPENSE DESTINY ACCOUNTS TO BE USED WHEN MASTER MODE
  useEffect(() => {
    if (accountList) {
      const accountSearchArray: SearchArray = accountList
        .filter((account) => account.account_id !== account_id)
        .map((account) => ({
          label: account.name,
          value: account.account_id,
        }))
      if (accountSearchArray) setAccounts(accountSearchArray)

      const { master_mode } = accountList?.find(
        (account) => account.account_id === account_id
      )
      setMasterMode(master_mode)
    }
  }, [accountList])

  //SET DESTINY FRANCHISE ORGANIZATIONS TO BE USED WHEN MASTER MODE
  useEffect(() => {
    if (organizationList) {
      const organizationSearchArray: SearchArray = [
        { label: "", value: "" },
      ].concat(
        organizationList.map((organization) => ({
          label: organization.name,
          value: organization.organization_id,
        }))
      )
      if (organizationSearchArray)
        setFranchiseOrganizations(organizationSearchArray)
    }
  }, [destinyFranchiseId, organizationList])

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
      fetchFn: getAllExpenseGroups,
      mapFn: (group) => ({
        label: group.group_name,
        value: group.expense_group_id,
      }),
      setState: setExpenseGroups,
    },
    {
      fetchFn: getSuppliers,
      mapFn: (expense) => ({
        label: expense.name,
        value: expense.supplier_id,
      }),
      setState: setSuppliers,
    },
  ]

  useEffect(() => {
    populateArrays(
      arrayConfigs,
      account_id,
      () => setArrayPlaceHolder("Digite..."),
      (error) => {
        toast.error("Erro ao buscar dados: " + error.message)
        setArrayPlaceHolder("Erro ao carregar...")
      }
    )
  }, [])

  const permissions = [
    "expense_input_fields_expense_percentage",
    "expense_input_fields_date",
    "expense_input_fields_document",
    "expense_input_fields_description",
    "expense_input_fields_supplier_id",
    "expense_input_fields_organization_id",
    "expense_input_fields_expense_group_id",
  ]

  const {
    expense_input_fields_expense_percentage,
    expense_input_fields_date,
    expense_input_fields_document,
    expense_input_fields_description,
    expense_input_fields_supplier_id,
    expense_input_fields_organization_id,
    expense_input_fields_expense_group_id,
  } = usePermissions(permissions)

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex min-w-[500px] flex-col gap-2">
            <label htmlFor="supplier_id">Gerador da Despesa</label>
            <Input.Root variant={errors.supplier_id ? "error" : "primary"}>
              <Input.SelectInput
                name="supplier_id"
                control={control}
                disabled={!expense_input_fields_supplier_id}
                options={suppliers}
                placeholder={arrayPlaceHolder}
              />
            </Input.Root>
            {errors.supplier_id && (
              <span className="text-xs text-red-500">
                {errors.supplier_id.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="expense_group_id">Item de Despesas</label>
            <Input.Root variant={errors.expense_group_id ? "error" : "primary"}>
              <Input.SelectInput
                name="expense_group_id"
                control={control}
                disabled={!expense_input_fields_expense_group_id}
                options={expenseGroups}
                placeholder={arrayPlaceHolder}
              />
            </Input.Root>
            {errors.expense_group_id && (
              <span className="text-xs text-red-500">
                {errors.expense_group_id.message}
              </span>
            )}
          </div>

          <div className="flex max-w-[150px] flex-1 flex-col gap-2">
            <label htmlFor="date">Data</label>
            <Input.Root variant={errors.date ? "error" : "primary"}>
              <Input.Control
                disabled={!expense_input_fields_date}
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
            <label className="min-w-[600px]" htmlFor="description">
              Descrição
            </label>
            <Input.Root variant={errors.description ? "error" : "primary"}>
              <Input.Control
                disabled={!expense_input_fields_description}
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
            <label htmlFor="document">NF/Recibo</label>
            <Input.Root variant={errors.document ? "error" : "primary"}>
              <Input.Control
                disabled={!expense_input_fields_document}
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

      <div className="mt-4 flex gap-4">
        <div className="flex max-w-[100px] flex-1 flex-col gap-2">
          <label htmlFor="expense_percentage">Percentual</label>
          <Input.Root variant={errors.expense_percentage ? "error" : "primary"}>
            <Input.Control
              disabled={!expense_input_fields_expense_percentage}
              {...register("expense_percentage")}
              type="text"
            />
          </Input.Root>
          {errors.expense_percentage && (
            <span className="text-xs text-red-500">
              {errors.expense_percentage.message}
            </span>
          )}
        </div>

        <div className="flex min-w-[400px] flex-col gap-2">
          <label htmlFor="cep">Organização</label>
          <Input.Root>
            <Input.SelectInput
              name="organization_id"
              control={control}
              disabled={!expense_input_fields_organization_id}
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

        <div className="mt-4 flex items-center gap-4">
          <Input.Control
            className="flex-none"
            {...register("is_variable")}
            type="checkbox"
          />

          <label className="" htmlFor="enabled">
            Variável
          </label>
        </div>
        {errors.is_variable && (
          <span className="text-xs text-red-500">
            {errors.is_variable.message}
          </span>
        )}

        <div className="mt-4 flex items-center gap-4">
          <Input.Control
            className="flex-none"
            {...register("is_operational")}
            type="checkbox"
          />

          <label className="" htmlFor="enabled">
            Operacional
          </label>
        </div>
      </div>
      {errors.is_operational && (
        <span className="text-xs text-red-500">
          {errors.is_operational.message}
        </span>
      )}

      {masterMode && (
        <div className="mt-5 flex max-w-[1000px] gap-4">
          <div className="flex min-w-[300px] flex-col gap-2">
            <label htmlFor="destiny_franchise_id">Franqueado Destino</label>
            <Input.Root>
              <Input.SelectInput
                name="destiny_franchise_id"
                options={accounts}
                placeholder={arrayPlaceHolder}
                onChange={(value: string) => {
                  setValue("destinyFranchiseId", value)
                  setValue("destinyFranchiseBankId", "")
                }}
              />
            </Input.Root>
          </div>

          <div className="flex min-w-[300px] flex-col gap-2">
            <label htmlFor="bank_account_id">Conta do Franqueado</label>
            <Input.Root>
              <Input.SelectInput
                name="bank_account_id"
                options={
                  isLoading ?
                    [{ label: "Carragando...", value: null }]
                  : destinyFranchiseBankAccounts
                }
                placeholder="Selecione..."
                onChange={(value: string) =>
                  setValue("destinyFranchiseBankId", value)
                }
                value={destinyFranchiseBankAccountId || ""}
              />
            </Input.Root>
          </div>

          <div className="flex min-w-[300px] flex-col gap-2">
            <label htmlFor="destiny_organization_id">
              Organização do Franqueado
            </label>
            <Input.Root>
              <Input.SelectInput
                name="destiny_organization_id"
                options={
                  isLoadingOrganization ?
                    [{ label: "Carragando...", value: null }]
                  : franchiseOrganizations
                }
                placeholder="Selecione..."
                onChange={(value: string) =>
                  setValue("destinyFranchiseOrganizationId", value)
                }
                value={destinyFranchiseOrganizationId || ""}
              />
            </Input.Root>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <Button
          variant="primary"
          type="button"
          onClick={async () => {
            const isFormValid = await trigger([
              "supplier_id",
              "expense_group_id",
              "date",
              "description",
              "document",
              "expense_percentage",
              "organization_id",
            ])

            if (isFormValid) {
              setSecondPage(true)
            } else {
              toast.error("Preencha todos os campos obrigatórios")
            }
          }}>
          Avançar
        </Button>
        <Button
          type="button"
          onClick={() => push("/expenses")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </>
  )
}
