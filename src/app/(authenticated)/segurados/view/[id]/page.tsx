"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { EditSeguradoForm } from "@/modules/segurados-components/edit-segurado/presentation/components/EditSeguradoForm"
import { use } from "react"

export default function EditSeguradoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return (
    <>
      <PageTitle content="Visualizar Segurado" />
      <EditSeguradoForm id={id} readOnly />
    </>
  )
}
