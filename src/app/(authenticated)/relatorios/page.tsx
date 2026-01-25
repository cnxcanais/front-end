"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { ReportsPage } from "@/modules/relatorios/presentation/page"

export default function ReportsRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Relatórios" />
      <ReportsPage />
    </main>
  )
}
