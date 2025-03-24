import { Expense } from "@/@types/expense"
import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { PageSelector } from "@/core/components/PageSelector"
import { Table } from "@/core/components/Table"
import { formatLocalDate } from "@/core/utils/dateFunctions"
import { formatCurrency } from "@/core/utils/format-currency"
import { getAccountId } from "@/core/utils/get-account-id"
import { useExpenseDetailsQuery } from "@/modules/expenses-components/expense-details-components/infra/hooks/use-expense-details-query"
import { deleteExpenseDetails } from "@/modules/expenses-components/expense-details-components/remote"
import { editExpenseDetails } from "@/modules/expenses-components/expense-details-components/remote/update-expense-details"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { Money, Pencil, Trash } from "@phosphor-icons/react/dist/ssr"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"

export function OverdueTable() {
  const accountId = getAccountId()

  const [open, setOpen] = useState(false)
  const [payOpen, setPayOpen] = useState(false)
  const [payId, setPayId] = useState("")
  const [page, setPage] = useState(1)
  const [id, setId] = useState("")

  const { push } = useRouter()

  // check permissions
  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const pay = permissions?.["expense_details_pay"]
  const edit = permissions?.["expense_details_edit"]
  const deletePermission = permissions?.["expense_details_delete"]

  const { data, isLoading, refetch } = useExpenseDetailsQuery(accountId, {
    page,
  })

  async function handlePay(expense_details_id: string) {
    try {
      await editExpenseDetails({ expense_details_id, is_paid: true })
      toast.success("Parcela paga com sucesso!")
      setPayOpen(false)
      refetch()
    } catch (error) {
      toast.error(`Erro ao atualizar parcela: ${error}`)
    }
  }

  function handleEdit(id: string) {
    push(`/expense-details/edit/${id}`)
  }

  async function handleConfirmDelete() {
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

  const filteredData = useMemo(() => {
    return data?.expenseDetails?.filter((expenseDetail) => {
      return (
        expenseDetail.is_paid === false && expenseDetail.due_date < new Date()
      )
    })
  }, [data])

  // column structure for table
  const columns = [
    {
      header: "Documento",
      accessor: "expense",
      render: (value: Expense.ExpenseType) => value.document,
    },
    {
      header: "Cliente",
      accessor: "expense",
      render: (value: Expense.ExpenseType) => value.supplier.name,
    },
    {
      header: "Valor",
      accessor: "amount",
      render: (value: string) => formatCurrency(Number(value)),
    },
    {
      header: "Parcela",
      accessor: "part",
      render: (value: number) => value,
    },
    {
      header: "Vencimento",
      accessor: "due_date",
      render: (due_date: Date) => <p>{formatLocalDate(new Date(due_date))}</p>,
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

  if (!data || isLoading || permissionLoading || !permissions) return null

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
      {filteredData.length === 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma despesa atrasada.
        </h2>
      : <>
          <Table columns={columns} data={filteredData} />
          <PageSelector
            page={page}
            setPage={setPage}
            totalPages={data.totalPages}
          />
        </>
      }
    </>
  )
}
