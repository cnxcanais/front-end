import { Produtor } from "@/@types/produtor"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createProdutor({
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
  digitoConta,
  telefoneCelular,
  telefoneComercial,
  ...rest
}: Produtor.CreateRequest) {
  try {
    const telefoneFixoOnlyNumber = telefoneFixo?.replace(/\D/g, "")
    const telefoneCelularOnlyNumber = telefoneCelular?.replace(/\D/g, "")
    const telefoneComercialOnlyNumber = telefoneComercial?.replace(/\D/g, "")
    const response = await bffApi.post("/produtores", {
      ...rest,
      telefoneFixo: telefoneFixo === "" ? null : telefoneFixoOnlyNumber,
      telefoneCelular:
        telefoneCelular === "" ? null : telefoneCelularOnlyNumber,
      telefoneComercial:
        telefoneComercial === "" ? null : telefoneComercialOnlyNumber,
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
      digitoConta: digitoConta === "" ? null : digitoConta,
    })
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
