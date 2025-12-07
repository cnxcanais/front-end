import { PageTitle } from "@/core/components/PageTitle"
import { PropostaForm } from "@/modules/propostas-components/propostas/presentation/components/PropostaForm"

export default function CreatePropostaPage() {
  return (
    <>
      <PageTitle content="Cadastrar Proposta" />
      <PropostaForm />
    </>
  )
}
