"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { SeguradosTable } from "@/modules/segurados-components/segurado/presentation/components/SeguradosTable"
import { Suspense } from "react"

export default function SeguradosPage() {
  return (
    <>
      <PageTitle content="Segurados" />
      <Suspense fallback={<div>Carregando...</div>}>
        <SeguradosTable />
      </Suspense>
    </>
  )
}
