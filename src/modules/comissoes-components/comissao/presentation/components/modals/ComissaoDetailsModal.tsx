"use client"

import { Comissao } from "@/@types/comissao"
import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { formatDocumentNumber } from "@/core/utils/formatDocumentNumber"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { useCorretoraByIdQuery } from "@/modules/corretoras-components/edit-corretora/infra/hooks/use-corretora-by-id-query"
import { usePropostaByIdQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-by-id-query"
import { useSeguradoraByIdQuery } from "@/modules/seguradoras-components/edit-seguradora/infra/hooks/use-seguradora-by-id-query"
import { useSeguradoByIdQuery } from "@/modules/segurados-components/segurado/infra/hooks/use-segurado-by-id-query"
import { useMemo } from "react"

type Props = {
  open: boolean
  onClose: () => void
  comissao: Comissao.Type | null
}

export function ComissaoDetailsModal({ open, onClose, comissao }: Props) {
  const { data: corretora, isLoading: isLoadingCorretora } = useCorretoraByIdQuery(comissao?.corretoraId || "")
  const { data: seguradora, isLoading: isLoadingSeguradora } = useSeguradoraByIdQuery(
    comissao?.seguradoraId || ""
  )
  const { data: proposta, isLoading: isLoadingProposta } = usePropostaByIdQuery(comissao?.propostaApoliceId)

  const seguradoId = useMemo(() => {
    return proposta?.seguradoId
  }, [proposta])

  const { data: segurado, isLoading: isLoadingSegurado } = useSeguradoByIdQuery(seguradoId)

  if (!comissao) return null

  if (isLoadingCorretora || isLoadingSeguradora || isLoadingProposta || isLoadingSegurado) {
    return <LoadingScreen />
  }

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
                {comissao.dataVencimento ?
                  formatDateTime(comissao.dataVencimento).split(" ")[0]
                : "-"}
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
              <p
                className={`${
                  comissao.comissaoTotal < 0 ?
                    "font-semibold text-red-600"
                  : "text-gray-900"
                }`}>
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
              <span className="font-medium text-gray-600">Data Pagamento:</span>
              <p className="text-gray-900">
                {comissao.dataPagamento ?
                  formatDateTime(comissao.dataPagamento).split(" ")[0]
                : "-"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Criado em:</span>
              <p className="text-gray-900">
                {formatDateTime(comissao.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-700">
            Informações do Segurado
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Nome:</span>
              <p className="text-gray-900">
                {segurado?.nomeRazaoSocial || comissao.seguradoNome}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">CPF/CNPJ:</span>
              <p className="text-gray-900">
                {formatDocumentNumber(segurado?.cnpjCpf) || "N/A"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <p className="text-gray-900">{segurado?.email || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Telefone:</span>
              <p className="text-gray-900">
                {formatPhoneNumber(segurado?.telefone) || "N/A"}
              </p>
            </div>
            {segurado?.enderecoCompleto && (
              <div className="col-span-2">
                <span className="font-medium text-gray-600">Endereço:</span>
                <p className="text-gray-900">{segurado.enderecoCompleto}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-purple-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-700">
            Informações da Seguradora
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Razão Social:</span>
              <p className="text-gray-900">
                {seguradora?.razaoSocial || comissao.seguradoraNome}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">CNPJ:</span>
              <p className="text-gray-900">
                {formatDocumentNumber(seguradora?.cnpj) || "N/A"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <p className="text-gray-900">{seguradora?.email || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Telefones:</span>
              <p className="text-gray-900">
                {"Principal: " +
                  (formatPhoneNumber(seguradora?.telefone) || "N/A") +
                  " | Secundário: " +
                  (formatPhoneNumber(seguradora?.telefoneSecundario) || "N/A")}
              </p>
            </div>
            {seguradora?.endereco && (
              <div className="col-span-2">
                <span className="font-medium text-gray-600">Endereço:</span>
                <p className="text-gray-900">
                  {seguradora.endereco}, {seguradora.numero} -{" "}
                  {seguradora.bairro}, {seguradora.cidade}/{seguradora.uf} -
                  CEP: {seguradora.cep}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-orange-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-700">
            Informações da Corretora
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Razão Social:</span>
              <p className="text-gray-900">
                {corretora?.razaoSocial || comissao.corretoraNome}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">CNPJ:</span>
              <p className="text-gray-900">
                {corretora?.cnpjCpfFormatado || "N/A"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <p className="text-gray-900">{corretora?.email || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Telefones:</span>
              <p className="text-gray-900">
                {"Principal: " +
                  (formatPhoneNumber(corretora?.telefone) || "N/A") +
                  " | Secundário: " +
                  (formatPhoneNumber(corretora?.telefoneSecundario) || "N/A")}
              </p>
            </div>
            {corretora?.endereco && (
              <div className="col-span-2">
                <span className="font-medium text-gray-600">Endereço:</span>
                <p className="text-gray-900">
                  {corretora.endereco}, {corretora.numero} - {corretora.bairro},{" "}
                  {corretora.cidade}/{corretora.uf} - CEP: {corretora.cep}
                </p>
              </div>
            )}
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
