"use client"

import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Table } from "@/core/components/Table"
import { getAccountId } from "@/core/utils/get-account-id"
import { useGetPermissionsQuery } from "@/modules/permissions-components/permissions/infra/hooks/use-get-permissions-query"

export function EntityPermissionsTable({
  profile_name,
}: {
  profile_name: string
}) {
  const accountId = getAccountId()

  const { data, isLoading } = useGetPermissionsQuery(accountId, profile_name)

  if (!data || isLoading) return <LoadingScreen />

  const columns = [{ header: "Perfil", accessor: "name" }]

  const tableData = Array.isArray(data) ? data : [data]

  return (
    <>
      <Table columns={columns} data={tableData} />
    </>
  )
}
