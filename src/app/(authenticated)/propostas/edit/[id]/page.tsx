"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { usePropostaByIdQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-by-id-query"
import { PropostaForm } from "@/modules/propostas-components/propostas/presentation/components/PropostaForm"
import { useParams } from "next/navigation"

export default function EditPropostaPage() {
  const params = useParams()
  const id = params.id as string
  const { data: proposta, isLoading } = usePropostaByIdQuery(id)

  if (isLoading) return <div>Carregando...</div>

  return (
    <>
      <PageTitle content="Editar Proposta" />
      {proposta && <PropostaForm proposta={proposta} isEdit />}
    </>
  )
}
