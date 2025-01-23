import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { Table } from "@/core/components/Table"
import { getCookie } from "@/lib/cookies"
import { queryClient } from "@/lib/react-query"
import {
  getIncomeSources,
  removeIncomeSource,
} from "@/modules/income-source-components/income-sources/infra/remote"
import { Pencil, Trash } from "@phosphor-icons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function IncomeSourcesTable() {
  const { push } = useRouter()
  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  // TODO: fix accountId variable to be fetched from cookies or another aux function
  const account_id = process.env.NEXT_PUBLIC_ACCOUNT_ID

  const { edit, delete: deletePermission } = JSON.parse(
    getCookie("permissions")
  ).componentAccess.income_sources

  const handleEdit = (id: string) => {
    push(`/income-sources/edit/${id}`)
  }

  const { data: incomeSources, isLoading } = useQuery({
    queryKey: ["income-sources"],
    queryFn: () => getIncomeSources({ account_id }),
    enabled: !!account_id,
  })

  const refetchIncomeSourcesFn = useMutation({
    mutationFn: getIncomeSources,
    onSuccess: () => {
      toast.success("Fonte de receita removida com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["organizations"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover fonte de receita: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const handleConfirmDelete = async () => {
    await removeIncomeSource({ income_source_id: id }).then(() =>
      refetchIncomeSourcesFn.mutate({ account_id })
    )
  }

  const columns = [
    { header: "Nome", accessor: "name" },
    {
      header: "Documento",
      accessor: "cpf_cnpj",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Cidade",
      accessor: "city",
    },
    {
      header: "UF",
      accessor: "state",
    },
    {
      header: "Contato",
      accessor: "contact_name",
    },
    {
      header: "Telefone",
      accessor: "phone",
    },
    {
      header: "Endereço",
      accessor: "address_1",
    },
    {
      header: "Ações",
      accessor: "income_source_id",
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

  // TODO: replace Loading with proper component
  if (!incomeSources || isLoading) return <>Loading</>

  if (incomeSources.length === 0)
    return (
      <h2 className="mt-6 text-xl font-semibold">
        Nenhuma fonte de receita cadastrada.
      </h2>
    )

  return (
    <>
      <Modal
        title="Remover Fonte de Receita"
        content="Você tem certeza de que deseja remover esta fonte de receita?"
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
      <Table columns={columns} data={incomeSources} />
    </>
  )
}
