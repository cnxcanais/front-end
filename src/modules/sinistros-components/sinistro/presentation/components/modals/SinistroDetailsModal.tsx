"use client"

import { EntityType } from "@/@types/enums/entityType"
import { Sinistro } from "@/@types/sinistro"
import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalFilesTrigger } from "@/core/components/Modals/ModalFiles/ModalFilesTrigger"
import { formatDocumentNumber } from "@/core/utils/formatDocumentNumber"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { useCorretoraByIdQuery } from "@/modules/corretoras-components/edit-corretora/infra/hooks/use-corretora-by-id-query"
import { useProdutorByIdQuery } from "@/modules/produtores-components/edit-produtor/infra/hooks/use-produtor-by-id-query"
import { useSeguradoraByIdQuery } from "@/modules/seguradoras-components/edit-seguradora/infra/hooks/use-seguradora-by-id-query"
import { FilePdf } from "@phosphor-icons/react"
import jsPDF from "jspdf"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  sinistro: Sinistro.Type | null
  isAdmin: boolean
}

export function SinistroDetailsModal({
  open,
  onClose,
  sinistro,
  isAdmin,
}: Props) {
  const { data: corretora } = useCorretoraByIdQuery(
    sinistro?.apolice?.corretoraId || ""
  )
  const { data: produtor } = useProdutorByIdQuery(
    sinistro?.apolice?.produtorId || ""
  )
  const { data: seguradora } = useSeguradoraByIdQuery(
    sinistro?.apolice?.seguradoraId || ""
  )

  const exportToPDF = () => {
    if (!sinistro) return

    const doc = new jsPDF()
    const img = new Image()
    img.src = "/images/cnx-logo.png"

    img.onload = () => {
      doc.addImage(img, "PNG", 14, 10, 40, 15)
      doc.setFontSize(16)
      doc.text(`Detalhes do Sinistro - ${sinistro.numeroSinistro}`, 14, 35)

      let y = 45

      const addSection = (title: string, data: [string, string][]) => {
        if (y > 250) {
          doc.addPage()
          doc.addImage(img, "PNG", 14, 10, 40, 15)
          y = 35
        }
        doc.setFontSize(12)
        doc.setFont(undefined, "bold")
        doc.text(title, 14, y)
        y += 7
        doc.setFontSize(10)
        doc.setFont(undefined, "normal")
        data.forEach(([label, value]) => {
          if (y > 280) {
            doc.addPage()
            doc.addImage(img, "PNG", 14, 10, 40, 15)
            y = 35
          }
          doc.text(`${label}: ${value}`, 14, y)
          y += 5
        })
        y += 5
      }

      addSection("Informações do Sinistro", [
        ["Número", sinistro.numeroSinistro],
        ["Status", sinistro.status],
        ["Email Segurado", sinistro.emailSegurado],
        ["Data/Hora Ocorrido", formatDateTime(sinistro.dataHoraOcorrido)],
        ["Descrição", sinistro.descricaoOcorrido || "N/A"],
      ])

      addSection("Informações da Apólice", [
        ["Número Proposta", sinistro.apolice.numeroProposta],
        ["Número Apólice", sinistro.apolice.numeroApolice],
        ["Segurado", sinistro.apolice.seguradoNome],
        ["Seguradora", sinistro.apolice.seguradoraNome],
        ["Corretora", sinistro.apolice.corretoraNome],
        ["Ramo", sinistro.apolice.ramoNome],
        ["Produto", sinistro.apolice.produtoNome],
        ["Prêmio Líquido", formatCurrency(sinistro.apolice.premioLiquido)],
        ["Prêmio Total", formatCurrency(sinistro.apolice.premioTotal)],
      ])

      if (produtor) {
        addSection("Informações do Produtor", [
          ["Nome", produtor.nome || "N/A"],
          ["Email", produtor.email || "N/A"],
          ["Telefone Celular", produtor.telefoneCelular || "N/A"],
          ["CPF/CNPJ", produtor.cnpjCpf || "N/A"],
        ])
      }

      if (seguradora) {
        addSection("Informações da Seguradora", [
          ["Razão Social", seguradora.razaoSocial || "N/A"],
          ["CNPJ", formatDocumentNumber(seguradora.cnpj) || "N/A"],
          ["Email", seguradora.email || "N/A"],
        ])
      }

      if (corretora) {
        addSection("Informações da Corretora", [
          ["Razão Social", corretora.razaoSocial || "N/A"],
          ["CNPJ", corretora.cnpjCpfFormatado || "N/A"],
          ["Email", corretora.email || "N/A"],
        ])
      }

      addSection("Andamento e Valores", [
        ["Prestadora", sinistro.prestadora || "N/A"],
        ["Data Última Tratativa", formatDate(sinistro.dataUltimaTratativa)],
        ["Valor Estimado", formatCurrency(sinistro.valorEstimado)],
        ["Valor Aprovado", formatCurrency(sinistro.valorAprovado)],
        ["Forma Pagamento", sinistro.formaPagamento || "N/A"],
        ["Data Pagamento", formatDate(sinistro.dataPagamento)],
        ["Andamento", sinistro.andamento || "N/A"],
      ])

      doc.save(`sinistro-${sinistro.numeroSinistro}.pdf`)
      toast.success("PDF exportado com sucesso")
    }

    img.onerror = () => {
      toast.error("Erro ao carregar logo")
    }
  }

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

        <div className="rounded-lg bg-green-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-700">
            Informações do Produtor
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Nome:</span>
              <p className="text-gray-900">{produtor?.nome || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <p className="text-gray-900">{produtor?.email || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Telefone Celular:
              </span>
              <p className="text-gray-900">
                {produtor?.telefoneCelular || "N/A"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">CPF/CNPJ:</span>
              <p className="text-gray-900">{produtor?.cnpjCpf || "N/A"}</p>
            </div>
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
                {seguradora?.razaoSocial || "N/A"}
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
                  (formatPhoneNumber(seguradora?.telefoneSecundario) || "N/A") +
                  " | Assistencia 24h: " +
                  (formatPhoneNumber(seguradora?.telefoneAssistencia24h) ||
                    "N/A")}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Contatos:</span>
              <p className="text-gray-900">
                {"Diretor: " + seguradora?.diretor ||
                  "N/A" + "ou " + "Gerente: " + seguradora.gerente}
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
              <p className="text-gray-900">{corretora?.razaoSocial || "N/A"}</p>
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
            isAdmin={isAdmin}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={exportToPDF}
            className="flex items-center gap-2">
            <FilePdf size={16} />
            Exportar PDF
          </Button>
          <Button variant="tertiary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
