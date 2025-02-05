"use client"

import { IncomeDetails } from "@/@types/income-details"
import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalObservationTrigger } from "@/core/components/Modals/ModalObservation"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { getCookie } from "@/lib/cookies"
import { queryClient } from "@/lib/react-query"
import { useIncomeQuery } from "@/modules/income-components/income-components/income/infra/use-income-query"
import { IncomeFilters } from "@/modules/income-components/income-components/income/presentation/components/incomeFilters"
import {
  getIncomes,
  removeIncome,
} from "@/modules/income-components/income-components/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function IncomeTable() {
  const accountId = getCookie("accountId")

  const { data: incomes, isLoading } = useIncomeQuery(accountId)

  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const refetchIncomesFn = useMutation({
    mutationFn: getIncomes,
    onSuccess: () => {
      toast.success("Receita removida com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["incomes"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover receita: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const income_create = getPermissionByEntity("income_create")
  const income_edit = getPermissionByEntity("income_edit")
  const income_delete = getPermissionByEntity("income_delete")

  const handleEdit = (id: string) => {
    push(`/incomes/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    await removeIncome({ income_id: id }).then(() =>
      refetchIncomesFn.mutate(accountId)
    )
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
      accessor2: "group_name",
    },
    {
      header: "Parcelas",
      accessor: "income_details",
      render: (
        incomeDetails: Array<IncomeDetails.IncomeDetailsType>,
        income: IncomeDetails.IncomeDetailsType
      ) => (
        <p
          onClick={() => {
            push(`/income-details?income_id=${income.income_id}`)
          }}
          className="cursor-pointer text-blue-500 underline">
          {incomeDetails.length}
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
      accessor: "income_id",
      render: (value: string, row: unknown) => (
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
      ),
    },
  ]

  useEffect(() => {
    if (incomes) {
      setFilteredResults(incomes.incomes)
    }
  }, [incomes, isLoading])

  if (!incomes || isLoading) return <LoadingScreen />

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
      <IncomeFilters account_id={accountId} />
      <div className="mt-8 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <SearchInput
            data={incomes.incomes}
            searchParam="description"
            onSearchResult={(results) => setFilteredResults(results)}
          />
          {income_create && (
            <Button onClick={() => push("/incomes/create")} variant="secondary">
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
      {incomes.incomes.length === 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma receita cadastrada.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
