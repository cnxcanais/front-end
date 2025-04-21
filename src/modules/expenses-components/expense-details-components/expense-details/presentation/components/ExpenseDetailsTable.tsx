"use client"

import { Expense } from "@/@types/expense"
import { ExpenseDetails } from "@/@types/expense-details"
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
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

export function ExpenseDetailsTable({ expense_id }: { expense_id?: string }) {
  const { push } = useRouter()

  const account_id = getCookie("accountId")

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [page, setPage] = useState(1)
  const [payOpen, setPayOpen] = useState(false)
  const [payId, setPayId] = useState("")
  const [paginatedData, setPaginatedData] = useState<
    ExpenseDetails.ExpenseDetailsType[] | undefined
  >([])

  // check permissions
  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const create = permissions?.["expense_details_create"]
  const pay = permissions?.["expense_details_pay"]
  const edit = permissions?.["expense_details_edit"]
  const deletePermission = permissions?.["expense_details_delete"]

  const methods = useForm<ExpenseDetails.QueryParams>({
    values: {
      expense_id,
    },
  })

  const [filters, setFilters] = useState<ExpenseDetails.QueryParams>({
    expense_id,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["expense-details", { filters }],
    queryFn: () => getExpenseDetails(account_id, { ...filters }),
  })

  useEffect(() => {
    if (data) {
      const slicedData = data.expenseDetails.slice((page - 1) * 20, page * 20)
      setPaginatedData(slicedData)
    }
  }, [page, data])

  // HANDLERS
  const handleFilterChange = (newFilters: ExpenseDetails.QueryParams) => {
    setFilters(newFilters)
  }

  const handlePay = async (expense_details_id: string) => {
    try {
      await editExpenseDetails({ expense_details_id, is_paid: true })
      toast.success("Parcela paga com sucesso!")
      setPayOpen(false)
      refetch()
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
      toast.success("Parcela removida com sucesso!")
      refetch()
    } catch (error) {
      toast.error(`Erro ao remover parcela: ${error}`)
    } finally {
      setOpen(false)
    }
  }

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
      render: (amount: number) =>
        amount && (
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
      render: (is_paid: boolean) => {
        if (is_paid === null) return ""
        else return <p>{is_paid ? "Pago" : "Em Aberto"}</p>
      },
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
      render: (value: string, row: unknown) => {
        if (value === "total") return ""
        return (
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
        )
      },
    },
    {
      header: "Quitar",
      accessor: "expense_details_id",
      render: (value: string, row: unknown) => {
        if (value === "total") return ""
        return (
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
        )
      },
    },
  ]

  const tableData = useMemo(() => {
    if (!data || !data.expenseDetails || !paginatedData) return []

    const totalAmount = data.expenseDetails.reduce(
      (acc, item) => acc + Number(item.amount || 0),
      0
    )

    const totalRow = {
      expense_details_id: "total",
      expense: { document: "TOTAL", supplier: { name: "" } },
      amount: totalAmount,
      part: "",
      is_paid: null,
      due_date: "",
      observation: "",
    }

    return [...paginatedData, totalRow]
  }, [data, paginatedData])

  const exportTableData = useMemo(() => {
    if (!data || !data.expenseDetails) return []

    const totalAmount = data.expenseDetails.reduce(
      (acc, item) => acc + Number(item.amount || 0),
      0
    )

    const totalRow = {
      expense_details_id: "total",
      expense: { document: "TOTAL", supplier: { name: "" } },
      amount: totalAmount,
      part: "",
      is_paid: null,
      due_date: "",
      observation: "",
    }

    return [...data.expenseDetails, totalRow]
  }, [data])

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

      <FormProvider {...methods}>
        <ExpenseDetailsFilters onFilterChange={handleFilterChange} />

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
            onClick={async () => await exportToExcel(exportTableData, columns)}>
            <FileXls size={22} />
            Exportar
          </Button>
        </div>
        {data.expenseDetails.length == 0 ?
          <h2 className="mt-6 text-xl font-semibold">
            Nenhuma parcela cadastrada.
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
