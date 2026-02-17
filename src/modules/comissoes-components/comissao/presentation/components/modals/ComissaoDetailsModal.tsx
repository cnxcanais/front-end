"use client"

import { Comissao } from "@/@types/comissao"
import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"

type Props = {
  open: boolean
  onClose: () => void
  comissao: Comissao.Type | null
}

export function ComissaoDetailsModal({ open, onClose, comissao }: Props) {
  if (!comissao) return null

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("pt-BR")
  }

  return (
    <Modal
      title={`Detalhes da Comissão - ${comissao.numeroApolice}`}
      open={open}
      onClose={onClose}
      size="large">
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-700">
            Informações da Comissão
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Segurado:</span>
              <p className="text-gray-900">{comissao.seguradoNome}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Apólice:</span>
              <p className="text-gray-900">{comissao.numeroApolice}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Parcela:</span>
              <p className="text-gray-900">{comissao.numeroParcela}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Vencimento:</span>
              <p className="text-gray-900">
                {comissao.dataVencimento ? formatDateTime(comissao.dataVencimento).split(' ')[0] : '-'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Prêmio Líquido:</span>
              <p className="text-gray-900">
                {formatCurrency(comissao.premioLiquido)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Comissão Total:</span>
              <p className="text-gray-900">
                {formatCurrency(comissao.comissaoTotal)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Valor Pago:</span>
              <p className="text-gray-900">
                {formatCurrency(comissao.valorPago)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Valor Pendente:</span>
              <p className="text-gray-900">
                {formatCurrency(comissao.valorPendente)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Situação:</span>
              <p className="text-gray-900">{comissao.situacao}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Dias Atraso:</span>
              <p className="text-gray-900">{comissao.diasAtraso}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Corretora:</span>
              <p className="text-gray-900">{comissao.corretoraNome}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Seguradora:</span>
              <p className="text-gray-900">{comissao.seguradoraNome}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Data Pagamento:</span>
              <p className="text-gray-900">
                {comissao.dataPagamento ? formatDateTime(comissao.dataPagamento).split(' ')[0] : '-'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Criado em:</span>
              <p className="text-gray-900">{formatDateTime(comissao.createdAt)}</p>
            </div>
          </div>
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
