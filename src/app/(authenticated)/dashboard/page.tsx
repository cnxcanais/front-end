"use client"

import { fetchPermissionsByName } from "@/modules/dashboard-components/main-dashboard/infra/permissions"
import { MainDashboard } from "@/modules/dashboard-components/main-dashboard/presentation/pages"
import { useQuery } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashBoardRender() {
  const [roleName, setRoleName] = useState<string | null>(null)
  const pathName = usePathname()

  const getRoleName = () => {
    const storedRoleName = sessionStorage.getItem("roleName")
    if (storedRoleName) {
      setRoleName(storedRoleName)
    }
  }

  useEffect(() => {
    getRoleName()
  }, [])

  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ["permissions"],
    enabled: roleName !== null,
    queryFn: () => fetchPermissionsByName(""),
    staleTime: Infinity,
  })

  if (isLoading || isRefetching || !data) {
    return <div>Loading...</div>
  }

  if (data.urlAccess[`${pathName}`]) {
    return <MainDashboard />
  }
}
