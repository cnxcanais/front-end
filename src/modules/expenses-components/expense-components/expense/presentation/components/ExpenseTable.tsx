"use client"

import { Expense } from "@/@types/expense"
import { ExpenseDetails } from "@/@types/expense-details"
import { ExpenseGroup } from "@/@types/expense-group"
import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalFilesTrigger } from "@/core/components/Modals/ModalFiles/ModalFilesTrigger"
import { ModalObservationTrigger } from "@/core/components/Modals/ModalObservation"
import { PageSelector } from "@/core/components/PageSelector"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { getAccountId } from "@/core/utils/get-account-id"
import { ExpenseFilters } from "@/modules/expenses-components/expense-components/expense/presentation/components/ExpenseFilters"
import { useExpenseQuery } from "@/modules/expenses-components/expense-components/infra/use-expense-query"
import { removeExpense } from "@/modules/expenses-components/expense-components/remote"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

export function ExpenseTable() {
  const accountId = getAccountId()

  const { push } = useRouter()

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [page, setPage] = useState(1)
  const [paginatedData, setPaginatedData] = useState<
    Expense.ExpenseType[] | undefined
  >([])

  // filters state
  const [filters, setFilters] = useState<Expense.GetRequestParams>({ page })

  const methods = useForm<Expense.GetRequestParams>({
    defaultValues: {
      document: "",
      end_date: "",
      expense_group_id: "",
      organization_id: "",
      start_date: "",
      supplier_id: "",
      expense_category_id: "",
    },
  })

  const expense_create = permissions?.["expense_create"]
  const expense_edit = permissions?.["expense_edit"]
  const expense_delete = permissions?.["expense_delete"]

  const { data, isLoading, refetch } = useExpenseQuery(accountId, {
    ...filters,
  })

  useEffect(() => {
    if (data) {
      const slicedData = data.expenses.slice((page - 1) * 20, page * 20)
      setPaginatedData(slicedData)
    }
  }, [page, data])

  const handleFilterChange = (newFilters: Expense.GetRequestParams) => {
    setFilters(newFilters)
  }

  const handleEdit = (id: string) => {
    push(`/expenses/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeExpense(id)
      toast.success("Despesa removida com sucesso!")
      refetch()
    } catch (error) {
      toast.error("Erro ao remover despesa: " + error)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Documento", accessor: "document" },
    { header: "Descrição", accessor: "description" },
    {
      header: "Valor",
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
      accessor: "expense_details",
      render: (expenseDetails: ExpenseDetails.ExpenseDetailsType[]) =>
        expenseDetails
          ?.filter((detail) => !detail.is_paid)
          .reduce((acc, curr) => acc + Number(curr.amount), 0)
          .toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    },
    {
      header: "Fornecedor",
      accessor: "supplier",
      accessor2: "name",
    },
    {
      header: "Data",
      accessor: "formatted_date",
    },
    {
      header: "Grupo",
      accessor: "expense_group",
      render: (expenseGroup: ExpenseGroup.Type) =>
        expenseGroup?.expense_category.name,
    },
    {
      header: "Item",
      accessor: "expense_group",
      render: (expenseGroup: ExpenseGroup.Type) => expenseGroup.group_name,
    },
    {
      header: "Parcelas",
      accessor: "expense_details",
      render: (
        expenseDetails: Array<ExpenseDetails.ExpenseDetailsType>,
        expense: ExpenseDetails.ExpenseDetailsType
      ) => {
        if (expense.expense_id === "total") return ""
        return (
          <p
            onClick={() => {
              push(`/expense-details?expense_id=${expense?.expense_id}`)
            }}
            className="cursor-pointer text-blue-500 underline">
            {expenseDetails?.length}
          </p>
        )
      },
    },
    {
      header: "Arquivos",
      accessor: "expense_id",
      render: (value: string) => {
        if (value === "total") return ""
        return <ModalFilesTrigger entityId={value} entityType={"expense_id"} />
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
      accessor: "expense_id",
      render: (value: string, row: unknown) => {
        if (value === "total") return ""
        return (
          <div className="flex space-x-4">
            {expense_edit && (
              <Pencil
                className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
                size={24}
                onClick={() => handleEdit(value)}
              />
            )}
            {expense_delete && (
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

  const tableData = useMemo(() => {
    if (!data || !data.expenses || !paginatedData) return []

    const totalAmount = data.expenses.reduce(
      (acc, expense) => acc + (expense.total_amount || 0),
      0
    )

    const totalRemaining = data.expenses.reduce((acc, expense) => {
      const unpaid =
        expense.expense_details
          ?.filter((d) => !d.is_paid)
          .reduce((sum, d) => sum + Number(d.amount), 0) || 0
      return acc + unpaid
    }, 0)

    const summaryRow = {
      expense_id: "total",
      document: "TOTAL",
      description: "",
      total_amount: totalAmount,
      expense_details: [{ amount: totalRemaining, is_paid: false }],
      formatted_date: "",
      expense_group: { expense_category: { name: "" }, group_name: "" },
      supplier: { name: "" },
    }

    return [...paginatedData, summaryRow]
  }, [paginatedData, page, data])

  const exportTableData = useMemo(() => {
    if (!data || !data.expenses) return []

    const totalAmount = data.expenses.reduce(
      (acc, expense) => acc + (expense.total_amount || 0),
      0
    )

    const totalRemaining = data.expenses.reduce((acc, expense) => {
      const unpaid =
        expense.expense_details
          ?.filter((d) => !d.is_paid)
          .reduce((sum, d) => sum + Number(d.amount), 0) || 0
      return acc + unpaid
    }, 0)

    const summaryRow = {
      expense_id: "total",
      document: "TOTAL",
      description: "",
      total_amount: totalAmount,
      expense_details: [{ amount: totalRemaining, is_paid: false }],
      formatted_date: "",
      expense_group: { expense_category: { name: "" }, group_name: "" },
      supplier: { name: "" },
    }

    return [...data.expenses, summaryRow]
  }, [data])

  if (!data || isLoading || permissionLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Despesa"
        content="Você tem certeza de que deseja remover esta despesa?"
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
        <ExpenseFilters onFilterChange={handleFilterChange} />
        <div className="mt-8 flex items-center justify-between">
          <div className="flex h-full gap-4">
            <SearchInput data={data.expenses} searchParam="description" />
            {expense_create && (
              <Button
                onClick={() => push("/expenses/create")}
                variant="secondary">
                Cadastrar
              </Button>
            )}
            <Button
              onClick={() => push("/expense-details")}
              variant="secondary">
              Consultar Parcelas
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ExportTableToPDFButton
              filename="meu-relatorio"
              options={{ orientation: "portrait" }}
              className="bg-red-500">
              Exportar PDF
            </ExportTableToPDFButton>
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={exportNoPagination}>
              <FileXls size={22} />
              Exportar
            </Button>
          </div>
        </div>
        {data.expenses.length === 0 ?
          <h2 className="mt-6 text-xl font-semibold">
            Nenhuma despesa cadastrada.
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
