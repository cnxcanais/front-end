import { Produtor } from "@/@types/produtor"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editProdutor(
  id: string,
  {
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
    observacoes,
    ...rest
  }: Produtor.UpdateRequest
) {
  try {
    await bffApi.put(`/produtores/${id}`, {
      ...rest,

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
      observacoes: observacoes === "" ? null : observacoes,
    })
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
