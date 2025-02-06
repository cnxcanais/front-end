"use client"

import { IncomeDetailsPage } from "@/modules/income-components/income-details-components/income-details/presentation/pages"
import { Suspense } from "react"

export default function IncomeDetailsRender() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <IncomeDetailsPage />
    </Suspense>
  )
}
