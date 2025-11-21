import { Produtor } from "@/@types/produtor"
import { emptyToNull } from "@/core/utils/emptyToNull"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editProdutor(
  id: string,
  {
    telefoneFixo,
    telefoneCelular,
    telefoneComercial,
    ...rest
  }: Produtor.CreateRequest
) {
  try {
    const telefoneFixoOnlyNumber = telefoneFixo?.replace(/\D/g, "")
    const telefoneCelularOnlyNumber = telefoneCelular?.replace(/\D/g, "")
    const telefoneComercialOnlyNumber = telefoneComercial?.replace(/\D/g, "")

    const payload = emptyToNull({
      ...rest,
      telefoneFixo: telefoneFixoOnlyNumber,
      telefoneCelular: telefoneCelularOnlyNumber,
      telefoneComercial: telefoneComercialOnlyNumber,
    })
    await bffApi.put(`/produtores/${id}`, payload)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
