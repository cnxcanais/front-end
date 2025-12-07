import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"
import { toast } from "sonner"

export async function removeProdutor(id: string) {
  try {
    await bffApi.delete(`/produtores/${id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    toast.error("Error ao remover produtor " + error.response.data.message)
    throw error
  }
}
