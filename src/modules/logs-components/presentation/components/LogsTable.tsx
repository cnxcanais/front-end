"use client"

import { User } from "@/@types/users"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { Table } from "@/core/components/Table"
import { formatLocalDate } from "@/core/utils/dateFunctions"
import { getAccountId } from "@/core/utils/get-account-id"
import { useGetLogsQuery } from "@/modules/logs-components/infra/hooks/use-get-logs-by-account-query"
import { Info } from "lucide-react"
import { useMemo, useState } from "react"
import { operationTypes, tableNames } from "../utils/parameters"
import { LogsFilters } from "./LogsFilter"

export function LogsTable() {
  const accountId = getAccountId()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)

  const [filters, setFilters] = useState<{
    start_date?: string
    end_date?: string
    user_id?: string
  }>({})

  const { data, isLoading } = useGetLogsQuery(accountId)

  const filteredData = useMemo(() => {
    return data?.filter((log) => {
      const userMatch = !filters.user_id || log.user_id === filters.user_id
      const startMatch =
        !filters.start_date ||
        new Date(log.timestamp) >= new Date(filters.start_date)
      const endMatch =
        !filters.end_date ||
        new Date(log.timestamp) <= new Date(filters.end_date)
      return userMatch && startMatch && endMatch
    })
  }, [data, filters])

  if (!data || isLoading) return <LoadingScreen />

  const handleOpenModal = (value: string | string[]) => {
    try {
      const parsedData =
        Array.isArray(value) ?
          value.map((item) => JSON.parse(item))
        : JSON.parse(value)
      setModalData(parsedData)
    } catch (error) {
      setModalData("Erro ao processar os dados")
    }
    setModalOpen(true)
  }

  const columns = [
    {
      header: "Tabela",
      accessor: "table",
      render: (value: string) => tableNames[value] || value,
    },
    {
      header: "Tipo de Operação",
      accessor: "type",
      render: (value: string) => operationTypes[value] || value,
    },
    {
      header: "Usuário",
      accessor: "user",
      render: (value: User.Type) => value.name,
    },
    {
      header: "Data",
      accessor: "timestamp",
      render: (value: string) => formatLocalDate(new Date(value)),
    },
    {
      header: "Dados",
      accessor: "value",
      render: (value: string) => (
        <Info
          size={20}
          className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 hover:text-yellow-200"
          onClick={() => handleOpenModal(value)}
        />
      ),
    },
  ]

  return (
    <>
      <Modal
        title="Detalhes do Dados"
        open={modalOpen}
        onClose={() => setModalOpen(false)}>
        <pre className="whitespace-pre-wrap rounded bg-gray-100 p-2 text-left text-sm">
          {JSON.stringify(modalData, null, 2)}
        </pre>
      </Modal>
      <LogsFilters onFilterChange={setFilters} />
      <Table columns={columns} data={filteredData} />
    </>
  )
}
