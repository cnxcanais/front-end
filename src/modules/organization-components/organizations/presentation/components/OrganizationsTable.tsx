import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { Table } from "@/core/components/Table"
import { queryClient } from "@/lib/react-query"
import {
  getOrganizations,
  removeOrganization,
} from "@/modules/organization-components/organizations/infra/remote"
import { Pencil, Trash } from "@phosphor-icons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function OrganizationsTable() {
  const { push } = useRouter()
  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const accountId =
    sessionStorage.getItem("accountId") || process.env.NEXT_PUBLIC_ACCOUNT_ID

  const handleEdit = (id: string) => {
    push(`/organizations/edit/${id}`)
  }

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => getOrganizations({ accountId }),
    enabled: !!accountId,
  })

  const refetchOrganizationsFn = useMutation({
    mutationFn: getOrganizations,
    onSuccess: () => {
      toast.success("Organização removida com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["organizations"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover conta: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const handleConfirmDelete = async () => {
    await removeOrganization({ organizationId: id }).then(() =>
      refetchOrganizationsFn.mutate({ accountId })
    )
  }

  const columns = [
    { header: "Nome", accessor: "name" },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Telefone",
      accessor: "phone",
    },
    {
      header: "Endereço",
      accessor: "address",
    },
    {
      header: "CNPJ",
      accessor: "cnpj",
    },
    {
      header: "Ações",
      accessor: "organization_id",
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
  if (!organizations || isLoading) return <>Loading</>

  if (organizations.length === 0)
    return (
      <h2 className="mt-6 text-xl font-semibold">
        Nenhuma organização cadastrada.
      </h2>
    )

  return (
    <>
      <Modal
        title="Remover Organização"
        content="Você tem certeza de que deseja remover esta organização?"
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
      <Table columns={columns} data={organizations} />
    </>
  )
}
