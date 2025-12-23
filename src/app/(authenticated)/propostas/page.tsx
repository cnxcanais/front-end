"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { PropostasTable } from "@/modules/propostas-components/propostas/presentation/components/PropostasTable"
import { Suspense } from "react"

export default function PropostasPage() {
  return (
    <>
      <PageTitle content="Propostas" />
      <Suspense fallback={<div>Carregando...</div>}>
        <PropostasTable />
      </Suspense>
    </>
  )
}
