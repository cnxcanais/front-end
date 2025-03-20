"use client"

import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Table } from "@/core/components/Table"
import { useGetPathsAccessQuery } from "../../infra/hooks/use-get-paths-access-query"

export function PathPermissionsTable({ id }: { id: string }) {
  const { data, isLoading } = useGetPathsAccessQuery(id)
  console.log(data)

  if (!data || isLoading) return <LoadingScreen />

  const columns = [{ header: "Perfil", accessor: "name" }]

  return (
    <>
      <Table columns={columns} data={data} />
    </>
  )
}
