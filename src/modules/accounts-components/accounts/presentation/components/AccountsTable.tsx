import { Table } from "@/core/components/Table"
import { getAccounts } from "@/modules/accounts-components/accounts/infra/remote/get-accounts"
import { Pencil, Trash } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export function AccountsTable() {
  const { push } = useRouter()

  const handleEdit = (id: string) => {
    push(`/accounts/edit/${id}`)
  }

  const handleDelete = (id: string) => {
    console.log(`Deleting account with id: ${id}`)
  }

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  })

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
            onClick={() => handleDelete(value)}
          />
        </div>
      ),
    },
  ]

  // TODO: replace Loading with proper component
  if (!accounts || isLoading) return <>Loading</>

  return <Table columns={columns} data={accounts} />
}
