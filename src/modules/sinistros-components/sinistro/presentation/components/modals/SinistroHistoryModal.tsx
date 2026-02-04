"use client"

import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { getSinistroHistorico } from "@/modules/sinistros-components/sinistro/infra/remote"
import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type HistoricoItem = {
  id: string
  tipoEvento: string
  statusAnterior: string | null
  statusNovo: string | null
  dadosAlterados: Record<string, unknown>
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
    return (
      fieldNames[key] ||
      key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
    )
  }

  const formatFieldValue = (value: unknown) => {
    if (typeof value === "string") {
      return value
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    }
    return String(value)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    const img = new Image()
    img.src = "/images/cnx-logo.png"
    img.onload = () => {
      doc.addImage(img, "PNG", 14, 10, 40, 15)

      doc.setFontSize(16)
      doc.text(`Histórico - ${sinistroNumero}`, 14, 35)

      let yPosition = 45

      historico.forEach((item, index) => {
        if (yPosition > 270) {
          doc.addPage()
          doc.addImage(img, "PNG", 14, 10, 40, 15)
          yPosition = 35
        }

        // Add background color
        doc.setFillColor(
          index % 2 === 0 ? 239 : 249,
          index % 2 === 0 ? 246 : 250,
          index % 2 === 0 ? 255 : 251
        )
        const boxHeight =
          30 +
          (item.observacao ? 10 : 0) +
          (item.dadosAlterados ?
            Object.keys(item.dadosAlterados).length * 5
          : 0)
        doc.rect(10, yPosition - 5, 190, boxHeight, "F")

        doc.setFontSize(12)
        doc.setFont(undefined, "bold")
        doc.text(getEventLabel(item.tipoEvento), 14, yPosition)

        doc.setFontSize(9)
        doc.setFont(undefined, "normal")
        doc.text(
          `${formatDateTime(item.createdAt)} • ${item.usuarioNome}`,
          14,
          yPosition + 5
        )

        yPosition += 10

        if (item.statusAnterior && item.statusNovo) {
          const statusAnteriorFormatted = formatFieldValue(item.statusAnterior)
          const statusNovoFormatted = formatFieldValue(item.statusNovo)
          doc.text(
            `${statusAnteriorFormatted} -> ${statusNovoFormatted}`,
            14,
            yPosition
          )
          yPosition += 5
        }

        if (item.observacao) {
          const lines = doc.splitTextToSize(item.observacao, 180)
          doc.text(lines, 14, yPosition)
          yPosition += lines.length * 5
        }

        if (item.dadosAlterados) {
          yPosition += 2
          Object.entries(item.dadosAlterados).forEach(([key, value]) => {
            const text = `${formatFieldName(key)}: ${formatFieldValue(value)}`
            doc.text(text, 14, yPosition)
            yPosition += 5
          })
        }

        yPosition += 10
      })

      doc.save(`historico-${sinistroNumero}.pdf`)
      toast.success("PDF exportado com sucesso")
    }

    img.onerror = () => {
      toast.error("Erro ao carregar logo")
    }
  }

  return (
    <Modal
      title={`Histórico - ${sinistroNumero}`}
      open={open}
      onClose={onClose}
      size="large">
      <div className="space-y-4">
        {loading ?
          <div className="py-8 text-center text-gray-500">Carregando...</div>
        : historico.length === 0 ?
          <div className="py-8 text-center text-gray-500">
            Nenhum histórico encontrado
          </div>
        : <div className="relative space-y-4">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200" />
            {historico.map((item) => (
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
                        {Object.entries(item.dadosAlterados).map(
                          ([key, value]) => (
                            <div key={key}>
                              <span className="font-medium text-gray-700">
                                {formatFieldName(key)}:
                              </span>{" "}
                              <span className="text-gray-900">
                                {formatFieldValue(value)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        }

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="secondary"
            onClick={exportToPDF}
            disabled={loading || historico.length === 0}>
            Exportar PDF
          </Button>
          <Button variant="tertiary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
