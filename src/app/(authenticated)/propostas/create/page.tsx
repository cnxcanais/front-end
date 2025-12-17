import { PageTitle } from "@/core/components/PageTitle"
import { PropostaForm } from "@/modules/propostas-components/propostas/presentation/components/PropostaForm"
import { Suspense } from "react"

export default function CreatePropostaPage() {
  return (
    <>
      <PageTitle content="Cadastrar Proposta" />
      <Suspense fallback={<div>Carregando...</div>}>
        <PropostaForm />
      </Suspense>
    </>
  )
}
