"use client"

import { Comissao } from "@/@types/comissao"
import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { getComissaoHistorico } from "@/modules/comissoes-components/comissao/infra/remote"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  comissao: Comissao.Type | null
}

export function ComissaoDetailsModal({ open, onClose, comissao }: Props) {
  const [historico, setHistorico] = useState<Comissao.HistoricoItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && comissao) {
      setLoading(true)
      getComissaoHistorico(comissao.id)
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
  }, [open, comissao])

  if (!comissao) return null

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR")
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
                {formatDate(comissao.dataVencimento)}
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
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-700">
            Histórico Financeiro
          </h3>
          {loading && (
            <div className="py-4 text-center text-gray-500">Carregando...</div>
          )}
          {!loading && historico.length === 0 && (
            <div className="py-4 text-center text-gray-500">
              Nenhum histórico encontrado
            </div>
          )}
          {!loading && historico.length > 0 && (
            <div className="space-y-3">
              {historico.map((item) => (
                <div
                  key={item.id}
                  className="rounded border border-gray-200 bg-white p-3">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.tipo}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(item.createdAt)} • {item.usuarioNome}
                      </p>
                    </div>
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {item.situacaoNova}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Valor:</span>{" "}
                      {formatCurrency(item.valorPago)}
                    </div>
                    <div>
                      <span className="font-medium">Data Pagamento:</span>{" "}
                      {formatDate(item.dataPagamento)}
                    </div>
                    <div>
                      <span className="font-medium">Método:</span> {item.metodo}
                    </div>
                    {item.situacaoAnterior && (
                      <div>
                        <span className="font-medium">Situação Anterior:</span>{" "}
                        {item.situacaoAnterior}
                      </div>
                    )}
                  </div>
                  {item.observacao && (
                    <p className="mt-2 text-sm text-gray-700">
                      {item.observacao}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
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
