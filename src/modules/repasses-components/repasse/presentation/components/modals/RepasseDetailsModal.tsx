"use client"

import { Repasse } from "@/@types/repasse"
import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import {
  getRepasseCadeia,
  getRepasseHistorico,
} from "@/modules/repasses-components/repasse/infra/remote"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  repasse: Repasse.Type | null
}

export function RepasseDetailsModal({ open, onClose, repasse }: Props) {
  const [historico, setHistorico] = useState<Repasse.HistoricoItem[]>([])
  const [cadeia, setCadeia] = useState<Repasse.CadeiaItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && repasse) {
      setLoading(true)
      Promise.all([
        getRepasseHistorico(repasse.id),
        getRepasseCadeia(repasse.apoliceId, repasse.parcelaId),
      ])
        .then(([historicoRes, cadeiaRes]) => {
          setHistorico(historicoRes.data || [])
          setCadeia(cadeiaRes.data || [])
        })
        .catch(() => {
          toast.error("Erro ao carregar dados")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [open, repasse])

  if (!repasse) return null

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
      title={`Detalhes do Repasse - ${repasse.produtorNome}`}
      open={open}
      onClose={onClose}
      size="large">
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-700">
            Informações do Repasse
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Produtor:</span>
              <p className="text-gray-900">{repasse.produtorNome}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Apólice:</span>
              <p className="text-gray-900">{repasse.numeroApolice}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Parcela:</span>
              <p className="text-gray-900">{repasse.numeroParcela}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Nível Cadeia:</span>
              <p className="text-gray-900">{repasse.nivelCadeia}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Comissão Recebida:
              </span>
              <p className="text-gray-900">
                {formatCurrency(repasse.comissaoRecebida)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Base Cálculo:</span>
              <p className="text-gray-900">{repasse.baseCalculo}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                {repasse.valorFixo ? "Valor Fixo:" : "Percentual:"}
              </span>
              <p className="text-gray-900">
                {repasse.valorFixo ?
                  formatCurrency(repasse.valorFixo)
                : `${repasse.percentual}%`}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Valor Total:</span>
              <p className="text-gray-900">
                {formatCurrency(repasse.valorTotal)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Valor Pago:</span>
              <p className="text-gray-900">
                {formatCurrency(repasse.valorPago)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Valor Pendente:</span>
              <p className="text-gray-900">
                {formatCurrency(repasse.valorPendente)}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Situação:</span>
              <p className="text-gray-900">{repasse.situacao}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Dias Atraso:</span>
              <p className="text-gray-900">{repasse.diasAtraso}</p>
            </div>
          </div>
        </div>

        {cadeia.length > 0 && (
          <div className="rounded-lg bg-purple-50 p-4">
            <h3 className="mb-3 font-semibold text-gray-700">
              Cadeia de Repasse
            </h3>
            <div className="space-y-2">
              {cadeia.map((item, index) => (
                <div
                  key={index}
                  className="rounded border border-gray-200 bg-white p-3"
                  style={{ marginLeft: `${item.nivel * 20}px` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Nível {item.nivel} - {item.produtorNome}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.baseCalculo} •{" "}
                        {item.valorFixo ?
                          formatCurrency(item.valorFixo)
                        : `${item.percentual}%`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.valorTotal)}
                      </p>
                      <p className="text-xs text-gray-600">{item.situacao}</p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Pago:</span>{" "}
                      {formatCurrency(item.valorPago)}
                    </div>
                    <div>
                      <span className="font-medium">Pendente:</span>{" "}
                      {formatCurrency(item.valorPendente)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                    {item.referenciaBancaria && (
                      <div>
                        <span className="font-medium">Referência:</span>{" "}
                        {item.referenciaBancaria}
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
