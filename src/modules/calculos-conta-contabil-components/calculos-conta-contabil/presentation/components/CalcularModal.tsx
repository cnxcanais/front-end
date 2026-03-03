import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { useState } from "react"
import { toast } from "sonner"
import { calcularContaContabil } from "../../infra/remote"

interface CalcularModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CalcularModal({
  open,
  onClose,
  onSuccess,
}: CalcularModalProps) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [loading, setLoading] = useState(false)
  const [ano, setAno] = useState(currentYear)
  const [mes, setMes] = useState(currentMonth)

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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Ano *</label>
            <input
              type="number"
              value={ano}
              onChange={(e) => setAno(Number(e.target.value))}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Mês *</label>
            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              className="w-full rounded border p-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
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
