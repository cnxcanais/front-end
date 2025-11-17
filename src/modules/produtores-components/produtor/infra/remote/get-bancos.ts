import { toast } from "sonner"

type Banco = {
  ispb: string
  name: string
  code: string
  fullName: string
}

export async function getBancos() {
  try {
    const response = await fetch("https://brasilapi.com.br/api/banks/v1")
    const data = await response.json()
    return data as Banco[]
  } catch (error) {
    console.info(error)
    toast.error("Erro ao carregar bancos.")
  }
}
