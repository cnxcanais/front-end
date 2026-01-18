"use client"

import { SinistroStatusEnum } from "@/@types/enums/sinistroEnum"
import { Sinistro } from "@/@types/sinistro"
import { Button } from "@/core/components/Button"
import { getCookie } from "@/lib/cookies"
import { useUsuarioQuery } from "@/modules/usuarios-components/usuario/infra/hooks/use-usuario-query"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useSinistroQuery } from "../../infra/hooks/use-sinistro-query"
import { changeSinistroStatus } from "../../infra/remote"
import { BackwardJustificationModal } from "./modals/BackwardJustificationModal"
import { CreateSinistroModal } from "./modals/CreateSinistroModal"
import { EmAnaliseModal } from "./modals/EmAnaliseModal"
import { EmRegulacaoModal } from "./modals/RegulacaoModal"
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
    emRegulacao: {
      open: false,
      sinistroId: "",
      sinistroNumero: "",
      newStatus: SinistroStatusEnum.EM_REGULACAO as SinistroStatusEnum,
    },
    backward: {
      open: false,
      sinistroId: "",
      sinistroNumero: "",
      fromStatus: "",
      toStatus: "",
      newStatus: SinistroStatusEnum.NOVO_SINISTRO as SinistroStatusEnum,
    },
  })
  const { data: sinistrosData, refetch } = useSinistroQuery(1, -1)
  const { data: usuarios } = useUsuarioQuery()
  const corretoraId = getCookie("corretoraId")
  const userId = getCookie("userId")
  const user = usuarios?.data.find((u) => u.props?.id === userId)
  const isAdmin = user?.props?.perfilId === process.env.NEXT_PUBLIC_ADM_ID

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

    // const filteredSinistros = isAdmin
    //   ? sinistrosData?.items || []
    //   : sinistrosData?.items.filter(
    //       (s) => s.apolice.corretoraId === corretoraId
    //     ) || []

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
    const oldStatus = source.droppableId as SinistroStatusEnum
    const sinistro = sinistrosData?.items?.find((s) => s.id === draggableId)

    if (!sinistro) return

    // Check if movement is only to neighbor columns
    const sourceIndex = COLUMNS.findIndex((col) => col.id === oldStatus)
    const destIndex = COLUMNS.findIndex((col) => col.id === newStatus)

    if (Math.abs(destIndex - sourceIndex) > 1) {
      toast.error("Você só pode mover para colunas vizinhas")
      return
    }

    // Check if moving backwards
    const isMovingBackward = destIndex < sourceIndex

    if (isMovingBackward) {
      setModalState({
        ...modalState,
        backward: {
          open: true,
          sinistroId: draggableId,
          sinistroNumero: sinistro.numeroSinistro,
          fromStatus: COLUMNS[sourceIndex].title,
          toStatus: COLUMNS[destIndex].title,
          newStatus,
        },
      })
      return
    }

    // If moving to Em Análise, open modal to collect required data
    switch (newStatus) {
      case SinistroStatusEnum.EM_ANALISE:
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
      case SinistroStatusEnum.EM_REGULACAO:
        setModalState({
          ...modalState,
          emRegulacao: {
            open: true,
            sinistroId: draggableId,
            sinistroNumero: sinistro.numeroSinistro,
            newStatus,
          },
        })
        return
    }

    // For other status changes, update directly
    changeSinistroStatus(draggableId, { statusNovo: newStatus })
      .then(() => {
        toast.success("Status atualizado com sucesso!")
        refetch()
      })
      .catch(() => toast.error("Erro ao atualizar status"))
  }

  const handleForwardConfirm = (status: SinistroStatusEnum) => {
    const baseStatus = {
      sinistroId: "",
      sinistroNumero: "",
      open: false,
    }
    switch (status) {
      case SinistroStatusEnum.EM_ANALISE:
        setModalState({
          ...modalState,
          emAnalise: {
            ...baseStatus,
            newStatus: SinistroStatusEnum.EM_ANALISE,
          },
        })
        break
      case SinistroStatusEnum.EM_REGULACAO:
        setModalState({
          ...modalState,
          emRegulacao: {
            ...baseStatus,
            newStatus: SinistroStatusEnum.EM_REGULACAO,
          },
        })
        break
    }
    refetch()
  }

  const handleBackwardConfirm = (justification: string) => {
    changeSinistroStatus(modalState.backward.sinistroId, {
      statusNovo: modalState.backward.newStatus,
      observacao: justification,
    })
      .then(() => {
        toast.success("Sinistro retornado com sucesso!")
        setModalState({
          ...modalState,
          backward: {
            open: false,
            sinistroId: "",
            sinistroNumero: "",
            fromStatus: "",
            toStatus: "",
            newStatus: SinistroStatusEnum.NOVO_SINISTRO,
          },
        })
        refetch()
      })
      .catch(() => toast.error("Erro ao retornar sinistro"))
  }

  return (
    <div>
      <div className="mb-4">
        <Button
          onClick={() =>
            setModalState({ ...modalState, sinistro: { open: true } })
          }>
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
                <h3 className={`text-lg font-semibold ${column.headerColor}`}>
                  {column.title}
                </h3>
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
                            <SinistroCard
                              sinistro={sinistro}
                              onDelete={() => refetch()}
                            />
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
        onClose={() =>
          setModalState({ ...modalState, sinistro: { open: false } })
        }
        onSuccess={() => refetch()}
        isAdmin={isAdmin || false}
      />

      <EmAnaliseModal
        open={modalState.emAnalise.open}
        onClose={() =>
          setModalState({
            ...modalState,
            emAnalise: {
              open: false,
              sinistroId: "",
              sinistroNumero: "",
              newStatus: SinistroStatusEnum.EM_ANALISE,
            },
          })
        }
        onConfirm={() => handleForwardConfirm(SinistroStatusEnum.EM_ANALISE)}
        sinistroId={modalState.emAnalise.sinistroId}
        sinistroNumero={modalState.emAnalise.sinistroNumero}
      />

      <EmRegulacaoModal
        open={modalState.emRegulacao.open}
        onClose={() =>
          setModalState({
            ...modalState,
            emRegulacao: {
              open: false,
              sinistroId: "",
              sinistroNumero: "",
              newStatus: SinistroStatusEnum.EM_REGULACAO,
            },
          })
        }
        onConfirm={() => handleForwardConfirm(SinistroStatusEnum.EM_REGULACAO)}
        isAdmin={isAdmin || false}
        usuarios={usuarios}
        sinistroId={modalState.emRegulacao.sinistroId}
        sinistroNumero={modalState.emRegulacao.sinistroNumero}
      />

      <BackwardJustificationModal
        open={modalState.backward.open}
        onClose={() =>
          setModalState({
            ...modalState,
            backward: {
              open: false,
              sinistroId: "",
              sinistroNumero: "",
              fromStatus: "",
              toStatus: "",
              newStatus: SinistroStatusEnum.NOVO_SINISTRO,
            },
          })
        }
        onConfirm={handleBackwardConfirm}
        fromStatus={modalState.backward.fromStatus}
        toStatus={modalState.backward.toStatus}
        sinistroNumero={modalState.backward.sinistroNumero}
      />
    </div>
  )
}
