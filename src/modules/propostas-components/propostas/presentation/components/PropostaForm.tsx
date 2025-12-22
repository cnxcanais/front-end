"use client"

import { Button } from "@/core/components/Button"
import { addMonthsToDate } from "@/core/utils/dateFunctions"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { useProdutoQuery } from "@/modules/produtos-components/produtos/infra/hooks/use-produto-query"
import { useRamoQuery } from "@/modules/ramos-components/ramos/infra/hooks/use-ramo-query"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { useSeguradoQuery } from "@/modules/segurados-components/segurado/infra/hooks/use-segurado-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Proposta } from "../../../../../@types/proposta"
import { usePropostaByIdQuery } from "../../infra/hooks/use-proposta-by-id-query"
import { createProposta, updateProposta } from "../../infra/remote"
import { propostaFormSchema, PropostaFormSchema } from "../validation/schema"
import { ParcelasModal } from "./ParcelasModal"
import {
  ApoliceEndossoTab,
  ComissaoTab,
  PremioParcelasTab,
  PropostaTab,
  RepassesTab,
  RevisaoTab,
  VeiculoTab,
  VigenciaTab,
} from "./tabs"

interface PropostaFormProps {
  proposta?: Proposta
  isEdit?: boolean
}

export function PropostaForm({ proposta, isEdit }: PropostaFormProps) {
  const searchParams = useSearchParams()
  const duplicateFromId = searchParams.get("duplicateFrom")
  const isEndosso = searchParams.get("endosso") === "true"
  const isRenovacao = searchParams.get("renovacao") === "true"
  const endossoData =
    isEndosso ?
      {
        dataEmissao: searchParams.get("dataEmissao") || "",
        numeroEndosso: searchParams.get("numeroEndosso") || "",
        inicioVigencia: searchParams.get("inicioVigencia") || "",
        fimVigencia: searchParams.get("fimVigencia") || "",
      }
    : null
  const renovacaoData =
    isRenovacao ?
      {
        dataEmissao: searchParams.get("dataEmissao") || "",
        numeroApolice: searchParams.get("numeroApolice") || "",
        inicioVigencia: searchParams.get("inicioVigencia") || "",
        fimVigencia: searchParams.get("fimVigencia") || "",
      }
    : null
  const { data: propostaToDuplicate } = usePropostaByIdQuery(duplicateFromId)

  const [activeTab, setActiveTab] = useState(0)
  const [showParcelasModal, setShowParcelasModal] = useState(false)
  const [numParcelasInput, setNumParcelasInput] = useState("")
  const [dataPrimeiroVencimento, setDataPrimeiroVencimento] = useState("")

  const sourceData = propostaToDuplicate || proposta

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    reset,
    control,
    formState: { errors },
  } = useForm<PropostaFormSchema>({
    resolver: zodResolver(propostaFormSchema),
    defaultValues: {
      numeroProposta: propostaToDuplicate ? "" : proposta?.numeroProposta || "",
      seguradoId: sourceData?.seguradoId || "",
      corretoraId: sourceData?.corretoraId || "",
      produtorId: sourceData?.produtorId || "",
      seguradoraId: sourceData?.seguradoraId || "",
      ramoId: sourceData?.ramoId || "",
      produtoId: sourceData?.produtoId || "",
      placaVeiculo: sourceData?.placaVeiculo || "",
      chassiVeiculo: sourceData?.chassiVeiculo || "",
      modeloVeiculo: sourceData?.modeloVeiculo || "",
      marcaVeiculo: sourceData?.marcaVeiculo || "",
      anoFabricacaoVeiculo: sourceData?.anoFabricacaoVeiculo || undefined,
      anoModeloVeiculo: sourceData?.anoModeloVeiculo || undefined,
      complementoItem: sourceData?.complementoItem || "",
      tipoDocumento: "Proposta",
      origem: sourceData?.origem || "Manual",
      situacao: "Ativo",
      inicioVigencia: sourceData?.inicioVigencia || "",
      fimVigencia: sourceData?.fimVigencia || "",
      dataEmissao: sourceData?.dataEmissao || "",
      numeroApolice: sourceData?.numeroApolice || "",
      motivoNaoRenovacao: sourceData?.motivoNaoRenovacao || "",
      percentualComissao: sourceData?.percentualComissao || undefined,
      comissaoSobre: (sourceData?.comissaoSobre as any) || "Premio Liquido",
      formaComissao: sourceData?.formaComissao || "Na Parcela",
      valorComissao: sourceData?.valorComissao || undefined,
      premioLiquido: sourceData?.premioLiquido || undefined,
      valoresAdicionais: sourceData?.valoresAdicionais || undefined,
      iof: sourceData?.iof || undefined,
      parcelas:
        sourceData?.parcelas?.map((p) => ({
          numeroParcela: p.numeroParcela,
          dataVencimento: p.dataVencimento,
          valor: Number(p.valor),
          valorLiquido: Number(p.valorLiquido),
          percentualCorretora: Number(p.percentualCorretora),
          previsaoRecebimento: p.previsaoRecebimento,
          situacao: p.situacao,
        })) || [],
      repasses:
        sourceData?.repasses?.map((r) => ({
          produtorId: r.produtorId,
          percentualRepasse: Number(r.percentualRepasse),
          repasseSobre: r.repasseSobre as any,
          formaRepasse: r.formaRepasse as any,
        })) || [],
    },
  })

  const formData = watch()

  const { push } = useRouter()
  const { data: segurados } = useSeguradoQuery(1, -1, { status: "ATIVO" })
  const { data: corretoras } = useCorretoraQuery(1, -1)
  const { data: produtores } = useProdutorQuery(1, -1)
  const { data: seguradoras } = useSeguradoraQuery(1, -1)
  const { data: ramos } = useRamoQuery(1, -1)
  const { data: produtos } = useProdutoQuery(1, -1)

  const produtosOptions = useMemo(() => {
    if (!produtos?.data || !formData.ramoId) return []
    return produtos.data
      .filter((p) => p.ramoId === formData.ramoId)
      .map((p) => ({ text: p.descricao, value: p.id }))
  }, [produtos, formData.ramoId])

  useEffect(() => {
    if (formData.inicioVigencia && !isEdit) {
      const inicio = new Date(formData.inicioVigencia)
      inicio.setFullYear(inicio.getFullYear() + 1)
      setValue("fimVigencia", inicio.toISOString().split("T")[0])
    }
  }, [formData.inicioVigencia, isEdit])

  useEffect(() => {
    if (propostaToDuplicate) {
      const tipoDoc =
        isEndosso ? "Endosso"
        : isRenovacao ? "Renovação"
        : "Proposta"
      const numProposta =
        isEndosso || isRenovacao ? propostaToDuplicate.numeroProposta : ""

      reset({
        numeroProposta: numProposta,
        seguradoId: propostaToDuplicate.seguradoId,
        corretoraId: propostaToDuplicate.corretoraId,
        produtorId: propostaToDuplicate.produtorId,
        seguradoraId: propostaToDuplicate.seguradoraId,
        ramoId: propostaToDuplicate.ramoId,
        produtoId: propostaToDuplicate.produtoId,
        placaVeiculo: propostaToDuplicate.placaVeiculo,
        chassiVeiculo: propostaToDuplicate.chassiVeiculo,
        modeloVeiculo: propostaToDuplicate.modeloVeiculo,
        marcaVeiculo: propostaToDuplicate.marcaVeiculo,
        anoFabricacaoVeiculo: propostaToDuplicate.anoFabricacaoVeiculo,
        anoModeloVeiculo: propostaToDuplicate.anoModeloVeiculo,
        complementoItem: propostaToDuplicate.complementoItem,
        tipoDocumento: tipoDoc,
        origem: propostaToDuplicate.origem,
        situacao: "Ativo",
        inicioVigencia:
          isEndosso && endossoData ? endossoData.inicioVigencia
          : isRenovacao && renovacaoData ? renovacaoData.inicioVigencia
          : propostaToDuplicate.inicioVigencia,
        fimVigencia:
          isEndosso && endossoData ? endossoData.fimVigencia
          : isRenovacao && renovacaoData ? renovacaoData.fimVigencia
          : propostaToDuplicate.fimVigencia,
        dataEmissao:
          isEndosso && endossoData ? endossoData.dataEmissao
          : isRenovacao && renovacaoData ? renovacaoData.dataEmissao
          : propostaToDuplicate.dataEmissao,
        numeroApolice:
          isRenovacao && renovacaoData ?
            renovacaoData.numeroApolice
          : propostaToDuplicate.numeroApolice,

        motivoNaoRenovacao: propostaToDuplicate.motivoNaoRenovacao,
        percentualComissao: propostaToDuplicate.percentualComissao,
        comissaoSobre: propostaToDuplicate.comissaoSobre as any,
        formaComissao: propostaToDuplicate.formaComissao,
        valorComissao: propostaToDuplicate.valorComissao,
        premioLiquido: propostaToDuplicate.premioLiquido,
        valoresAdicionais: propostaToDuplicate.valoresAdicionais,
        iof: propostaToDuplicate.iof,
        parcelas:
          propostaToDuplicate.parcelas?.map((p) => ({
            numeroParcela: p.numeroParcela,
            dataVencimento: p.dataVencimento,
            valor: Number(p.valor),
            valorLiquido: Number(p.valorLiquido),
            percentualCorretora: Number(p.percentualCorretora),
            previsaoRecebimento: p.previsaoRecebimento,
            situacao: p.situacao,
          })) || [],
        repasses:
          propostaToDuplicate.repasses?.map((r) => ({
            produtorId: r.produtorId,
            percentualRepasse: Number(r.percentualRepasse),
            repasseSobre: r.repasseSobre as any,
            formaRepasse: r.formaRepasse as any,
          })) || [],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propostaToDuplicate])

  useEffect(() => {
    const premio = Number(formData.premioLiquido) || 0
    const adicionais = Number(formData.valoresAdicionais) || 0
    const iof = Number(formData.iof) || 0
    const comissao = (premio * Number(formData.percentualComissao)) / 100
    setValue("valorComissao", Number(comissao.toFixed(2)))
  }, [formData.premioLiquido, formData.percentualComissao])

  const handleGenerateParcelas = () => {
    const numParcelas = Number(numParcelasInput)
    const vencimentoPrimeiraParcela = new Date(dataPrimeiroVencimento)
    if (!numParcelas || numParcelas < 1) {
      toast.error("Informe um número válido de parcelas")
      return
    }

    const premioTotal =
      Number(formData.premioLiquido) +
      Number(formData.valoresAdicionais || 0) +
      Number(formData.iof || 0)
    const valorParcela = premioTotal / numParcelas
    const valorLiquido = Number(formData.premioLiquido) / numParcelas

    const parcelas = Array.from({ length: numParcelas }, (_, i) => {
      const dataVencimento = addMonthsToDate(vencimentoPrimeiraParcela, i)
        .toISOString()
        .slice(0, 10)

      return {
        numeroParcela: i + 1,
        valor: valorParcela,
        valorLiquido: valorLiquido,
        dataVencimento: dataVencimento,
        percentualCorretora: formData.percentualComissao ?? null,
        previsaoRecebimento: dataVencimento,
        situacao: "Pendente",
      }
    })

    setValue("parcelas", parcelas)
    setShowParcelasModal(false)
    setNumParcelasInput("")
    toast.success("Parcelas geradas com sucesso!")
  }

  const handleNextTab = async () => {
    let fieldsToValidate: any[] = []

    switch (activeTab) {
      case 0:
        fieldsToValidate = [
          "numeroProposta",
          "seguradoId",
          "corretoraId",
          "produtorId",
          "seguradoraId",
          "ramoId",
          "tipoDocumento",
          "origem",
        ]
        break
      case 1:
        if (isAutomovelRamo) {
          fieldsToValidate = []
        } else {
          fieldsToValidate = ["inicioVigencia", "fimVigencia"]
        }
        break
      case 2:
        if (isAutomovelRamo) {
          fieldsToValidate = ["inicioVigencia", "fimVigencia"]
        } else {
          fieldsToValidate = []
        }
        break
      case 3:
        if (isAutomovelRamo) {
          fieldsToValidate = []
        } else {
          fieldsToValidate = ["premioLiquido"]
          if (formData.parcelas.length === 0) {
            toast.error("Gere as parcelas antes de avançar")
            return
          }
          if (formData.parcelas.length > 0) {
            const hasEmptyDates = formData.parcelas.some(
              (p: any) => !p.dataVencimento || !p.previsaoRecebimento
            )
            if (hasEmptyDates) {
              toast.error(
                "Preencha o vencimento e previsão de recebimento de todas as parcelas"
              )
              return
            }
          }
        }
        break
      case 4:
        if (isAutomovelRamo) {
          fieldsToValidate = ["premioLiquido"]
          if (formData.parcelas.length === 0) {
            toast.error("Gere as parcelas antes de avançar")
            return
          }
          if (formData.parcelas.length > 0) {
            const hasEmptyDates = formData.parcelas.some(
              (p: any) => !p.dataVencimento || !p.previsaoRecebimento
            )
            if (hasEmptyDates) {
              toast.error(
                "Preencha o vencimento e previsão de recebimento de todas as parcelas"
              )
              return
            }
          }
        } else {
          fieldsToValidate = [
            "percentualComissao",
            "comissaoSobre",
            "formaComissao",
            "valorComissao",
          ]
        }
        break
      case 5:
        if (isAutomovelRamo) {
          fieldsToValidate = [
            "percentualComissao",
            "comissaoSobre",
            "formaComissao",
            "valorComissao",
          ]
        } else {
          if (formData.repasses.length > 0) {
            const hasInvalidRepasse = formData.repasses.some(
              (r: any) =>
                !r.produtorId ||
                r.percentualRepasse === undefined ||
                r.percentualRepasse === null ||
                !r.repasseSobre ||
                !r.formaRepasse
            )
            if (hasInvalidRepasse) {
              toast.error("Preencha todos os campos obrigatórios dos repasses")
            }
          }
          fieldsToValidate = ["repasses"]
        }
        break
      case 6:
        if (isAutomovelRamo) {
          if (formData.repasses.length > 0) {
            const hasInvalidRepasse = formData.repasses.some(
              (r: any) =>
                !r.produtorId ||
                r.percentualRepasse === undefined ||
                r.percentualRepasse === null ||
                !r.repasseSobre ||
                !r.formaRepasse
            )
            if (hasInvalidRepasse) {
              toast.error("Preencha todos os campos obrigatórios dos repasses")
            }
          }
          fieldsToValidate = ["repasses"]
        } else {
          fieldsToValidate = []
        }
        break
      case 7:
        fieldsToValidate = []
        break
    }

    const isValid = await trigger(fieldsToValidate as any)
    if (isValid) {
      setActiveTab((prev) => Math.min(prev + 1, tabs.length - 1))
    } else {
      toast.error("Preencha todos os campos obrigatórios")
    }
  }

  const handlePrevTab = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (data: PropostaFormSchema) => {
    try {
      const payload = {
        ...data,
        inicioVigencia:
          data.inicioVigencia ?
            new Date(data.inicioVigencia).toISOString()
          : "",
        fimVigencia:
          data.fimVigencia ? new Date(data.fimVigencia).toISOString() : "",
        dataEmissao:
          data.dataEmissao ?
            new Date(data.dataEmissao).toISOString()
          : undefined,
        parcelas: data.parcelas.map((p) => ({
          ...p,
          percentualCorretora: data.percentualComissao,
          dataVencimento:
            p.dataVencimento ? new Date(p.dataVencimento).toISOString() : "",
          previsaoRecebimento:
            p.previsaoRecebimento ?
              new Date(p.previsaoRecebimento).toISOString()
            : "",
        })),
      }

      if (isEdit && proposta?.id) {
        const { numeroProposta, ...updatePayload } = payload
        await updateProposta(proposta.id, updatePayload)
        toast.success("Proposta atualizada com sucesso!")
      } else {
        await createProposta(payload)
        toast.success("Proposta criada com sucesso!")
      }
      push("/propostas")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao salvar proposta")
    }
  }

  const selectedRamo = ramos?.data?.find((r) => r.id === formData.ramoId)
  const isAutomovelRamo = selectedRamo?.descricao
    ?.toLowerCase()
    .includes("autom")

  const tabs =
    isAutomovelRamo ?
      [
        "Proposta",
        "Veículo",
        "Vigência",
        "Apólice e Endosso",
        "Prêmio e Parcelas",
        "Comissão",
        "Repasses",
        "Revisão",
      ]
    : [
        "Proposta",
        "Vigência",
        "Apólice e Endosso",
        "Prêmio e Parcelas",
        "Comissão",
        "Repasses",
        "Revisão",
      ]

  const segurado = segurados?.data?.find((s) => s.id === formData.seguradoId)

  return (
    <div className="space-y-6">
      {segurado && (
        <div className="rounded-lg border bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold">Dados do Segurado</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Nome:</span>{" "}
              {segurado.nomeRazaoSocial}
            </div>
            <div>
              <span className="font-medium">CPF/CNPJ:</span> {segurado.cnpjCpf}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 border-b">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 ${
              activeTab === index ?
                "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-gray-600"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-gray-50 p-6">
        {activeTab === 0 && (
          <PropostaTab
            register={register}
            errors={errors}
            formData={formData}
            setValue={setValue}
            segurados={segurados}
            seguradoras={seguradoras}
            produtores={produtores}
            corretoras={corretoras}
            produtosOptions={produtosOptions}
            ramos={ramos}
            isEndosso={isEndosso}
            isRenovacao={isRenovacao}
          />
        )}

        {activeTab === 1 && isAutomovelRamo && (
          <VeiculoTab register={register} errors={errors} />
        )}

        {((activeTab === 1 && !isAutomovelRamo) ||
          (activeTab === 2 && isAutomovelRamo)) && (
          <VigenciaTab register={register} errors={errors} />
        )}

        {((activeTab === 2 && !isAutomovelRamo) ||
          (activeTab === 3 && isAutomovelRamo)) && (
          <ApoliceEndossoTab
            register={register}
            errors={errors}
            proposta={propostaToDuplicate}
            control={control}
          />
        )}

        {((activeTab === 3 && !isAutomovelRamo) ||
          (activeTab === 4 && isAutomovelRamo)) && (
          <PremioParcelasTab
            register={register}
            errors={errors}
            formData={formData}
            setValue={setValue}
            setShowParcelasModal={setShowParcelasModal}
            premioLiquido={getValues("premioLiquido")}
          />
        )}

        {((activeTab === 4 && !isAutomovelRamo) ||
          (activeTab === 5 && isAutomovelRamo)) && (
          <ComissaoTab
            register={register}
            errors={errors}
            formData={formData}
            setValue={setValue}
          />
        )}

        {((activeTab === 5 && !isAutomovelRamo) ||
          (activeTab === 6 && isAutomovelRamo)) && (
          <RepassesTab
            register={register}
            errors={errors}
            formData={formData}
            setValue={setValue}
            produtores={produtores}
          />
        )}
      </div>

      {((activeTab === 6 && !isAutomovelRamo) ||
        (activeTab === 7 && isAutomovelRamo)) && (
        <RevisaoTab
          control={control}
          register={register}
          errors={errors}
          formData={formData}
          setValue={setValue}
          segurados={segurados}
          seguradoras={seguradoras}
          produtores={produtores}
          corretoras={corretoras}
          ramos={ramos}
          produtosOptions={produtosOptions}
          isAutomovelRamo={isAutomovelRamo}
        />
      )}

      <div className="flex justify-between">
        <div className="flex gap-2">
          {activeTab > 0 && (
            <Button variant="secondary" onClick={handlePrevTab}>
              Voltar
            </Button>
          )}
          <Button variant="secondary" onClick={() => push("/propostas")}>
            Cancelar
          </Button>
        </div>
        <div>
          {activeTab < tabs.length - 1 ?
            <Button onClick={handleNextTab}>Avançar</Button>
          : <Button onClick={handleFormSubmit(handleSubmit)}>
              {isEdit ? "Atualizar" : "Criar"} Proposta
            </Button>
          }
        </div>
      </div>

      {showParcelasModal && (
        <ParcelasModal
          numParcelasInput={numParcelasInput}
          setNumParcelasInput={setNumParcelasInput}
          setShowParcelasModal={setShowParcelasModal}
          handleGenerateParcelas={handleGenerateParcelas}
          setDataPrimeiroVencimento={setDataPrimeiroVencimento}
          dataPrimeiroVencimento={dataPrimeiroVencimento}
        />
      )}
    </div>
  )
}
