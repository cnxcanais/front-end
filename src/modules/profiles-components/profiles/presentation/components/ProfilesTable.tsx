"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { Table } from "@/core/components/Table"
import { formatLocalDate } from "@/core/utils/dateFunctions"
import { getAccountId } from "@/core/utils/get-account-id"
import { useGetProfilesQuery } from "@/modules/profiles-components/profiles/infra/hooks/use-get-profiles-query"
import { Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function ProfilesTable() {
  const accountId = getAccountId()
  const { push } = useRouter()

  const [id, setId] = useState("")
  const [open, setOpen] = useState(false)

  const { data, isLoading, refetch } = useGetProfilesQuery(accountId)

  function handleEdit(profile_name: string) {
    push(`/permissions/edit/${profile_name}`)
  }

  async function handleConfirmDelete() {
    try {
      toast.success("Perfil removido com sucesso!")
      refetch()
    } catch (error) {
      toast.error("Erro ao remover perfil: " + error)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Perfil", accessor: "name" },
    {
      header: "Data Criação",
      accessor: "created_at",
      render: (value: string) => formatLocalDate(new Date(value)),
    },
    {
      header: "Data Atualização",
      accessor: "updated_at",
      render: (value: string) => formatLocalDate(new Date(value)),
    },
    {
      header: "Ações",
      accessor: "name",
      render: (name: string, row: unknown) => {
        return (
          <div className="flex space-x-4">
            <Pencil
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => handleEdit(name)}
            />

            <Trash
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => {
                setId(name)
                setOpen(true)
              }}
            />
          </div>
        )
      },
    },
  ]

  if (!data || isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Perfil de Permissão"
        content="Você tem certeza de que deseja remover este perfil?"
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
      <Table columns={columns} data={data} />
    </>
  )
}
