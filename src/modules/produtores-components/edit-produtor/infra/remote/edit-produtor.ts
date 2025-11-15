import { Produtor } from "@/@types/produtor"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editProdutor(id: string, {
  inscricaoEstadual,
  inscricaoMunicipal,
  telefoneFixo,
  complemento,
  banco,
  agencia,
  conta,
  tipoConta,
  digito,
  pix,
  tipoRepasse,
  formaRepasse,
  grupos,
  grupoProdutor,
  liderGrupoId,
  observacoes,
  ...rest
}: Produtor.UpdateRequest) {
  try {
    await bffApi.put(`/produtores/${id}`, {
      ...rest,
      inscricaoEstadual: inscricaoEstadual === "" ? null : inscricaoEstadual,
      inscricaoMunicipal: inscricaoMunicipal === "" ? null : inscricaoMunicipal,
      telefoneFixo: telefoneFixo === "" ? null : telefoneFixo,
      complemento: complemento === "" ? null : complemento,
      banco: banco === "" ? null : banco,
      agencia: agencia === "" ? null : agencia,
      conta: conta === "" ? null : conta,
      tipoConta: tipoConta === "" ? null : tipoConta,
      digito: digito === "" ? null : digito,
      pix: pix === "" ? null : pix,
      tipoRepasse: tipoRepasse === "" ? null : tipoRepasse,
      formaRepasse: formaRepasse === "" ? null : formaRepasse,
      grupos: grupos === "" ? null : grupos,
      grupoProdutor: grupoProdutor === "" ? null : grupoProdutor,
      liderGrupoId: liderGrupoId === "" ? null : liderGrupoId,
      observacoes: observacoes === "" ? null : observacoes,
    })
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
