"use client"

import { ExpenseDetails } from "@/@types/expense-details"
import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalObservationTrigger } from "@/core/components/Modals/ModalObservation"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getAccountId } from "@/core/utils/get-account-id"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { queryClient } from "@/lib/react-query"
import { ExpenseFilters } from "@/modules/expenses-components/expense-components/expense/presentation/components/ExpenseFilters"
import { useExpenseQuery } from "@/modules/expenses-components/expense-components/infra/use-expense-query"
import {
  getExpenses,
  removeExpense,
} from "@/modules/expenses-components/expense-components/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function ExpenseTable() {
  const accountId = getAccountId()

  const { data: expenses, isLoading } = useExpenseQuery(accountId)

  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const refetchExpensesFn = useMutation({
    mutationFn: getExpenses,
    onSuccess: () => {
      toast.success("Receita removida com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover receita: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const expense_create = getPermissionByEntity("expense_create")
  const expense_edit = getPermissionByEntity("expense_edit")
  const expense_delete = getPermissionByEntity("expense_delete")

  const handleEdit = (id: string) => {
    push(`/expenses/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    await removeExpense(id).then(() => refetchExpensesFn.mutate(accountId))
  }

  const columns = [
    { header: "Documento", accessor: "document" },
    { header: "Descrição", accessor: "description" },
    {
      header: "Valor",
      accessor: "total_amount",
      render: (value: number) => {
        return value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      },
    },
    {
      header: "Cliente",
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
      accessor2: "group_name",
    },
    {
      header: "Parcelas",
      accessor: "expense_details",
      render: (
        expenseDetails: Array<ExpenseDetails.ExpenseDetailsType>,
        expense: ExpenseDetails.ExpenseDetailsType
      ) => (
        <p
          onClick={() => {
            push(`/expense-details?expense_id=${expense.expense_id}`)
          }}
          className="cursor-pointer text-blue-500 underline">
          {expenseDetails.length}
        </p>
      ),
    },
    {
      header: "Obs.",
      accessor: "observation",
      render: (value: string) => <ModalObservationTrigger content={value} />,
    },
    {
      header: "Ações",
      accessor: "expense_id",
      render: (value: string, row: unknown) => (
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
      ),
    },
  ]

  useEffect(() => {
    if (expenses) {
      setFilteredResults(expenses.expenses)
    }
  }, [expenses, isLoading])

  if (!expenses || isLoading) return <LoadingScreen />

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
      <ExpenseFilters account_id={accountId} />
      <div className="mt-8 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <SearchInput
            data={expenses.expenses}
            searchParam="description"
            onSearchResult={(results) => setFilteredResults(results)}
          />
          {expense_create && (
            <Button
              onClick={() => push("/expenses/create")}
              variant="secondary">
              Cadastrar
            </Button>
          )}
          <Button onClick={() => push("/expense-details")} variant="secondary">
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
      {expenses.expenses.length === 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma receita cadastrada.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
