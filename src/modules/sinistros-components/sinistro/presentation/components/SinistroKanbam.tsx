"use client"

import { SinistroStatusEnum } from "@/@types/enums/sinistroEnum"
import { Sinistro } from "@/@types/sinistro"
import { Button } from "@/core/components/Button"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { CaretDown, CaretUp } from "@phosphor-icons/react"
import { useMemo, useState } from "react"
import { useSinistroQuery } from "../../infra/hooks/use-sinistro-query"
import { CreateSinistroModal } from "./modals/CreateSinistroModal"

const COLUMNS = [
  {
    id: SinistroStatusEnum.NOVO_SINISTRO,
    title: "Novo Sinistro",
    description: "Aviso inicial registrado",
    headerColor: "text-blue-600",
  },
  {
    id: SinistroStatusEnum.EM_ANALISE,
    title: "Em Análise",
    description: "Documentação em validação",
    headerColor: "text-yellow-600",
  },
  {
    id: SinistroStatusEnum.EM_REGULACAO,
    title: "Em Regulação",
    description: "Avaliação técnica",
    headerColor: "text-orange-600",
  },
  {
    id: SinistroStatusEnum.APROVADO,
    title: "Aprovado",
    description: "Sinistro aprovado",
    headerColor: "text-green-600",
  },
  {
    id: SinistroStatusEnum.REPROVADO,
    title: "Reprovado",
    description: "Sinistro negado",
    headerColor: "text-red-600",
  },
  {
    id: SinistroStatusEnum.PAGAMENTO,
    title: "Pagamento",
    description: "Indenização em processamento",
    headerColor: "text-purple-600",
  },
  {
    id: SinistroStatusEnum.ENCERRADO,
    title: "Encerrado",
    description: "Processo finalizado",
    headerColor: "text-gray-600",
  },
]

function SinistroCard({ sinistro }: { sinistro: Sinistro.Type }) {
  const [expanded, setExpanded] = useState(false)

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
    <div className={`rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow ${getStatusColor()}`}>
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
        {expanded ?
          <CaretUp size={16} />
        : <CaretDown size={16} />}
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

export function SinistroKanbam() {
  const [modalState, setModalState] = useState({ sinistro: false })
  const { data: sinistrosData, refetch } = useSinistroQuery(1, -1)

  const sinistrosByStatus = useMemo(() => {
    const grouped: Record<SinistroStatusEnum, Sinistro.Type[]> = {
      [SinistroStatusEnum.NOVO_SINISTRO]: [],
      [SinistroStatusEnum.EM_ANALISE]: [],
      [SinistroStatusEnum.EM_REGULACAO]: [],
      [SinistroStatusEnum.APROVADO]: [],
      [SinistroStatusEnum.REPROVADO]: [],
      [SinistroStatusEnum.PAGAMENTO]: [],
      [SinistroStatusEnum.ENCERRADO]: [],
    }

    sinistrosData?.items?.forEach((sinistro) => {
      if (grouped[sinistro.status]) {
        grouped[sinistro.status].push(sinistro)
      }
    })

    return grouped
  }, [sinistrosData])

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    // TODO: Call API to update sinistro status
    console.log(
      "Move sinistro",
      draggableId,
      "from",
      source.droppableId,
      "to",
      destination.droppableId
    )
  }

  return (
    <div>
      <div className="mb-4">
        <Button onClick={() => setModalState({ sinistro: true })}>
          Criar Sinistro +
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((column) => (
            <div
              key={column.id}
              className="flex min-w-[300px] flex-col rounded-lg bg-gray-50 p-4">
              <div className="mb-4">
                <h3 className={`text-lg font-semibold ${column.headerColor}`}>{column.title}</h3>
                <p className="text-xs text-gray-600">{column.description}</p>
                <span className="mt-1 text-sm text-gray-500">
                  {sinistrosByStatus[column.id]?.length || 0} sinistro(s)
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 space-y-2 rounded-lg p-2 transition-colors ${
                      snapshot.isDraggingOver ? "bg-blue-50" : ""
                    }`}>
                    {sinistrosByStatus[column.id]?.map((sinistro, index) => (
                      <Draggable
                        key={sinistro.id}
                        draggableId={sinistro.id}
                        index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? "shadow-lg" : ""}>
                            <SinistroCard sinistro={sinistro} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <CreateSinistroModal
        open={modalState.sinistro}
        onClose={() => setModalState({ sinistro: false })}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
