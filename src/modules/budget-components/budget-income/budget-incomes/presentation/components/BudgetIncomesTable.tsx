"use client"

import { Budget } from "@/@types/budgets"
import { IncomeGroup } from "@/@types/income-group"
import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { PageSelector } from "@/core/components/PageSelector"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { getAccountId } from "@/core/utils/get-account-id"
import { useBudgetIncomesQuery } from "@/modules/budget-components/budget-income/budget-incomes/infra/hooks/use-budget-incomes-query"
import { removeBudgetIncome } from "@/modules/budget-components/budget-income/budget-incomes/infra/remote"
import { IncomeBudgetFilters } from "@/modules/budget-components/budget-income/budget-incomes/presentation/components/BudgetIncomeFilters"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function IncomeBudgetTable() {
  const account_id = getAccountId()
  const [page, setPage] = useState(1)
  const [paginatedData, setPaginatedData] = useState<
    Budget.Income[] | undefined
  >([])
  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const {
    data: budgetIncomes,
    isLoading,
    refetch,
  } = useBudgetIncomesQuery(account_id)

  useEffect(() => {
    if (budgetIncomes) {
      const slicedData = budgetIncomes.slice((page - 1) * 20, page * 20)
      setPaginatedData(slicedData)
    }
  }, [page, budgetIncomes])

  const { push } = useRouter()

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const budget_incomes_create = permissions?.["budget_incomes_create"]
  const budget_incomes_edit = permissions?.["budget_incomes_edit"]
  const budget_incomes_delete = permissions?.["budget_incomes_delete"]

  // handlers for Delete and Edit
  const handleEdit = (id: string) => {
    push(`/budget/incomes/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeBudgetIncome(id)
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
      accessor: "income_group",
      render: (income_group: IncomeGroup.Type) => income_group.group_name,
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
      accessor: "budget_income_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {budget_incomes_edit && (
            <Pencil
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => handleEdit(value)}
            />
          )}
          {budget_incomes_delete && (
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

  if (!budgetIncomes || isLoading || permissionLoading || !paginatedData)
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

      <IncomeBudgetFilters account_id={account_id} />

      <div className="mt-4 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <SearchInput data={budgetIncomes} searchParam="description" />
          {budget_incomes_create && (
            <Button
              onClick={() => push("/budget/incomes/create")}
              variant="secondary">
              Cadastrar
            </Button>
          )}
        </div>
        {budgetIncomes.length > 0 && (
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
      {budgetIncomes.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum previsão de receita cadastrado.
        </h2>
      : <div>
          <Table columns={columns} data={paginatedData} />
          <PageSelector
            page={page}
            setPage={setPage}
            totalPages={Math.ceil(budgetIncomes.length / 20)}
          />
        </div>
      }
    </>
  )
}
