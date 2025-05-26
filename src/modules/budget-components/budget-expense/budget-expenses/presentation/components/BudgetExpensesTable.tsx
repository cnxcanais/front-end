"use client"

import { Budget } from "@/@types/budgets"
import { ExpenseGroup } from "@/@types/expense-group"
import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { PageSelector } from "@/core/components/PageSelector"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { getAccountId } from "@/core/utils/get-account-id"
import { useBudgetExpensesQuery } from "@/modules/budget-components/budget-expense/budget-expenses/infra/hooks/use-budget-expenses-query"
import { removeBudgetExpense } from "@/modules/budget-components/budget-expense/budget-expenses/infra/remote"
import { ExpenseBudgetFilters } from "@/modules/budget-components/budget-expense/budget-expenses/presentation/components/BudgetExpenseFilters"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function ExpenseBudgetTable() {
  const account_id = getAccountId()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [paginatedData, setPaginatedData] = useState<
    Budget.Expense[] | undefined
  >([])

  const {
    data: budgetExpenses,
    isLoading,
    refetch,
  } = useBudgetExpensesQuery(account_id)

  useEffect(() => {
    if (budgetExpenses) {
      const slicedData = budgetExpenses.slice((page - 1) * 20, page * 20)
      setPaginatedData(slicedData)
    }
  }, [page, budgetExpenses])

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const { push } = useRouter()

  const budget_expenses_create = permissions?.["budget_expenses_create"]
  const budget_expenses_edit = permissions?.["budget_expenses_edit"]
  const budget_expenses_delete = permissions?.["budget_expenses_delete"]

  const [filteredResults, setFilteredResults] = useState([])

  // handlers for Delete and Edit
  const handleEdit = (id: string) => {
    push(`/budget/expenses/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeBudgetExpense(id)
      toast.success("Previsão de receita removido com sucesso!")
      refetch()
    } catch (error) {
      toast.error("Erro ao remover previsão de receita: " + error)
    } finally {
      setOpen(false)
    }
  }

  // column structure for table
  const columns = [
    { header: "Descrição", accessor: "description" },
    {
      header: "Item de Receita",
      accessor: "expense_group",
      render: (expense_group: ExpenseGroup.Type) => expense_group.group_name,
    },
    {
      header: "Data",
      accessor: "date",
      render: (value: string) =>
        new Date(value).toLocaleDateString("pt-BR", {
          month: "2-digit",
          year: "numeric",
          timeZone: "Europe/Paris", // por algum motivo isso funcionou melhor
        }),
    },
    {
      header: "Valor",
      accessor: "amount",
      render: (value: number) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value),
    },
    {
      header: "Última Atualização",
      accessor: "updated_at",
      render: (value: string) => new Date(value).toLocaleDateString("pt-BR"),
    },
    {
      header: "Ações",
      accessor: "budget_expense_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {budget_expenses_edit && (
            <Pencil
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => handleEdit(value)}
            />
          )}
          {budget_expenses_delete && (
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

  if (!budgetExpenses || isLoading || permissionLoading || !paginatedData)
    return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Receita Orçada"
        content="Você tem certeza de que deseja remover esta receita do previsão?"
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

      <ExpenseBudgetFilters account_id={account_id} />

      <div className="mt-4 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <SearchInput
            data={budgetExpenses}
            searchParam="description"
            onSearchResult={setFilteredResults}
          />
          {budget_expenses_create && (
            <Button
              onClick={() => push("/budget/expenses/create")}
              variant="secondary">
              Cadastrar
            </Button>
          )}
        </div>
        {budgetExpenses.length > 0 && (
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
        )}
      </div>
      {budgetExpenses.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum previsão de despesa cadastrado.
        </h2>
      : <div>
          <Table columns={columns} data={paginatedData} />
          <PageSelector
            page={page}
            setPage={setPage}
            totalPages={Math.ceil(budgetExpenses.length / 20)}
          />
        </div>
      }
    </>
  )
}
