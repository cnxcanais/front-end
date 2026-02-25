import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { useState } from "react"
import { toast } from "sonner"
import { calcularContaContabil } from "../../infra/remote"

interface CalcularModalProps {
  open: boolean
  onClose: () => void
  ano: number
  mes: number
  onSuccess: () => void
}

export function CalcularModal({
  open,
  onClose,
  ano,
  mes,
  onSuccess,
}: CalcularModalProps) {
  const [loading, setLoading] = useState(false)

  const handleCalcular = async () => {
    setLoading(true)
    try {
      await calcularContaContabil(ano, mes)
      toast.success("Cálculo realizado com sucesso")
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(
        "Erro ao realizar cálculo: " + error?.response?.data?.message ||
          error.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Calcular Conta Contábil" open={open} onClose={onClose}>
      <div className="space-y-4">
        <p>
          Deseja calcular as contas contábeis para <strong>Mês {mes}</strong> de{" "}
          <strong>{ano}</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="tertiary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleCalcular} disabled={loading}>
            {loading ? "Calculando..." : "Confirmar"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
