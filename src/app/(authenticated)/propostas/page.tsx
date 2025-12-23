"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { PropostasTable } from "@/modules/propostas-components/propostas/presentation/components/PropostasTable"

export default function PropostasPage() {
  return (
    <>
      <PageTitle content="Propostas" />
      <PropostasTable />
    </>
  )
}
