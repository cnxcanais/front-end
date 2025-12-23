"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { SeguradosTable } from "@/modules/segurados-components/segurado/presentation/components/SeguradosTable"

export default function SeguradosPage() {
  return (
    <>
      <PageTitle content="Segurados" />
      <SeguradosTable />
    </>
  )
}
