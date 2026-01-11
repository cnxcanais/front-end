import { Produtor } from "@/@types/produtor"
import { emptyToNull } from "@/core/utils/emptyToNull"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createProdutor({
  telefoneFixo,
  telefoneCelular,
  telefoneComercial,
  ...rest
}: Produtor.CreateRequest) {
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

    const response = await bffApi.post("/produtores", payload)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
