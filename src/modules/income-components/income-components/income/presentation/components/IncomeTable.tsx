"use client"

import { Income } from "@/@types/income"
import { IncomeDetails } from "@/@types/income-details"
import { IncomeGroup } from "@/@types/income-group"
import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalFilesTrigger } from "@/core/components/Modals/ModalFiles/ModalFilesTrigger"
import { ModalObservationTrigger } from "@/core/components/Modals/ModalObservation"
import { PageSelector } from "@/core/components/PageSelector"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getAccountId } from "@/core/utils/get-account-id"
import { IncomeFilters } from "@/modules/income-components/income-components/income/presentation/components/incomeFilters"
import { useIncomeQuery } from "@/modules/income-components/income-components/infra/use-income-query"
import { removeIncome } from "@/modules/income-components/income-components/remote"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

export function IncomeTable() {
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [page, setPage] = useState(1)
  const [filteredResults, setFilteredResults] = useState([])
  const [filters, setFilters] = useState<Income.GetRequest>({})

  const accountId = getAccountId()

  const methods = useForm<Income.GetRequest>({
    defaultValues: {
      document: "",
      start_date: "",
      end_date: "",
      income_group_id: "",
      income_source_id: "",
      organization_id: "",
      income_category_id: "",
    },
  })

  const { data, isLoading, refetch } = useIncomeQuery(accountId, {
    ...filters,
    page,
  })

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const handleFilterChange = (newFilters: Income.GetRequest) => {
    setFilters(newFilters)
  }

  const income_create = permissions?.["income_create"]
  const income_edit = permissions?.["income_edit"]
  const income_delete = permissions?.["income_delete"]

  const handleEdit = (id: string) => {
    push(`/incomes/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeIncome({ income_id: id })
      refetch()
      toast.success("Receita removida com sucesso!")
    } catch (error) {
      toast.error("Erro ao remover receita: " + error)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Documento", accessor: "document" },
    { header: "Descrição", accessor: "description" },
    {
      header: "Valor Total",
      accessor: "total_amount",
      render: (value: number) => {
        if (value)
          return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })
      },
    },
    {
      header: "Valor Restante",
      accessor: "income_details",
      render: (incomeDetails: IncomeDetails.IncomeDetailsType[]) =>
        incomeDetails
          .filter((detail) => !detail.is_paid)
          .reduce((acc, curr) => Number(acc) + Number(curr.amount), 0)
          .toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    },
    {
      header: "Cliente",
      accessor: "income_source",
      accessor2: "name",
    },
    {
      header: "Data",
      accessor: "formatted_date",
    },
    {
      header: "Grupo",
      accessor: "income_group",
      render: (incomeGroup: IncomeGroup.Type) =>
        incomeGroup?.income_category.name,
    },
    {
      header: "Item",
      accessor: "income_group",
      render: (incomeGroup: IncomeGroup.Type) => incomeGroup.group_name,
    },
    {
      header: "Parcelas",
      accessor: "income_details",
      render: (
        incomeDetails: Array<IncomeDetails.IncomeDetailsType>,
        income: IncomeDetails.IncomeDetailsType
      ) => {
        if (income.income_id === "total") return ""
        return (
          <p
            onClick={() => {
              push(`/income-details?income_id=${income.income_id}`)
            }}
            className="cursor-pointer text-blue-500 underline">
            {incomeDetails.length}
          </p>
        )
      },
    },
    {
      header: "Arquivos",
      accessor: "income_id",
      render: (value: string) => {
        if (value === "total") return ""
        return <ModalFilesTrigger entityId={value} entityType={"income_id"} />
      },
    },
    {
      header: "Obs.",
      accessor: "observation",
      render: (value: string) => {
        if (value) return <ModalObservationTrigger content={value} />
      },
    },
    {
      header: "Ações",
      accessor: "income_id",
      render: (value: string, row: unknown) => {
        if (value === "total") return ""
        return (
          <div className="flex space-x-4">
            {income_edit && (
              <Pencil
                className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
                size={24}
                onClick={() => handleEdit(value)}
              />
            )}
            {income_delete && (
              <Trash
                className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
                size={24}
                onClick={() => {
                  setId(value)
                  setOpen(true)
                }}
              />
            )}
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    if (data) {
      setFilteredResults(data.incomes)
    }
  }, [data])

  const tableData = useMemo(() => {
    const totalAmount = filteredResults.reduce(
      (acc, income) => acc + (income.total_amount || 0),
      0
    )

    const totalRemaining = filteredResults.reduce((acc, income) => {
      const unpaid =
        income.income_details
          ?.filter((d) => !d.is_paid)
          .reduce((sum, d) => sum + Number(d.amount), 0) || 0
      return acc + unpaid
    }, 0)

    const summaryRow = {
      income_id: "total",
      document: "TOTAL",
      description: "",
      total_amount: totalAmount,
      income_details: [{ amount: totalRemaining, is_paid: false }],
      formatted_date: "",
      income_group: { income_category: { name: "" }, group_name: "" },
      income_source: { name: "" },
    }

    return [...filteredResults, summaryRow]
  }, [filteredResults])

  if (!data || isLoading || permissionLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Receita"
        content="Você tem certeza de que deseja remover esta receita?"
        onClose={() => setOpen(false)}
        open={open}>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={handleConfirmDelete} variant="secondary">
            Confirmar
          </Button>
          <Button onClick={() => setOpen(false)} variant="tertiary">
            Cancelar
          </Button>
        </div>
      </Modal>
      <FormProvider {...methods}>
        <IncomeFilters onFilterChange={handleFilterChange} />
        <div className="mt-8 flex items-center justify-between">
          <div className="flex h-full gap-4">
            <SearchInput
              data={data.incomes}
              searchParam="description"
              onSearchResult={(results) => setFilteredResults(results)}
            />
            {income_create && (
              <Button
                onClick={() => push("/incomes/create")}
                variant="secondary">
                Cadastrar
              </Button>
            )}
            <Button onClick={() => push("/income-details")} variant="secondary">
              Consultar Parcelas
            </Button>
          </div>
          <Button
            className="flex items-center gap-1"
            variant="secondary"
            onClick={exportToExcel}>
            <FileXls size={22} />
            Exportar
          </Button>
        </div>
        {data.incomes.length === 0 ?
          <h2 className="mt-6 text-xl font-semibold">
            Nenhuma receita cadastrada.
          </h2>
        : <div>
            <Table columns={columns} data={tableData} />
            <PageSelector
              page={page}
              setPage={setPage}
              totalPages={data.totalPages}
            />
          </div>
        }
      </FormProvider>
    </>
  )
}
