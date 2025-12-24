"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { useProfileAccess } from "@/modules/perfis-components/perfis/infra/hooks/use-profile-access"
import { PropostaForm } from "@/modules/propostas-components/propostas/presentation/components/PropostaForm"
import { Suspense } from "react"

export default function CreatePropostaPage() {
  useProfileAccess(process.env.NEXT_PUBLIC_ADM_ID!)
  return (
    <>
      <PageTitle content="Cadastrar Proposta" />
      <Suspense fallback={<div>Carregando...</div>}>
        <PropostaForm />
      </Suspense>
    </>
  )
}
