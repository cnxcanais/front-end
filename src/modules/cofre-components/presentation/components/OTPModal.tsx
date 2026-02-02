"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { useState } from "react"

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: (otpCode: string) => void
  isLoading?: boolean
}

export function OTPModal({ open, onClose, onConfirm, isLoading }: Props) {
  const [otpCode, setOtpCode] = useState("")

  const handleConfirm = () => {
    if (otpCode.length === 6) {
      onConfirm(otpCode)
      setOtpCode("")
    }
  }

  return (
    <Modal title="Verificação de Segurança" open={open} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Insira o código de 6 dígitos enviado para seu e-mail. O código é
          válido por 5 minutos.
        </p>
        <div className="flex flex-col gap-4">
          <label>Código OTP</label>
          <Input.Root>
            <Input.Control
              value={otpCode}
              onChange={(e) =>
                setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              maxLength={6}
            />
          </Input.Root>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="tertiary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={otpCode.length !== 6 || isLoading}>
            Verificar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
