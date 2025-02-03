"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { queryClient } from "@/lib/react-query"
import {
  getAccounts,
  removeAccount,
} from "@/modules/accounts-components/accounts/infra/remote"
import { Pencil, Trash } from "@phosphor-icons/react"
import { FileXls } from "@phosphor-icons/react/dist/ssr"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function AccountsTable() {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  })

  const accounts_create = getPermissionByEntity("accounts_create")
  const accounts_edit = getPermissionByEntity("accounts_edit")
  const accounts_delete = getPermissionByEntity("accounts_delete")

  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const fetchAccounts = useMutation({
    mutationFn: getAccounts,
    onSuccess: () => {
      toast.success("Conta removida com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover conta: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const handleEdit = (id: string) => {
    push(`/accounts/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    await removeAccount({ account_id: id }).then(() => fetchAccounts.mutate())
  }

  const columns = [
    { header: "Nome", accessor: "name" },
    {
      header: "Habilitada",
      accessor: "enabled",
      render: (value: boolean, row: unknown) => (value ? "Sim" : "Não"),
    },
    {
      header: "Última Atualização",
      accessor: "updated_at",
      render: (value: string, row: unknown) =>
        new Date(value).toLocaleDateString("pt-BR", {
          month: "2-digit",
          year: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      header: "Ações",
      accessor: "account_id",
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
    if (accounts) setFilteredResults(accounts)
  }, [accounts, isLoading])

  if (!accounts || isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Conta"
        content="Você tem certeza de que deseja remover esta conta?"
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
            data={accounts}
            searchParam="name"
            onSearchResult={(results) => setFilteredResults(results)}
          />
          {accounts_create && (
            <Button
              onClick={() => push("/accounts/create")}
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
      {accounts.length === 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma conta cadastrada.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
