import { Supplier } from "@/@types/suppliers"
import { api } from "@/lib/axios"

export async function getSupplierById(id: string) {
  try {
    const { data } = await api.get<Supplier.GetByIdResponse>(`/supplier/${id}`)

    return data.supplier
  } catch (error) {
    console.error(error)
  }
}
