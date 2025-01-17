import { Table } from "@/core/components/Table"

const accounts = [
  {
    name: "Conta Teste",
    enabled: true,
  },
  {
    name: "Conta Teste",
    enabled: false,
  },
]

export function AccountsTable() {
  const columns = [
    { header: "Nome", accessor: "name" },
    {
      header: "Habilitada",
      accessor: "enabled",
      render: (value: boolean) => (value ? "Sim" : "Não"),
    },
    {
      header: "",
      accessor: "actions",
    },
  ]

  return <Table columns={columns} data={accounts} />
}
