"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { useState } from "react"

type Props = {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData?: any
  isLoading?: boolean
}

export function CredentialModal({
  open,
  onClose,
  onSave,
  initialData,
  isLoading,
}: Props) {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || "",
    usuario: initialData?.usuario || "",
    senha: initialData?.senha || "",
    host: initialData?.host || "",
    observacoes: initialData?.observacoes || "",
  })

  const handleSave = () => {
    onSave(formData)
    setFormData({ nome: "", usuario: "", senha: "", host: "", observacoes: "" })
  }

  return (
    <Modal
      title={initialData ? "Editar Credencial" : "Nova Credencial"}
      open={open}
      onClose={onClose}
      size="large">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <label>Nome *</label>
          <Input.Root>
            <Input.Control
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Acesso Portal Seguradora"
            />
          </Input.Root>
        </div>
        <div className="flex flex-col gap-4">
          <label>Usuário *</label>
          <Input.Root>
            <Input.Control
              value={formData.usuario}
              onChange={(e) =>
                setFormData({ ...formData, usuario: e.target.value })
              }
              placeholder="Ex: usuario.corretora"
            />
          </Input.Root>
        </div>
        <div className="flex flex-col gap-4">
          <label>Senha *</label>
          <Input.Root>
            <Input.Control
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              placeholder="Digite a senha"
            />
          </Input.Root>
        </div>
        <div className="flex flex-col gap-4">
          <label>Host/URL</label>
          <Input.Root>
            <Input.Control
              value={formData.host}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              placeholder="Ex: https://portal.seguradora.com.br"
            />
          </Input.Root>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Observações
          </label>
          <textarea
            value={formData.observacoes}
            onChange={(e) =>
              setFormData({ ...formData, observacoes: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            rows={3}
            placeholder="Informações adicionais"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="tertiary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !formData.nome ||
              !formData.usuario ||
              !formData.senha ||
              isLoading
            }>
            Salvar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
