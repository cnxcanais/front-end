"use client"

import { SinistroStatusEnum } from "@/@types/enums/sinistroEnum"
import { Sinistro } from "@/@types/sinistro"
import { Eye, X } from "@phosphor-icons/react"
import { useState } from "react"
import { toast } from "sonner"
import { deleteSinistro } from "../../infra/remote"
import { SinistroDetailsModal } from "./modals/SinistroDetailsModal"

type Props = {
  sinistro: Sinistro.Type
  onDelete: () => void
}

export function SinistroCard({ sinistro, onDelete }: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Tem certeza que deseja excluir o sinistro ${sinistro.numeroSinistro}?`)) {
      try {
        await deleteSinistro(sinistro.id)
        toast.success("Sinistro excluído com sucesso!")
        onDelete()
      } catch (error) {
        toast.error("Erro ao excluir sinistro")
      }
    }
  }

  const getStatusColor = () => {
    switch (sinistro.status) {
      case SinistroStatusEnum.NOVO_SINISTRO:
        return "border-l-4 border-blue-500"
      case SinistroStatusEnum.EM_ANALISE:
        return "border-l-4 border-yellow-500"
      case SinistroStatusEnum.EM_REGULACAO:
        return "border-l-4 border-orange-500"
      case SinistroStatusEnum.APROVADO:
        return "border-l-4 border-green-500"
      case SinistroStatusEnum.REPROVADO:
        return "border-l-4 border-red-500"
      case SinistroStatusEnum.PAGAMENTO:
        return "border-l-4 border-purple-500"
      case SinistroStatusEnum.ENCERRADO:
        return "border-l-4 border-gray-500"
      default:
        return "border-l-4 border-gray-300"
    }
  }

  return (
    <>
      <div
        className={`relative rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow break-words ${getStatusColor()}`}>
        <div className="absolute right-2 top-2 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDetailsOpen(true)
            }}
            className="rounded-full p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
            title="Ver detalhes">
            <Eye size={16} weight="bold" />
          </button>
          {sinistro.status === SinistroStatusEnum.NOVO_SINISTRO && (
            <button
              onClick={handleDelete}
              className="rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
              title="Excluir">
              <X size={16} weight="bold" />
            </button>
          )}
        </div>
        
        <div className="mb-2 pr-12 text-sm font-medium text-gray-700">
          {sinistro.descricaoOcorrido}
        </div>
        <div className="mb-1 text-xs font-semibold text-gray-900">
          {sinistro.numeroSinistro}
        </div>
        <div className="mb-2 text-xs text-gray-600">
          {sinistro.apolice?.seguradoNome || "-"}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(sinistro.dataHoraOcorrido).toLocaleDateString("pt-BR")}
        </div>
      </div>

      <SinistroDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        sinistro={sinistro}
      />
    </>
  )
}
