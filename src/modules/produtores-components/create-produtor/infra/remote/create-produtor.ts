import { Produtor } from "@/@types/produtor"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createProdutor({
  inscricaoEstadual,
  inscricaoMunicipal,
  telefoneFixo,
  complemento,
  banco,
  agencia,
  conta,
  tipoConta,
  pix,
  tipoRepasse,
  formaRepasse,
  grupos,
  grupoProdutor,
  liderGrupoId,
  observacoes,
  digito,
  ...rest
}: Produtor.CreateRequest) {
  try {
    const response = await bffApi.post("/produtores", {
      ...rest,
      inscricaoEstadual: inscricaoEstadual === "" ? null : inscricaoEstadual,
      inscricaoMunicipal: inscricaoMunicipal === "" ? null : inscricaoMunicipal,
      telefoneFixo: telefoneFixo === "" ? null : telefoneFixo,
      complemento: complemento === "" ? null : complemento,
      banco: banco === "" ? null : banco,
      agencia: agencia === "" ? null : agencia,
      conta: conta === "" ? null : conta,
      tipoConta: tipoConta === "" ? null : tipoConta,
      pix: pix === "" ? null : pix,
      tipoRepasse: tipoRepasse === "" ? null : tipoRepasse,
      formaRepasse: formaRepasse === "" ? null : formaRepasse,
      grupos: grupos === "" ? null : grupos,
      grupoProdutor: grupoProdutor === "" ? null : grupoProdutor,
      liderGrupoId: liderGrupoId === "" ? null : liderGrupoId,
      observacoes: observacoes === "" ? null : observacoes,
      digito: digito === "" ? null : digito,
    })
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
