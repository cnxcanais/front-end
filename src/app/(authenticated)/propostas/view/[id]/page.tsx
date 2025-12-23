"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { usePropostaByIdQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-by-id-query"
import { PropostaForm } from "@/modules/propostas-components/propostas/presentation/components/PropostaForm"
import { use } from "react"

export default function ViewPropostaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: proposta, isLoading } = usePropostaByIdQuery(id)

  if (isLoading) return <div>Carregando...</div>

  return (
    <>
      <PageTitle content="Visualizar Proposta" />
      {proposta && <PropostaForm proposta={proposta} readOnly />}
    </>
  )
}
