"use client"

import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { getSinistroHistorico } from "@/modules/sinistros-components/sinistro/infra/remote"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type HistoricoItem = {
  id: string
  tipoEvento: string
  statusAnterior: string | null
  statusNovo: string | null
  dadosAlterados: any
  observacao: string
  usuarioId: string
  usuarioNome: string
  createdAt: string
}

type Props = {
  open: boolean
  onClose: () => void
  sinistroId: string
  sinistroNumero: string
}

export function SinistroHistoryModal({
  open,
  onClose,
  sinistroId,
  sinistroNumero,
}: Props) {
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && sinistroId) {
      setLoading(true)
      getSinistroHistorico(sinistroId)
        .then((response) => {
          setHistorico(response.data || [])
        })
        .catch(() => {
          toast.error("Erro ao carregar histórico")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [open, sinistroId])

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("pt-BR")
  }

  const getEventIcon = (tipoEvento: string) => {
    switch (tipoEvento) {
      case "criacao":
        return "🆕"
      case "mudanca_status":
        return "🔄"
      case "adicao_anexo":
        return "📎"
      default:
        return "📝"
    }
  }

  const getEventLabel = (tipoEvento: string) => {
    switch (tipoEvento) {
      case "criacao":
        return "Criação"
      case "mudanca_status":
        return "Mudança de Status"
      case "adicao_anexo":
        return "Adição de Anexo"
      default:
        return tipoEvento
    }
  }

  const formatFieldName = (key: string) => {
    const fieldNames: Record<string, string> = {
      statusNovo: "Status Novo",
      statusAnterior: "Status Anterior",
    }
    return fieldNames[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  }

  const formatFieldValue = (value: any) => {
    if (typeof value === "string") {
      return value
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    }
    return String(value)
  }

  return (
    <Modal
      title={`Histórico - ${sinistroNumero}`}
      open={open}
      onClose={onClose}
      size="large">
      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center text-gray-500">Carregando...</div>
        ) : historico.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Nenhum histórico encontrado
          </div>
        ) : (
          <div className="relative space-y-4">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200" />
            {historico.map((item, index) => (
              <div key={item.id} className="relative flex gap-4">
                <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm ring-2 ring-gray-200">
                  {getEventIcon(item.tipoEvento)}
                </div>
                <div className="flex-1 rounded-lg bg-gray-50 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {getEventLabel(item.tipoEvento)}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(item.createdAt)} • {item.usuarioNome}
                      </p>
                    </div>
                  </div>

                  {item.statusAnterior && item.statusNovo && (
                    <div className="mb-2 text-sm">
                      <span className="rounded bg-red-100 px-2 py-1 text-red-700">
                        {item.statusAnterior}
                      </span>
                      <span className="mx-2">→</span>
                      <span className="rounded bg-green-100 px-2 py-1 text-green-700">
                        {item.statusNovo}
                      </span>
                    </div>
                  )}

                  {item.observacao && (
                    <p className="text-sm text-gray-700">{item.observacao}</p>
                  )}

                  {item.dadosAlterados && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                        Ver dados alterados
                      </summary>
                      <div className="mt-2 space-y-1 rounded bg-gray-100 p-3 text-sm">
                        {Object.entries(item.dadosAlterados).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium text-gray-700">{formatFieldName(key)}:</span>{" "}
                            <span className="text-gray-900">{formatFieldValue(value)}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="tertiary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
