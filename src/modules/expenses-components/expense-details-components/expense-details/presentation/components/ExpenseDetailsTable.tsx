"use client"

import { Expense } from "@/@types/expense"
import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalObservationTrigger } from "@/core/components/Modals/ModalObservation"
import { PageSelector } from "@/core/components/PageSelector"
import { Table } from "@/core/components/Table"
import { formatLocalDate } from "@/core/utils/dateFunctions"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getCookie } from "@/lib/cookies"
import { ExpenseDetailsFilters } from "@/modules/expenses-components/expense-details-components/expense-details/presentation/components/ExpenseDetailsFilters"
import {
  deleteExpenseDetails,
  getExpenseDetails,
} from "@/modules/expenses-components/expense-details-components/remote"
import { editExpenseDetails } from "@/modules/expenses-components/expense-details-components/remote/update-expense-details"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { FileXls, Money, Pencil, Trash } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function ExpenseDetailsTable() {
  const { push } = useRouter()

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const create = permissions?.["expense_details_create"]
  const pay = permissions?.["expense_details_pay"]
  const edit = permissions?.["expense_details_edit"]
  const deletePermission = permissions?.["expense_details_delete"]

  const searchParams = useSearchParams()

  const expense_id = searchParams.get("expense_id") ?? undefined

  const account_id = getCookie("accountId")

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [page, setPage] = useState(1)
  const [payOpen, setPayOpen] = useState(false)
  const [payId, setPayId] = useState("")

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["expense-details", expense_id],
    queryFn: () =>
      expense_id ?
        getExpenseDetails(account_id, { page, expense_id })
      : getExpenseDetails(account_id, { page }),
  })

  const handlePay = async (expense_details_id: string) => {
    try {
      await editExpenseDetails({ expense_details_id, is_paid: true })
      refetch()
      setPayOpen(false)
      toast.success("Parcela paga com sucesso!")
    } catch (error) {
      toast.error(`Erro ao atualizar parcela: ${error}`)
    }
  }

  const handleEdit = (id: string) => {
    push(`/expense-details/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteExpenseDetails(id)
      refetch()
      toast.success("Parcela removida com sucesso!")
    } catch (error) {
      toast.error(`Erro ao remover parcela: ${error}`)
    }
  }

  useEffect(() => {
    if (page) refetch()
  }, [page])

  const columns = [
    {
      header: "Documento",
      accessor: "expense",
      render: (expense: Expense.ExpenseType) => <p>{expense.document}</p>,
    },
    {
      header: "Cliente",
      accessor: "expense",
      render: (expense: Expense.ExpenseType) => <p>{expense.supplier.name}</p>,
    },

    {
      header: "Valor",
      accessor: "amount",
      render: (amount: string) => (
        <p>
          {Number(amount).toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      ),
    },
    {
      header: "Parc.",
      accessor: "part",
      render: (part: number) => <p>{part}</p>,
    },
    {
      header: "Pgto",
      accessor: "is_paid",
      render: (is_paid: boolean) => <p>{is_paid ? "Pago" : "Em Aberto"}</p>,
    },
    {
      header: "Vencimento",
      accessor: "due_date",
      render: (due_date: Date) => <p>{formatLocalDate(new Date(due_date))}</p>,
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
      accessor: "expense_details_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {edit && (
            <Pencil
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => handleEdit(value)}
            />
          )}

          {deletePermission && (
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
    {
      header: "Quitar",
      accessor: "expense_details_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {pay && (
            <Money
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => {
                setPayId(value)
                setPayOpen(true)
              }}
            />
          )}
        </div>
      ),
    },
  ]

  if (!data?.expenseDetails || isLoading || permissionLoading)
    return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Parcela"
        content="Você tem certeza de que deseja remover esta parcela?"
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

      <Modal
        title="Quitar Parcela"
        content="Você tem certeza de que deseja quitar esta parcela?"
        onClose={() => setOpen(false)}
        open={payOpen}>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={() => handlePay(payId)} variant="secondary">
            Confirmar
          </Button>
          <Button onClick={() => setPayOpen(false)} variant="tertiary">
            Cancelar
          </Button>
        </div>
      </Modal>

      <ExpenseDetailsFilters account_id={account_id} expense_id={expense_id} />

      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-4">
          <Button onClick={() => push("/expenses")} variant="secondary">
            Voltar
          </Button>

          {expense_id && (
            <Button
              variant="secondary"
              onClick={() => push(`/expense-details/create/${expense_id}`)}
              disabled={!create}>
              Adicionar Parcela
            </Button>
          )}
        </div>

        <Button
          className="flex items-center gap-1"
          variant="secondary"
          onClick={exportToExcel}>
          <FileXls size={22} />
          Exportar
        </Button>
      </div>
      {data.expenseDetails.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma parcela cadastrada.
        </h2>
      : <div>
          <Table columns={columns} data={data.expenseDetails} />
          <PageSelector
            page={page}
            setPage={setPage}
            totalPages={data.totalPages}
          />
        </div>
      }
    </>
  )
}
