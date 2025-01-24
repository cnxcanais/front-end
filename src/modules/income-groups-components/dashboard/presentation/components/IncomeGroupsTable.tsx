"use client"

import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { getCookie } from "@/lib/cookies"
import { queryClient } from "@/lib/react-query"
import {
  deleteIncomeGroup,
  getAllIncomeGroups,
} from "@/modules/income-groups-components/remote/incomeGroup"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function IncomeGroupTable() {
  const { push } = useRouter()

  const create = getPermissionByEntity("income_groups_create")
  const edit = getPermissionByEntity("income_groups_edit")
  const deletePermission = getPermissionByEntity("income_groups_delete")

  const accountId = getCookie("accountId")

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const { data: incomeGroups, isLoading } = useQuery({
    queryKey: ["income-groups"],
    queryFn: () => getAllIncomeGroups(accountId),
  })

  const fetchIncomeGroups = useMutation({
    mutationFn: getAllIncomeGroups,
    onSuccess: () => {
      toast.success("Grupo removido com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["income-groups"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover grupo: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const handleEdit = (id: string) => {
    push(`/income-groups/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    await deleteIncomeGroup(id).then(() => fetchIncomeGroups.mutate(accountId))
  }

  const columns = [
    { header: "Nome", accessor: "group_name" },
    {
      header: "Ações",
      accessor: "income_group_id",
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
    if (incomeGroups) setFilteredResults(incomeGroups)
  }, [incomeGroups, isLoading])

  // TODO: replace Loading with proper component
  if (!incomeGroups || isLoading) return <>Loading</>

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
            data={incomeGroups}
            searchParam="group_name"
            onSearchResult={setFilteredResults}
          />
          {create && (
            <Button
              onClick={() => push("/income-groups/create")}
              variant="secondary">
              Cadastrar
            </Button>
          )}
        </div>
        <Button className="flex items-center gap-1" variant="secondary">
          <FileXls size={22} />
          Exportar
        </Button>
      </div>
      {incomeGroups.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum grupo de receitas cadastrado.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
