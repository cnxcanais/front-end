"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { getCookie } from "@/lib/cookies"
import { queryClient } from "@/lib/react-query"
import {
  deleteExpenseGroup,
  getAllExpenseGroups,
} from "@/modules/expense-groups-components/remote/expense-groups-methods"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function ExpenseGroupTable() {
  const { push } = useRouter()

  const create = getPermissionByEntity("expense_groups_create")
  const edit = getPermissionByEntity("expense_groups_edit")
  const deletePermission = getPermissionByEntity("expense_groups_delete")

  const accountId = getCookie("accountId")

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const { data: expenseGroups, isLoading } = useQuery({
    queryKey: ["expense-groups"],
    queryFn: () => getAllExpenseGroups(accountId),
  })

  const fetchExpenseGroups = useMutation({
    mutationFn: getAllExpenseGroups,
    onSuccess: () => {
      toast.success("Grupo removido com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["expense-groups"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover grupo: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const handleEdit = (id: string) => {
    push(`/expense-groups/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    await deleteExpenseGroup(id).then(() =>
      fetchExpenseGroups.mutate(accountId)
    )
  }

  const columns = [
    { header: "Nome", accessor: "group_name" },
    {
      header: "Ações",
      accessor: "expense_group_id",
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
    if (expenseGroups) setFilteredResults(expenseGroups)
  }, [expenseGroups, isLoading])

  if (!expenseGroups || isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Grupo"
        content="Você tem certeza de que deseja remover este grupo?"
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
        <div className="flex h-full gap-4">
          <SearchInput
            data={expenseGroups}
            searchParam="group_name"
            onSearchResult={setFilteredResults}
          />
          {create && (
            <Button
              onClick={() => push("/expense-groups/create")}
              variant="secondary">
              Cadastrar
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
      {expenseGroups.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum grupo de receitas cadastrado.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
