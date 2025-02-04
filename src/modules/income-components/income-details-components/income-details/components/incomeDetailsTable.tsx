"use client"

import { Income } from "@/@types/income"
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
import {
  deleteIncomeDetails,
  getIncomeDetails,
} from "@/modules/income-components/income-details-components/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function IncomeDetailsTable() {
  const { push } = useRouter()

  const create = getPermissionByEntity("income_groups_create")
  const edit = getPermissionByEntity("income_groups_edit")
  const deletePermission = getPermissionByEntity("income_groups_delete")

  const account_id = getCookie("accountId")

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const { data: incomeDetails, isLoading } = useQuery({
    queryKey: ["income-details"],
    queryFn: () => getIncomeDetails({ account_id }),
  })

  const fetchIncomeGroups = useMutation({
    mutationFn: getIncomeDetails,
    onSuccess: () => {
      toast.success("Parcela removida com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["income-details"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover parcela: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const handleEdit = (id: string) => {
    push(`/income-groups/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    await deleteIncomeDetails({ income_details_id: id }).then(() =>
      fetchIncomeGroups.mutate({ account_id })
    )
  }

  const columns = [
    {
      header: "Documento",
      accessor: "income",
      render: (income: Income.IncomeType) => <p>{income.document}</p>,
    },
    {
      header: "Cliente",
      accessor: "income",
      render: (income: Income.IncomeType) => <p>{income.income_source.name}</p>,
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
      render: (part: number) => <p>{`${part} / ${incomeDetails.length}`}</p>,
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
      accessor: "income_details_id",
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
  ]

  useEffect(() => {
    if (incomeDetails) setFilteredResults(incomeDetails)
  }, [incomeDetails, isLoading])

  if (!incomeDetails || isLoading) return <LoadingScreen />

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

      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-4">
          <SearchInput
            data={incomeDetails}
            searchParam="group_name"
            onSearchResult={setFilteredResults}
          />
        </div>
        <Button
          className="flex items-center gap-1"
          variant="secondary"
          onClick={exportToExcel}>
          <FileXls size={22} />
          Exportar
        </Button>
      </div>
      {incomeDetails.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum grupo de receitas cadastrado.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
