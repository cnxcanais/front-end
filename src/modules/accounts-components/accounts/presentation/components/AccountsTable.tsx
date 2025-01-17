import { Table } from "@/core/components/Table"
import { Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"

const accounts = [
  {
    account_id: "test-01",
    name: "Conta Teste",
    enabled: true,
  },
  {
    account_id: "test-02",
    name: "Conta Teste",
    enabled: false,
  },
]

export function AccountsTable() {
  const { push } = useRouter()

  const handleEdit = (id: string) => {
    push(`/accounts/edit/${id}`)
  }

  const handleDelete = (id: string) => {
    console.log(`Deleting account with id: ${id}`)
  }

  const columns = [
    { header: "Nome", accessor: "name" },
    {
      header: "Habilitada",
      accessor: "enabled",
      render: (value: boolean, row: any) => (value ? "Sim" : "Não"),
    },
    {
      header: "Ações",
      accessor: "account_id",
      render: (value: string, row: any) => (
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

  return <Table columns={columns} data={accounts} />
}
