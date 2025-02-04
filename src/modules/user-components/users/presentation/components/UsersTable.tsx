"use client"

import { Account } from "@/@types/accounts"
import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getAccountId } from "@/core/utils/get-account-id"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import {
  getUsers,
  removeUser,
} from "@/modules/user-components/users/infra/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function UsersTable() {
  const account_id = getAccountId()

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(account_id),
    enabled: !!account_id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const users_create = getPermissionByEntity("users_create")
  const users_edit = getPermissionByEntity("users_edit")
  const users_delete = getPermissionByEntity("users_delete")

  const handleEdit = (id: string) => {
    push(`/users/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeUser(id)
      toast.success("Usuário removido com sucesso!")
      refetch()
    } catch (error) {
      toast.error("Erro ao remover usuário: " + error)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Nome", accessor: "name" },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Conta",
      accessor: "account",
      render: (account: Account.Type) => account.name,
    },
    {
      header: "Atualizado em",
      accessor: "updated_at",
      render: (value: string) =>
        new Date(value).toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "2-digit",
          year: "numeric",
          timeZone: "Europe/Paris",
        }),
    },
    {
      header: "Ações",
      accessor: "user_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {users_edit && (
            <Pencil
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => handleEdit(value)}
            />
          )}
          {users_delete && (
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
    if (users) setFilteredResults(users)
  }, [users, isLoading])

  if (!users || isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Usuário"
        content="Você tem certeza de que deseja remover este usuário?"
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
            data={users}
            searchParam="name"
            onSearchResult={(results) => setFilteredResults(results)}
          />
          {users_create && (
            <Button onClick={() => push("/users/create")} variant="secondary">
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
      {users.length === 0 ?
        <h2 className="mt-6 text-xl font-semibold">Nenhum usuário.</h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
