import { Supplier } from "@/@types/suppliers"
import { api } from "@/lib/axios"

export async function getSuppliers(account_id: string) {
  try {
    const { data } = await api.get<Supplier.GetResponse>(
      `/supplier/account/${account_id}`
    )

    return data.suppliers
  } catch (error) {
    console.info(error)
  }
}
