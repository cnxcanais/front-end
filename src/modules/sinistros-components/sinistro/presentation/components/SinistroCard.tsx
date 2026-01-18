"use client"

import { SinistroStatusEnum } from "@/@types/enums/sinistroEnum"
import { Sinistro } from "@/@types/sinistro"
import { CaretDown, CaretUp, Eye, X } from "@phosphor-icons/react"
import { useState } from "react"
import { toast } from "sonner"
import { deleteSinistro } from "../../infra/remote"
import { SinistroDetailsModal } from "./modals/SinistroDetailsModal"

type Props = {
  sinistro: Sinistro.Type
  onDelete: () => void
}

export function SinistroCard({ sinistro, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [andamentoExpanded, setAndamentoExpanded] = useState(false)

  const getDaysOpen = () => {
    const today = new Date()
    const occurred = new Date(sinistro.dataHoraOcorrido)
    const diffTime = Math.abs(today.getTime() - occurred.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getDaysOpenColor = () => {
    const days = getDaysOpen()
    if (days <= 3) return "bg-green-500"
    if (days <= 5) return "bg-yellow-500"
    return "bg-red-500"
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (
      window.confirm(
        `Tem certeza que deseja excluir o sinistro ${sinistro.numeroSinistro}?`
      )
    ) {
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
        className={`relative break-words rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${getStatusColor()}`}>
        <div className="absolute right-2 top-2 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDetailsOpen(true)
            }}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
            title="Ver todos os detalhes">
            <Eye size={16} weight="bold" />
          </button>
          {sinistro.status === SinistroStatusEnum.NOVO_SINISTRO && (
            <button
              onClick={handleDelete}
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
              title="Excluir">
              <X size={16} weight="bold" />
            </button>
          )}
        </div>

        <div className="mb-2 pr-12 text-sm font-medium text-gray-700">
          {sinistro.descricaoOcorrido}
        </div>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-900">
            {sinistro.numeroSinistro}
          </span>
          {sinistro.status !== SinistroStatusEnum.ENCERRADO && (
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${getDaysOpenColor()}`} />
              <span className="text-xs text-gray-600">
                {getDaysOpen()} {getDaysOpen() === 1 ? "dia" : "dias"} em aberto
              </span>
            </div>
          )}
        </div>
        <div className="mb-2 text-xs text-gray-600">
          {sinistro.apolice?.seguradoNome || "-"}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between text-xs text-blue-600 hover:text-blue-800">
          <span>{expanded ? "Ocultar" : "Ver"} resumo</span>
          {expanded ?
            <CaretUp size={16} />
          : <CaretDown size={16} />}
        </button>

        {expanded && (
          <div className="mt-3 space-y-2 border-t pt-3 text-xs">
            <div>
              <span className="font-semibold">Data Ocorrido:</span>{" "}
              {new Date(sinistro.dataHoraOcorrido).toLocaleString("pt-BR")}
            </div>
            <div>
              <span className="font-semibold">Tipo:</span>{" "}
              {sinistro.tipoSinistro?.descricao || "-"}
            </div>
            <div>
              <span className="font-semibold">Ramo e Produto:</span>{" "}
              {`${sinistro.apolice?.ramoNome} - ${sinistro.apolice?.produtoNome || "-"}`}
            </div>
            <div>
              <span className="font-semibold">Produtor:</span>{" "}
              {sinistro.apolice?.produtorNome || "-"}
            </div>
            <div>
              <span className="font-semibold">Seguradora:</span>{" "}
              {sinistro.apolice?.seguradoraNome || "-"}
            </div>
            <div>
              <span className="font-semibold">Corretora:</span>{" "}
              {sinistro.apolice?.corretoraNome || "-"}
            </div>
            <div>
              <span className="font-semibold">Andamento:</span>{" "}
              {sinistro.andamento && sinistro.andamento.length > 20 ? (
                <>
                  {andamentoExpanded ? sinistro.andamento : `${sinistro.andamento.slice(0, 20)}...`}
                  <button
                    onClick={() => setAndamentoExpanded(!andamentoExpanded)}
                    className="ml-1 text-blue-600 hover:text-blue-800">
                    {andamentoExpanded ? "-" : "+"}
                  </button>
                </>
              ) : (
                sinistro.andamento || "-"
              )}
            </div>
            <div>
              <span className="font-semibold">Data Última Tratativa:</span>{" "}
              {sinistro.dataUltimaTratativa ?
                new Date(sinistro.dataUltimaTratativa).toLocaleDateString(
                  "pt-BR"
                )
              : "-"}
            </div>
            <div>
              <span className="font-semibold">Responsável:</span>{" "}
              {sinistro.responsavelUsuario?.nome}
            </div>
          </div>
        )}
      </div>

      <SinistroDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        sinistro={sinistro}
      />
    </>
  )
}
