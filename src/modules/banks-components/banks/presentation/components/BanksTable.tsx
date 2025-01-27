"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getCookie } from "@/lib/cookies"
import { queryClient } from "@/lib/react-query"
import {
  getBanks,
  removeBank,
} from "@/modules/banks-components/banks/infra/remote"
import { Pencil, Trash } from "@phosphor-icons/react"
import { FileXls } from "@phosphor-icons/react/dist/ssr"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function BanksTable() {
  const account_id = getCookie("accountId")

  const { data: banks, isLoading } = useQuery({
    queryKey: ["banks"],
    queryFn: () => getBanks(account_id),
  })

  const { accounts_create, accounts_delete, accounts_edit } = JSON.parse(
    getCookie("permissions")
  ).componentAccess

  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const refetchBanks = useMutation({
    mutationFn: getBanks,
    onSuccess: () => {
      toast.success("Banco removido com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["banks"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover Banco: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const handleEdit = (id: string) => {
    push(`/banks/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    await removeBank({ bank_id: id }).then(() =>
      refetchBanks.mutate(account_id)
    )
  }

  const columns = [
    { header: "Nome", accessor: "name" },
    {
      header: "Número",
      accessor: "bank_number",
    },
    {
      header: "Ações",
      accessor: "bank_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {accounts_edit && (
            <Pencil
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => handleEdit(value)}
            />
          )}
          {accounts_delete && (
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
    if (banks) setFilteredResults(banks)
  }, [banks, isLoading])

  if (!banks || isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Banco"
        content="Você tem certeza de que deseja remover este banco?"
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
            data={banks}
            searchParam="name"
            onSearchResult={(results) => setFilteredResults(results)}
          />
          {accounts_create && (
            <Button onClick={() => push("/banks/create")} variant="secondary">
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
      {banks.length === 0 ?
        <h2 className="mt-6 text-xl font-semibold">Nenhum banco cadastrado.</h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
