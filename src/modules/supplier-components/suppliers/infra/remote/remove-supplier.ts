import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function removeSupplier(id: string) {
  try {
    await api.delete(`/supplier/${id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
