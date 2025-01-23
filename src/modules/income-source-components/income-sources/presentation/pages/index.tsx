"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { IncomeSourcesTable } from "@/modules/income-source-components/income-sources/presentation/components/IncomeSourcesTable"
import { useRouter } from "next/navigation"

export function IncomeSourcesPage() {
  const { push } = useRouter()

  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Franqueados" />
      <IncomeSourcesTable />
    </main>
  )
}
