import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { Table } from "@/core/components/Table"
import { getCookie } from "@/lib/cookies"
import { queryClient } from "@/lib/react-query"
import {
  deleteIncomeGroup,
  getAllIncomeGroups,
} from "@/modules/income-groups-components/remote/grupoReceitas"
import { Pencil, Trash } from "@phosphor-icons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function IncomeGroupTable() {
  const { push } = useRouter()
  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const handleEdit = (id: string) => {
    push(`/income-groups/edit/${id}`)
  }

  const permission = getCookie("permission")
  const accountId = getCookie("accountId")

  const getIncomeGroups = () => {
    const response = getAllIncomeGroups(accountId)
    console.log(response)
    return response
  }
  console.log(getIncomeGroups)

  const { data, isLoading } = useQuery({
    queryKey: ["income-groups"],
    queryFn: getIncomeGroups,
  })

  const fetchIncomeGroups = useMutation({
    mutationFn: getIncomeGroups,
    onSuccess: () => {
      toast.success("Grupo removida com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["income-groups"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover conta: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const handleConfirmDelete = async () => {
    await deleteIncomeGroup(id).then(() => fetchIncomeGroups.mutate())
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
      accessor: "income_group_id",
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
  if (!data || isLoading) return <>Loading</>

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
      <Table columns={columns} data={data} />
    </>
  )
}
