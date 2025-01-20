import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { Table } from "@/core/components/Table"
import { queryClient } from "@/lib/react-query"
import {
  getAccounts,
  removeAccount,
} from "@/modules/accounts-components/accounts/infra/remote"
import { Pencil, Trash } from "@phosphor-icons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function AccountsTable() {
  const { push } = useRouter()
  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const handleEdit = (id: string) => {
    push(`/accounts/edit/${id}`)
  }

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  })

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

  const handleConfirmDelete = async () => {
    await removeAccount({ accountId: id }).then(() => fetchAccounts.mutate())
  }

  const columns = [
    { header: "Nome", accessor: "name" },
    {
      header: "Habilitada",
      accessor: "enabled",
      render: (value: boolean, row: unknown) => (value ? "Sim" : "Não"),
    },
    {
      header: "Ações",
      accessor: "account_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          <Pencil
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
            size={24}
            onClick={() => handleEdit(value)}
          />
          <Trash
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
            size={24}
            onClick={() => {
              setId(value)
              setOpen(true)
            }}
          />
        </div>
      ),
    },
  ]

  // TODO: replace Loading with proper component
  if (!accounts || isLoading) return <>Loading</>

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
      <Table columns={columns} data={accounts} />
    </>
  )
}
