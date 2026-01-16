"use client"

import { SinistroStatusEnum } from "@/@types/enums/sinistroEnum"
import { Sinistro } from "@/@types/sinistro"
import { Button } from "@/core/components/Button"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { changeSinistroStatus } from "../../infra/remote"
import { useSinistroQuery } from "../../infra/hooks/use-sinistro-query"
import { CreateSinistroModal } from "./modals/CreateSinistroModal"
import { EmAnaliseModal, type EmAnaliseData } from "./modals/EmAnaliseModal"
import { SinistroCard } from "./SinistroCard"

const COLUMNS = [
  {
    id: SinistroStatusEnum.NOVO_SINISTRO,
    title: "Novo Sinistro",
    description: "Aviso inicial registrado",
    headerColor: "text-blue-600",
    bgColor: "bg-blue-50/30",
  },
  {
    id: SinistroStatusEnum.EM_ANALISE,
    title: "Em Análise",
    description: "Documentação em validação",
    headerColor: "text-yellow-600",
    bgColor: "bg-yellow-50/30",
  },
  {
    id: SinistroStatusEnum.EM_REGULACAO,
    title: "Em Regulação",
    description: "Avaliação técnica",
    headerColor: "text-orange-600",
    bgColor: "bg-orange-50/30",
  },
  {
    id: SinistroStatusEnum.APROVADO,
    title: "Aprovado",
    description: "Sinistro aprovado",
    headerColor: "text-green-600",
    bgColor: "bg-green-50/30",
  },
  {
    id: SinistroStatusEnum.REPROVADO,
    title: "Reprovado",
    description: "Sinistro negado",
    headerColor: "text-red-600",
    bgColor: "bg-red-50/30",
  },
  {
    id: SinistroStatusEnum.PAGAMENTO,
    title: "Pagamento",
    description: "Indenização em processamento",
    headerColor: "text-purple-600",
    bgColor: "bg-purple-50/30",
  },
  {
    id: SinistroStatusEnum.ENCERRADO,
    title: "Encerrado",
    description: "Processo finalizado",
    headerColor: "text-gray-600",
    bgColor: "bg-gray-50",
  },
]

export function SinistroKanbam() {
  const [modalState, setModalState] = useState({
    sinistro: { open: false },
    emAnalise: {
      open: false,
      sinistroId: "",
      sinistroNumero: "",
      newStatus: SinistroStatusEnum.EM_ANALISE as SinistroStatusEnum,
    },
  })
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

    const newStatus = destination.droppableId as SinistroStatusEnum
    const sinistro = sinistrosData?.items?.find((s) => s.id === draggableId)

    if (!sinistro) return

    // If moving to Em Análise, open modal to collect required data
    if (newStatus === SinistroStatusEnum.EM_ANALISE) {
      setModalState({
        ...modalState,
        emAnalise: {
          open: true,
          sinistroId: draggableId,
          sinistroNumero: sinistro.numeroSinistro,
          newStatus,
        },
      })
      return
    }

    // For other status changes, update directly
    handleStatusChange(draggableId, newStatus)
  }

  const handleStatusChange = async (sinistroId: string, newStatus: SinistroStatusEnum, data?: EmAnaliseData) => {
    try {
      await changeSinistroStatus(sinistroId, {
        statusNovo: newStatus,
        // TODO: Add other fields from data if provided
      })
      toast.success("Status atualizado com sucesso!")
      refetch()
    } catch (error) {
      toast.error("Erro ao atualizar status")
    }
  }

  const handleEmAnaliseConfirm = (data: EmAnaliseData) => {
    handleStatusChange(modalState.emAnalise.sinistroId, modalState.emAnalise.newStatus, data)
    setModalState({
      ...modalState,
      emAnalise: { open: false, sinistroId: "", sinistroNumero: "", newStatus: SinistroStatusEnum.EM_ANALISE },
    })
  }

  return (
    <div>
      <div className="mb-4">
        <Button onClick={() => setModalState({ ...modalState, sinistro: { open: true } })}>
          Criar Sinistro +
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((column) => (
            <div
              key={column.id}
              className={`flex min-w-[300px] flex-col rounded-lg ${column.bgColor} p-4`}>
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
        open={modalState.sinistro.open}
        onClose={() => setModalState({ ...modalState, sinistro: { open: false } })}
        onSuccess={() => refetch()}
      />

      <EmAnaliseModal
        open={modalState.emAnalise.open}
        onClose={() =>
          setModalState({
            ...modalState,
            emAnalise: { open: false, sinistroId: "", sinistroNumero: "", newStatus: SinistroStatusEnum.EM_ANALISE },
          })
        }
        onConfirm={handleEmAnaliseConfirm}
        sinistroId={modalState.emAnalise.sinistroId}
        sinistroNumero={modalState.emAnalise.sinistroNumero}
      />
    </div>
  )
}
