"use client"

import { SinistroStatusEnum } from "@/@types/enums/sinistroEnum"
import { Sinistro } from "@/@types/sinistro"
import { CaretDown, CaretUp, X } from "@phosphor-icons/react"
import { useState } from "react"
import { toast } from "sonner"
import { deleteSinistro } from "../../infra/remote"

type Props = {
  sinistro: Sinistro.Type
  onDelete: () => void
}

export function SinistroCard({ sinistro, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)

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
    <div
      className={`relative rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow break-words ${getStatusColor()}`}>
      {sinistro.status === SinistroStatusEnum.NOVO_SINISTRO && (
        <button
          onClick={handleDelete}
          className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors">
          <X size={16} weight="bold" />
        </button>
      )}
      
      <div className="mb-2 text-sm font-medium text-gray-700">
        {sinistro.descricaoOcorrido}
      </div>
      <div className="mb-1 text-xs font-semibold text-gray-900">
        {sinistro.numeroSinistro}
      </div>
      <div className="mb-2 text-xs text-gray-600">
        {sinistro.proposta?.seguradoNome || "-"}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-xs text-blue-600 hover:text-blue-800">
        <span>{expanded ? "Ocultar" : "Ver"} detalhes</span>
        {expanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 border-t pt-3 text-xs">
          <div>
            <span className="font-semibold">Tipo:</span>{" "}
            {sinistro.tipoSinistro?.descricao || "-"}
          </div>
          <div>
            <span className="font-semibold">Data Ocorrido:</span>{" "}
            {new Date(sinistro.dataHoraOcorrido).toLocaleDateString("pt-BR")}
          </div>
          <div>
            <span className="font-semibold">Valor Estimado:</span>{" "}
            {sinistro.valorEstimado ?
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(sinistro.valorEstimado)
            : "-"}
          </div>

          {sinistro.proposta?.seguradoraNome && (
            <div className="flex items-center gap-2">
              {sinistro.proposta.seguradoraLogo && (
                <img
                  src={sinistro.proposta.seguradoraLogo}
                  alt={sinistro.proposta.seguradoraNome}
                  className="h-6 w-6 rounded object-contain"
                />
              )}
              <div>
                <div className="font-semibold">Seguradora:</div>
                <div>{sinistro.proposta.seguradoraNome}</div>
              </div>
            </div>
          )}

          {sinistro.proposta?.corretoraNome && (
            <div className="flex items-center gap-2">
              {sinistro.proposta.corretoraLogo && (
                <img
                  src={sinistro.proposta.corretoraLogo}
                  alt={sinistro.proposta.corretoraNome}
                  className="h-6 w-6 rounded object-contain"
                />
              )}
              <div>
                <div className="font-semibold">Corretora:</div>
                <div>{sinistro.proposta.corretoraNome}</div>
              </div>
            </div>
          )}

          {sinistro.responsavelUsuario?.nome && (
            <div>
              <span className="font-semibold">Responsável:</span>{" "}
              {sinistro.responsavelUsuario.nome}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
