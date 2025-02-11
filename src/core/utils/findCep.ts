import { cepApi } from "@/lib/axios"
import { toast } from "sonner"

async function findCep(cep: string) {
  try {
    const response = await cepApi.get(`/${cep}/json/`)
    return response
  } catch (error) {
    toast.error(`Erro ao encontrar CEP ${error}`)
    throw error
  }
}

export async function fetchCep(cep: string, setValue: any) {
  const { data }: any = await findCep(cep)

  if (data.cep) {
    setValue("address_1", data.logradouro)
    setValue("city", data.localidade)
    setValue("state", data.uf)
  } else {
    toast.error("CEP não encontrado")
  }
}
