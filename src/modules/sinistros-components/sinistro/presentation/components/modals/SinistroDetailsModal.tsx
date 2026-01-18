"use client"

import { EntityType } from "@/@types/enums/entityType"
import { Sinistro } from "@/@types/sinistro"
import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalFilesTrigger } from "@/core/components/Modals/ModalFiles/ModalFilesTrigger"

type Props = {
  open: boolean
  onClose: () => void
  sinistro: Sinistro.Type | null
}

export function SinistroDetailsModal({ open, onClose, sinistro }: Props) {
  if (!sinistro) return null

  const formatCurrency = (value: number | null) => {
    if (!value) return "N/A"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: string | null) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("pt-BR")
  }

  const formatDateTime = (date: string | null) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleString("pt-BR")
  }

  return (
    <Modal
      title={`Detalhes do Sinistro - ${sinistro.numeroSinistro}`}
      open={open}
      onClose={onClose}
      size="large">
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-700">
            Informações do Sinistro
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Número:</span>
              <p className="text-gray-900">{sinistro.numeroSinistro}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Status:</span>
              <p className="text-gray-900">{sinistro.status}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email Segurado:</span>
              <p className="text-gray-900">{sinistro.emailSegurado}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Data/Hora Ocorrido:
              </span>
              <p className="text-gray-900">
                {formatDateTime(sinistro.dataHoraOcorrido)}
              </p>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-600">
                Descrição do Ocorrido:
              </span>
              <p className="text-gray-900">
                {sinistro.descricaoOcorrido || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-700">
            Informações da Apólice
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">
                Número Proposta:
              </span>
              <p className="text-gray-900">{sinistro.apolice.numeroProposta}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Número Apólice:</span>
              <p className="text-gray-900">{sinistro.apolice.numeroApolice}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Segurado:</span>
              <p className="text-gray-900">{sinistro.apolice.seguradoNome}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Seguradora:</span>
              <p className="text-gray-900">{sinistro.apolice.seguradoraNome}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Corretora:</span>
              <p className="text-gray-900">{sinistro.apolice.corretoraNome}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Ramo:</span>
              <p className="text-gray-900">{sinistro.apolice.ramoNome}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Produto:</span>
              <p className="text-gray-900">{sinistro.apolice.produtoNome}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Tipo Documento:</span>
              <p className="text-gray-900">{sinistro.apolice.tipoDocumento}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Situação:</span>
              <p className="text-gray-900">{sinistro.apolice.situacao}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Prêmio Líquido:</span>
              <p className="text-gray-900">
                {formatCurrency(sinistro.apolice.premioLiquido)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Prêmio Total:</span>
              <p className="text-gray-900">
                {formatCurrency(sinistro.apolice.premioTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-yellow-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-700">
            Andamento e Valores
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Prestadora:</span>
              <p className="text-gray-900">{sinistro.prestadora || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Data Última Tratativa:
              </span>
              <p className="text-gray-900">
                {formatDate(sinistro.dataUltimaTratativa)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Valor Estimado:</span>
              <p className="text-gray-900">
                {formatCurrency(sinistro.valorEstimado)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Valor Aprovado:</span>
              <p className="text-gray-900">
                {formatCurrency(sinistro.valorAprovado)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Forma Pagamento:
              </span>
              <p className="text-gray-900">
                {sinistro.formaPagamento || "N/A"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Data Pagamento:</span>
              <p className="text-gray-900">
                {formatDate(sinistro.dataPagamento)}
              </p>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-600">Andamento:</span>
              <p className="text-gray-900">{sinistro.andamento || "N/A"}</p>
            </div>
          </div>
        </div>

        {(sinistro.motivoReprovacao || sinistro.justificativaReprovacao) && (
          <div className="rounded-lg bg-red-50 p-4">
            <h3 className="mb-3 font-semibold text-gray-700">Reprovação</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Motivo:</span>
                <p className="text-gray-900">
                  {sinistro.motivoReprovacao || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Justificativa:
                </span>
                <p className="text-gray-900">
                  {sinistro.justificativaReprovacao || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 flex gap-2">
          <span className="font-medium text-gray-600">Arquivos:</span>
          <ModalFilesTrigger
            entityId={sinistro.id}
            entityType={EntityType.SINISTRO}
          />
        </div>

        <div className="flex justify-end">
          <Button variant="tertiary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
