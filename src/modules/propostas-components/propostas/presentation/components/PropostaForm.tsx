"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { SelectInput } from "@/core/components/SelectInput"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { useProdutoQuery } from "@/modules/produtos-components/produtos/infra/hooks/use-produto-query"
import { useRamoQuery } from "@/modules/ramos-components/ramos/infra/hooks/use-ramo-query"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { useSeguradoQuery } from "@/modules/segurados-components/segurado/infra/hooks/use-segurado-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Proposta } from "../../../types/proposta"
import { createProposta, updateProposta } from "../../infra/remote"
import { propostaFormSchema, PropostaFormSchema } from "../validation/schema"

interface PropostaFormProps {
  proposta?: Proposta
  isEdit?: boolean
}

export function PropostaForm({ proposta, isEdit }: PropostaFormProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [showParcelasModal, setShowParcelasModal] = useState(false)
  const [numParcelasInput, setNumParcelasInput] = useState("")

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<PropostaFormSchema>({
    resolver: zodResolver(propostaFormSchema),
    defaultValues: {
      numeroProposta: proposta?.numeroProposta || "",
      seguradoId: proposta?.seguradoId || "",
      corretoraId: proposta?.corretoraId || "",
      produtorId: proposta?.produtorId || "",
      seguradoraId: proposta?.seguradoraId || "",
      ramoId: proposta?.ramoId || "",
      produtoId: proposta?.produtoId || "",
      placaVeiculo: proposta?.placaVeiculo || "",
      chassiVeiculo: proposta?.chassiVeiculo || "",
      modeloVeiculo: proposta?.modeloVeiculo || "",
      marcaVeiculo: proposta?.marcaVeiculo || "",
      anoFabricacaoVeiculo: proposta?.anoFabricacaoVeiculo || undefined,
      anoModeloVeiculo: proposta?.anoModeloVeiculo || undefined,
      complementoItem: proposta?.complementoItem || "",
      tipoDocumento: proposta?.tipoDocumento || "Proposta",
      origem: proposta?.origem || "Manual",
      situacao: proposta?.situacao || "Ativo",
      inicioVigencia: proposta?.inicioVigencia || "",
      fimVigencia: proposta?.fimVigencia || "",
      dataEmissao: proposta?.dataEmissao || "",
      numeroApolice: proposta?.numeroApolice || "",
      numeroEndosso: proposta?.numeroEndosso || "",
      renovacao: proposta?.renovacao || "Renovável",
      motivoNaoRenovacao: proposta?.motivoNaoRenovacao || "",
      percentualComissao: proposta?.percentualComissao || undefined,
      comissaoSobre: (proposta?.comissaoSobre as any) || "Premio Liquido",
      formaComissao: proposta?.formaComissao || "Na Parcela",
      valorComissao: proposta?.valorComissao || undefined,
      premioLiquido: proposta?.premioLiquido || undefined,
      valoresAdicionais: proposta?.valoresAdicionais || undefined,
      iof: proposta?.iof || undefined,
      parcelas:
        proposta?.parcelas?.map((p) => ({
          numeroParcela: p.numeroParcela,
          dataVencimento: p.dataVencimento,
          valor: Number(p.valor),
          valorLiquido: Number(p.valorLiquido),
          percentualCorretora: Number(p.percentualCorretora),
          previsaoRecebimento: p.previsaoRecebimento,
          situacao: p.situacao,
        })) || [],
      repasses:
        proposta?.repasses?.map((r) => ({
          produtorId: r.produtorId,
          percentualRepasse: Number(r.percentualRepasse),
          repasseSobre: r.repasseSobre as any,
          formaRepasse: r.formaRepasse as any,
        })) || [],
    },
  })

  const formData = watch()

  const { push } = useRouter()
  const { data: segurados } = useSeguradoQuery(1, 100)
  const { data: corretoras } = useCorretoraQuery(1, 100)
  const { data: produtores } = useProdutorQuery(1, 100)
  const { data: seguradoras } = useSeguradoraQuery(1, 100)
  const { data: ramos } = useRamoQuery(1, 100)
  const { data: produtos } = useProdutoQuery(1, 100)

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
    const premio = Number(formData.premioLiquido) || 0
    const adicionais = Number(formData.valoresAdicionais) || 0
    const iof = Number(formData.iof) || 0
    const comissao = (premio * Number(formData.percentualComissao)) / 100
    setValue("valorComissao", Number(comissao.toFixed(2)))
  }, [formData.premioLiquido, formData.percentualComissao])

  const handleGenerateParcelas = () => {
    const numParcelas = Number(numParcelasInput)
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

    const parcelas = Array.from({ length: numParcelas }, (_, i) => ({
      numeroParcela: i + 1,
      valor: valorParcela,
      valorLiquido: valorLiquido,
      dataVencimento: "",
      percentualCorretora: formData.percentualComissao ?? null,
      previsaoRecebimento: "",
      situacao: "Pendente",
    }))

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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Número da Proposta *</label>
              <Input.Root className="mt-2">
                <Input.Control {...register("numeroProposta")} />
              </Input.Root>
              {errors.numeroProposta && (
                <span className="text-xs text-red-500">
                  {errors.numeroProposta.message}
                </span>
              )}
            </div>
            <div>
              <SelectInput
                label="Segurado *"
                field_name="seguradoId"
                value={formData.seguradoId}
                onChange={(e) => setValue("seguradoId", e.target.value)}
                options={
                  segurados?.data?.map((s) => ({
                    text: s.nomeRazaoSocial,
                    value: s.id,
                  })) || []
                }
                required
              />
              {errors.seguradoId && (
                <span className="text-xs text-red-500">
                  {errors.seguradoId.message}
                </span>
              )}
            </div>
            <div>
              <SelectInput
                label="Seguradora *"
                field_name="seguradoraId"
                value={formData.seguradoraId}
                onChange={(e) => setValue("seguradoraId", e.target.value)}
                options={
                  seguradoras?.data?.map((s) => ({
                    text: s.razaoSocial,
                    value: s.id,
                  })) || []
                }
                required
              />
              {errors.seguradoraId && (
                <span className="text-xs text-red-500">
                  {errors.seguradoraId.message}
                </span>
              )}
            </div>
            <div>
              <SelectInput
                label="Produtor *"
                field_name="produtorId"
                value={formData.produtorId}
                onChange={(e) => setValue("produtorId", e.target.value)}
                options={
                  produtores?.data?.map((p) => ({
                    text: p.nome,
                    value: p.id,
                  })) || []
                }
                required
              />
              {errors.produtorId && (
                <span className="text-xs text-red-500">
                  {errors.produtorId.message}
                </span>
              )}
            </div>
            <div>
              <SelectInput
                label="Corretora *"
                field_name="corretoraId"
                value={formData.corretoraId}
                onChange={(e) => setValue("corretoraId", e.target.value)}
                options={
                  corretoras?.data?.map((c) => ({
                    text: c.razaoSocial,
                    value: c.id,
                  })) || []
                }
                required
              />
              {errors.corretoraId && (
                <span className="text-xs text-red-500">
                  {errors.corretoraId.message}
                </span>
              )}
            </div>
            <div>
              <SelectInput
                label="Ramo *"
                field_name="ramoId"
                value={formData.ramoId}
                onChange={(e) => setValue("ramoId", e.target.value)}
                options={
                  ramos?.data?.map((r) => ({
                    text: r.descricao,
                    value: r.id,
                  })) || []
                }
                required
              />
              {errors.ramoId && (
                <span className="text-xs text-red-500">
                  {errors.ramoId.message}
                </span>
              )}
            </div>
            <SelectInput
              label="Produto"
              field_name="produtoId"
              value={formData.produtoId}
              onChange={(e) => setValue("produtoId", e.target.value)}
              options={produtosOptions}
            />
            <div>
              <SelectInput
                label="Tipo de Documento *"
                field_name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={(e) =>
                  setValue("tipoDocumento", e.target.value as any)
                }
                options={[
                  { text: "Proposta", value: "Proposta" },
                  { text: "Apólice", value: "Apólice" },
                  { text: "Renovação", value: "Renovação" },
                  { text: "Endosso", value: "Endosso" },
                ]}
                required
              />
              {errors.tipoDocumento && (
                <span className="text-xs text-red-500">
                  {errors.tipoDocumento.message}
                </span>
              )}
            </div>
            <div>
              <SelectInput
                label="Origem *"
                field_name="origem"
                value={formData.origem}
                onChange={(e) => setValue("origem", e.target.value as any)}
                options={[
                  { text: "Manual", value: "Manual" },
                  { text: "Importação", value: "Importação" },
                  { text: "Integração", value: "Integração" },
                ]}
                required
              />
              {errors.origem && (
                <span className="text-xs text-red-500">
                  {errors.origem.message}
                </span>
              )}
            </div>
          </div>
        )}

        {activeTab === 1 && isAutomovelRamo && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Placa do Veículo</label>
              <Input.Root className="mt-2">
                <Input.Control {...register("placaVeiculo")} />
              </Input.Root>
            </div>
            <div>
              <label>Chassi do Veículo</label>
              <Input.Root className="mt-2">
                <Input.Control {...register("chassiVeiculo")} />
              </Input.Root>
            </div>
            <div>
              <label>Marca do Veículo</label>
              <Input.Root className="mt-2">
                <Input.Control {...register("marcaVeiculo")} />
              </Input.Root>
            </div>
            <div>
              <label>Modelo do Veículo</label>
              <Input.Root className="mt-2">
                <Input.Control {...register("modeloVeiculo")} />
              </Input.Root>
            </div>
            <div>
              <label>Ano de Fabricação</label>
              <Input.Root className="mt-2">
                <Input.Control
                  type="number"
                  {...register("anoFabricacaoVeiculo", { valueAsNumber: true })}
                />
              </Input.Root>
            </div>
            <div>
              <label>Ano do Modelo</label>
              <Input.Root className="mt-2">
                <Input.Control
                  type="number"
                  {...register("anoModeloVeiculo", { valueAsNumber: true })}
                />
              </Input.Root>
            </div>
            <div className="col-span-2">
              <label>Complemento</label>
              <Input.Root className="mt-2">
                <Input.Control {...register("complementoItem")} />
              </Input.Root>
            </div>
          </div>
        )}

        {((activeTab === 1 && !isAutomovelRamo) ||
          (activeTab === 2 && isAutomovelRamo)) && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Início da Vigência *</label>
              <Input.Root className="mt-2">
                <Input.Control type="date" {...register("inicioVigencia")} />
              </Input.Root>
              {errors.inicioVigencia && (
                <span className="text-xs text-red-500">
                  {errors.inicioVigencia.message}
                </span>
              )}
            </div>
            <div>
              <label>Fim da Vigência *</label>
              <Input.Root className="mt-2">
                <Input.Control type="date" {...register("fimVigencia")} />
              </Input.Root>
              {errors.fimVigencia && (
                <span className="text-xs text-red-500">
                  {errors.fimVigencia.message}
                </span>
              )}
            </div>
          </div>
        )}

        {((activeTab === 2 && !isAutomovelRamo) ||
          (activeTab === 3 && isAutomovelRamo)) && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Número da Apólice</label>
              <Input.Root className="mt-2">
                <Input.Control {...register("numeroApolice")} />
              </Input.Root>
            </div>
            <div>
              <label>Número do Endosso</label>
              <Input.Root className="mt-2">
                <Input.Control {...register("numeroEndosso")} />
              </Input.Root>
            </div>
            <SelectInput
              label="Renovação"
              field_name="renovacao"
              value={formData.renovacao}
              onChange={(e) => setValue("renovacao", e.target.value as any)}
              options={[
                { text: "Renovável", value: "Renovável" },
                { text: "Não Renovável", value: "Não Renovável" },
              ]}
            />
            {formData.renovacao === "Não Renovável" && (
              <div>
                <label>Motivo da Não Renovação</label>
                <Input.Root className="mt-2">
                  <Input.Control {...register("motivoNaoRenovacao")} />
                </Input.Root>
              </div>
            )}
          </div>
        )}

        {((activeTab === 3 && !isAutomovelRamo) ||
          (activeTab === 4 && isAutomovelRamo)) && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label>Prêmio Líquido *</label>
                <Input.Root className="mt-2">
                  <Input.Control
                    type="number"
                    {...register("premioLiquido", { valueAsNumber: true })}
                    required
                  />
                </Input.Root>
                {errors.premioLiquido && (
                  <span className="text-xs text-red-500">
                    {errors.premioLiquido.message}
                  </span>
                )}
              </div>
              <div>
                <label>Valores Adicionais</label>
                <Input.Root className="mt-2">
                  <Input.Control
                    type="number"
                    {...register("valoresAdicionais", {
                      setValueAs: (v) => (v === "" ? null : Number(v)),
                    })}
                  />
                </Input.Root>
              </div>
              <div>
                <label>IOF</label>
                <Input.Root className="mt-2">
                  <Input.Control
                    type="number"
                    {...register("iof", {
                      setValueAs: (v) => (v === "" ? null : Number(v)),
                    })}
                  />
                </Input.Root>
              </div>
            </div>
            <Button onClick={() => setShowParcelasModal(true)}>
              Gerar Parcelas
            </Button>
            {formData.parcelas.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 font-semibold">Parcelas</h4>
                {formData.parcelas.map((parcela: any, index: number) => (
                  <div key={index} className="mb-2 rounded border p-2">
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label>Parcela</label>
                        <Input.Root variant="disabled">
                          <Input.Control
                            value={parcela.numeroParcela}
                            disabled
                          />
                        </Input.Root>
                      </div>
                      <div>
                        <label>Valor</label>
                        <Input.Root>
                          <Input.Control value={parcela.valor} disabled />
                        </Input.Root>
                      </div>
                      <div>
                        <label>Vencimento</label>
                        <Input.Root>
                          <Input.Control
                            type="date"
                            value={parcela.dataVencimento}
                            onChange={(e) => {
                              const newParcelas = [...formData.parcelas]
                              newParcelas[index].dataVencimento = e.target.value
                              setValue("parcelas", newParcelas)
                            }}
                          />
                        </Input.Root>
                      </div>
                      <div>
                        <label>Previsão Recebimento</label>
                        <Input.Root>
                          <Input.Control
                            type="date"
                            value={parcela.previsaoRecebimento}
                            onChange={(e) => {
                              const newParcelas = [...formData.parcelas]
                              newParcelas[index].previsaoRecebimento =
                                e.target.value
                              setValue("parcelas", newParcelas)
                            }}
                          />
                        </Input.Root>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {((activeTab === 4 && !isAutomovelRamo) ||
          (activeTab === 5 && isAutomovelRamo)) && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>% Comissão *</label>
              <Input.Root className="mt-2">
                <Input.Control
                  type="number"
                  {...register("percentualComissao", { valueAsNumber: true })}
                  required
                />
              </Input.Root>
              {errors.percentualComissao && (
                <span className="text-xs text-red-500">
                  {errors.percentualComissao.message}
                </span>
              )}
            </div>
            <div>
              <SelectInput
                label="Comissão Sobre *"
                field_name="comissaoSobre"
                value={formData.comissaoSobre}
                onChange={(e) =>
                  setValue("comissaoSobre", e.target.value as any)
                }
                options={[
                  { text: "Prêmio Líquido", value: "Premio Liquido" },
                  { text: "Prêmio Comercial", value: "Premio Comercial" },
                  { text: "Prêmio Total", value: "Premio Total" },
                ]}
                required
              />
              {errors.comissaoSobre && (
                <span className="text-xs text-red-500">
                  {errors.comissaoSobre.message}
                </span>
              )}
            </div>
            <div>
              <SelectInput
                label="Forma de Comissão *"
                field_name="formaComissao"
                value={formData.formaComissao}
                onChange={(e) =>
                  setValue("formaComissao", e.target.value as any)
                }
                options={[
                  { text: "Na Parcela", value: "Na Parcela" },
                  { text: "Antecipado", value: "Antecipado" },
                  { text: "Recorrência", value: "Recorrencia" },
                ]}
                required
              />
              {errors.formaComissao && (
                <span className="text-xs text-red-500">
                  {errors.formaComissao.message}
                </span>
              )}
            </div>
            <div>
              <label>Valor de Comissão</label>
              <Input.Root className="mt-2">
                <Input.Control
                  type="number"
                  value={formData.valorComissao}
                  disabled
                />
              </Input.Root>
              {errors.valorComissao && (
                <span className="text-xs text-red-500">
                  {errors.valorComissao.message}
                </span>
              )}
            </div>
          </div>
        )}

        {((activeTab === 5 && !isAutomovelRamo) ||
          (activeTab === 6 && isAutomovelRamo)) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Repasses</h4>
              <Button
                onClick={() => {
                  const newRepasse = {
                    produtorId: "",
                    percentualRepasse: undefined,
                    repasseSobre: "Premio Liquido" as const,
                    formaRepasse: "No recebimento" as const,
                  }
                  setValue("repasses", [...formData.repasses, newRepasse])
                }}>
                Adicionar Repasse
              </Button>
            </div>
            {formData.repasses.length === 0 ?
              <p className="text-sm text-gray-600">Nenhum repasse cadastrado</p>
            : formData.repasses.map((repasse: any, index: number) => (
                <div key={index} className="rounded border bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h5 className="font-medium">Repasse {index + 1}</h5>
                    <button
                      type="button"
                      onClick={() => {
                        const newRepasses = formData.repasses.filter(
                          (_, i) => i !== index
                        )
                        setValue("repasses", newRepasses)
                      }}
                      className="text-sm text-red-600 hover:underline">
                      Remover
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <SelectInput
                        label="Produtor *"
                        field_name={`repasses.${index}.produtorId`}
                        value={repasse.produtorId}
                        onChange={(e) => {
                          const newRepasses = [...formData.repasses]
                          newRepasses[index].produtorId = e.target.value
                          setValue("repasses", newRepasses)
                        }}
                        options={
                          produtores?.data?.map((p) => ({
                            text: p.nome,
                            value: p.id,
                          })) || []
                        }
                      />
                      {errors.repasses?.[index]?.produtorId && (
                        <span className="text-xs text-red-500">
                          {errors.repasses[index].produtorId.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <label>% Repasse *</label>
                      <Input.Root className="mt-2">
                        <Input.Control
                          type="number"
                          {...register(
                            `repasses.${index}.percentualRepasse` as any,
                            { valueAsNumber: true }
                          )}
                        />
                      </Input.Root>
                      {errors.repasses?.[index]?.percentualRepasse && (
                        <span className="text-xs text-red-500">
                          {errors.repasses[index].percentualRepasse.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <SelectInput
                        label="Repasse Sobre *"
                        field_name={`repasses.${index}.repasseSobre`}
                        value={repasse.repasseSobre}
                        onChange={(e) => {
                          const newRepasses = [...formData.repasses]
                          newRepasses[index].repasseSobre = e.target
                            .value as any
                          setValue("repasses", newRepasses)
                        }}
                        options={[
                          { text: "Prêmio Líquido", value: "Premio Liquido" },
                          {
                            text: "Comissão da Corretora",
                            value: "Comissão da Corretora",
                          },
                          { text: "Valor Fixo", value: "Valor Fixo" },
                        ]}
                      />
                      {errors.repasses?.[index]?.repasseSobre && (
                        <span className="text-xs text-red-500">
                          {errors.repasses[index].repasseSobre.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <SelectInput
                        label="Forma de Repasse *"
                        field_name={`repasses.${index}.formaRepasse`}
                        value={repasse.formaRepasse}
                        onChange={(e) => {
                          const newRepasses = [...formData.repasses]
                          newRepasses[index].formaRepasse = e.target
                            .value as any
                          setValue("repasses", newRepasses)
                        }}
                        options={[
                          { text: "No recebimento", value: "No recebimento" },
                          {
                            text: "Antecipado 1a parcela",
                            value: "Antecipado 1a parcela",
                          },
                          {
                            text: "Antecipado parcela",
                            value: "Antecipado parcela",
                          },
                          {
                            text: "Antecipado emissão",
                            value: "Antecipado emissão",
                          },
                        ]}
                      />
                      {errors.repasses?.[index]?.formaRepasse && (
                        <span className="text-xs text-red-500">
                          {errors.repasses[index].formaRepasse.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {((activeTab === 6 && !isAutomovelRamo) ||
        (activeTab === 7 && isAutomovelRamo)) && (
        <>
          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Proposta</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Número da Proposta *</label>
                <Input.Root className="mt-2">
                  <Input.Control {...register("numeroProposta")} />
                </Input.Root>
                {errors.numeroProposta && (
                  <span className="text-xs text-red-500">
                    {errors.numeroProposta.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  label="Segurado *"
                  field_name="seguradoId"
                  value={formData.seguradoId}
                  onChange={(e) => setValue("seguradoId", e.target.value)}
                  options={
                    segurados?.data?.map((s) => ({
                      text: s.nomeRazaoSocial,
                      value: s.id,
                    })) || []
                  }
                />
                {errors.seguradoId && (
                  <span className="text-xs text-red-500">
                    {errors.seguradoId.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  label="Seguradora *"
                  field_name="seguradoraId"
                  value={formData.seguradoraId}
                  onChange={(e) => setValue("seguradoraId", e.target.value)}
                  options={
                    seguradoras?.data?.map((s) => ({
                      text: s.razaoSocial,
                      value: s.id,
                    })) || []
                  }
                />
                {errors.seguradoraId && (
                  <span className="text-xs text-red-500">
                    {errors.seguradoraId.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  label="Produtor *"
                  field_name="produtorId"
                  value={formData.produtorId}
                  onChange={(e) => setValue("produtorId", e.target.value)}
                  options={
                    produtores?.data?.map((p) => ({
                      text: p.nome,
                      value: p.id,
                    })) || []
                  }
                />
                {errors.produtorId && (
                  <span className="text-xs text-red-500">
                    {errors.produtorId.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  label="Corretora *"
                  field_name="corretoraId"
                  value={formData.corretoraId}
                  onChange={(e) => setValue("corretoraId", e.target.value)}
                  options={
                    corretoras?.data?.map((c) => ({
                      text: c.razaoSocial,
                      value: c.id,
                    })) || []
                  }
                />
                {errors.corretoraId && (
                  <span className="text-xs text-red-500">
                    {errors.corretoraId.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  label="Ramo *"
                  field_name="ramoId"
                  value={formData.ramoId}
                  onChange={(e) => setValue("ramoId", e.target.value)}
                  options={
                    ramos?.data?.map((r) => ({
                      text: r.descricao,
                      value: r.id,
                    })) || []
                  }
                />
                {errors.ramoId && (
                  <span className="text-xs text-red-500">
                    {errors.ramoId.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  label="Produto"
                  field_name="produtoId"
                  value={formData.produtoId}
                  onChange={(e) => setValue("produtoId", e.target.value)}
                  options={produtosOptions}
                />
                {errors.produtoId && (
                  <span className="text-xs text-red-500">
                    {errors.produtoId.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  label="Tipo de Documento *"
                  field_name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={(e) =>
                    setValue("tipoDocumento", e.target.value as any)
                  }
                  options={[
                    { text: "Proposta", value: "Proposta" },
                    { text: "Apólice", value: "Apólice" },
                    { text: "Renovação", value: "Renovação" },
                    { text: "Endosso", value: "Endosso" },
                  ]}
                />
                {errors.tipoDocumento && (
                  <span className="text-xs text-red-500">
                    {errors.tipoDocumento.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  label="Origem *"
                  field_name="origem"
                  value={formData.origem}
                  onChange={(e) => setValue("origem", e.target.value as any)}
                  options={[
                    { text: "Manual", value: "Manual" },
                    { text: "Importação", value: "Importação" },
                    { text: "Integração", value: "Integração" },
                  ]}
                />
                {errors.origem && (
                  <span className="text-xs text-red-500">
                    {errors.origem.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {isAutomovelRamo && (
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold">Veículo</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Placa do Veículo</label>
                  <Input.Root className="mt-2">
                    <Input.Control {...register("placaVeiculo")} />
                  </Input.Root>
                  {errors.placaVeiculo && (
                    <span className="text-xs text-red-500">
                      {errors.placaVeiculo.message}
                    </span>
                  )}
                </div>
                <div>
                  <label>Chassi do Veículo</label>
                  <Input.Root className="mt-2">
                    <Input.Control {...register("chassiVeiculo")} />
                  </Input.Root>
                  {errors.chassiVeiculo && (
                    <span className="text-xs text-red-500">
                      {errors.chassiVeiculo.message}
                    </span>
                  )}
                </div>
                <div>
                  <label>Marca do Veículo</label>
                  <Input.Root className="mt-2">
                    <Input.Control {...register("marcaVeiculo")} />
                  </Input.Root>
                  {errors.marcaVeiculo && (
                    <span className="text-xs text-red-500">
                      {errors.marcaVeiculo.message}
                    </span>
                  )}
                </div>
                <div>
                  <label>Modelo do Veículo</label>
                  <Input.Root className="mt-2">
                    <Input.Control {...register("modeloVeiculo")} />
                  </Input.Root>
                  {errors.modeloVeiculo && (
                    <span className="text-xs text-red-500">
                      {errors.modeloVeiculo.message}
                    </span>
                  )}
                </div>
                <div>
                  <label>Ano de Fabricação</label>
                  <Input.Root className="mt-2">
                    <Input.Control
                      type="number"
                      {...register("anoFabricacaoVeiculo", {
                        valueAsNumber: true,
                      })}
                    />
                  </Input.Root>
                  {errors.anoFabricacaoVeiculo && (
                    <span className="text-xs text-red-500">
                      {errors.anoFabricacaoVeiculo.message}
                    </span>
                  )}
                </div>
                <div>
                  <label>Ano do Modelo</label>
                  <Input.Root className="mt-2">
                    <Input.Control
                      type="number"
                      {...register("anoModeloVeiculo", { valueAsNumber: true })}
                    />
                  </Input.Root>
                  {errors.anoModeloVeiculo && (
                    <span className="text-xs text-red-500">
                      {errors.anoModeloVeiculo.message}
                    </span>
                  )}
                </div>
                <div className="col-span-2">
                  <label>Complemento</label>
                  <Input.Root className="mt-2">
                    <Input.Control {...register("complementoItem")} />
                  </Input.Root>
                  {errors.complementoItem && (
                    <span className="text-xs text-red-500">
                      {errors.complementoItem.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Vigência</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Início da Vigência *</label>
                <Input.Root className="mt-2">
                  <Input.Control type="date" {...register("inicioVigencia")} />
                </Input.Root>
                {errors.inicioVigencia && (
                  <span className="text-xs text-red-500">
                    {errors.inicioVigencia.message}
                  </span>
                )}
              </div>
              <div>
                <label>Fim da Vigência *</label>
                <Input.Root className="mt-2">
                  <Input.Control type="date" {...register("fimVigencia")} />
                </Input.Root>
                {errors.fimVigencia && (
                  <span className="text-xs text-red-500">
                    {errors.fimVigencia.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Apólice e Endosso</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Número da Apólice</label>
                <Input.Root className="mt-2">
                  <Input.Control {...register("numeroApolice")} />
                </Input.Root>
                {errors.numeroApolice && (
                  <span className="text-xs text-red-500">
                    {errors.numeroApolice.message}
                  </span>
                )}
              </div>
              <div>
                <label>Número do Endosso</label>
                <Input.Root className="mt-2">
                  <Input.Control {...register("numeroEndosso")} />
                </Input.Root>
                {errors.numeroEndosso && (
                  <span className="text-xs text-red-500">
                    {errors.numeroEndosso.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Comissão</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>% Comissão *</label>
                <Input.Root className="mt-2">
                  <Input.Control
                    type="number"
                    {...register("percentualComissao", { valueAsNumber: true })}
                  />
                </Input.Root>
                {errors.percentualComissao && (
                  <span className="text-xs text-red-500">
                    {errors.percentualComissao.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  label="Comissão Sobre *"
                  field_name="comissaoSobre"
                  value={formData.comissaoSobre}
                  onChange={(e) =>
                    setValue("comissaoSobre", e.target.value as any)
                  }
                  options={[
                    { text: "Prêmio Líquido", value: "Premio Liquido" },
                    { text: "Prêmio Comercial", value: "Premio Comercial" },
                    { text: "Prêmio Total", value: "Premio Total" },
                  ]}
                />
                {errors.comissaoSobre && (
                  <span className="text-xs text-red-500">
                    {errors.comissaoSobre.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  label="Forma de Comissão *"
                  field_name="formaComissao"
                  value={formData.formaComissao}
                  onChange={(e) =>
                    setValue("formaComissao", e.target.value as any)
                  }
                  options={[
                    { text: "Na Parcela", value: "Na Parcela" },
                    { text: "Antecipado", value: "Antecipado" },
                    { text: "Recorrência", value: "Recorrencia" },
                  ]}
                />
                {errors.formaComissao && (
                  <span className="text-xs text-red-500">
                    {errors.formaComissao.message}
                  </span>
                )}
              </div>
              <div>
                <label>Valor de Comissão</label>
                <Input.Root className="mt-2" variant="disabled">
                  <Input.Control
                    type="number"
                    value={formData.valorComissao}
                    disabled
                  />
                </Input.Root>
                {errors.valorComissao && (
                  <span className="text-xs text-red-500">
                    {errors.valorComissao.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Prêmio e Parcelas</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label>Prêmio Líquido *</label>
                <Input.Root className="mt-2">
                  <Input.Control
                    type="number"
                    {...register("premioLiquido", { valueAsNumber: true })}
                  />
                </Input.Root>
                {errors.premioLiquido && (
                  <span className="text-xs text-red-500">
                    {errors.premioLiquido.message}
                  </span>
                )}
              </div>
              <div>
                <label>Valores Adicionais</label>
                <Input.Root className="mt-2">
                  <Input.Control
                    type="number"
                    {...register("valoresAdicionais", {
                      setValueAs: (v) => (v === "" ? null : Number(v)),
                    })}
                  />
                </Input.Root>
                {errors.valoresAdicionais && (
                  <span className="text-xs text-red-500">
                    {errors.valoresAdicionais.message}
                  </span>
                )}
              </div>
              <div>
                <label>IOF</label>
                <Input.Root className="mt-2">
                  <Input.Control
                    type="number"
                    {...register("iof", {
                      setValueAs: (v) => (v === "" ? null : Number(v)),
                    })}
                  />
                </Input.Root>
                {errors.iof && (
                  <span className="text-xs text-red-500">
                    {errors.iof.message}
                  </span>
                )}
              </div>
            </div>
            {formData.parcelas.length > 0 && (
              <div className="mt-4">
                <p className="font-medium">
                  {formData.parcelas.length} parcela(s) gerada(s)
                </p>
              </div>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Repasses</h3>
              <Button
                onClick={() => {
                  const newRepasse = {
                    produtorId: "",
                    percentualRepasse: undefined,
                    repasseSobre: "Premio Liquido" as const,
                    formaRepasse: "No recebimento" as const,
                  }
                  setValue("repasses", [...formData.repasses, newRepasse])
                }}>
                Adicionar Repasse
              </Button>
            </div>
            {formData.repasses.length === 0 ?
              <p className="text-gray-500">Nenhum repasse cadastrado</p>
            : <div className="space-y-4">
                {formData.repasses.map((repasse: any, index: number) => (
                  <div key={index} className="rounded border bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h5 className="font-medium">Repasse {index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => {
                          const newRepasses = formData.repasses.filter(
                            (_, i) => i !== index
                          )
                          setValue("repasses", newRepasses)
                        }}
                        className="text-sm text-red-600 hover:underline">
                        Remover
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <SelectInput
                          label="Produtor *"
                          field_name={`repasses.${index}.produtorId`}
                          value={repasse.produtorId}
                          onChange={(e) => {
                            const newRepasses = [...formData.repasses]
                            newRepasses[index].produtorId = e.target.value
                            setValue("repasses", newRepasses)
                          }}
                          options={
                            produtores?.data?.map((p) => ({
                              text: p.nome,
                              value: p.id,
                            })) || []
                          }
                        />
                        {errors.repasses?.[index]?.produtorId && (
                          <span className="text-xs text-red-500">
                            {errors.repasses[index].produtorId.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <label>% Repasse *</label>
                        <Input.Root className="mt-2">
                          <Input.Control
                            type="number"
                            {...register(
                              `repasses.${index}.percentualRepasse` as any,
                              { valueAsNumber: true }
                            )}
                          />
                        </Input.Root>
                        {errors.repasses?.[index]?.percentualRepasse && (
                          <span className="text-xs text-red-500">
                            {errors.repasses[index].percentualRepasse.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <SelectInput
                          label="Repasse Sobre *"
                          field_name={`repasses.${index}.repasseSobre`}
                          value={repasse.repasseSobre}
                          onChange={(e) => {
                            const newRepasses = [...formData.repasses]
                            newRepasses[index].repasseSobre = e.target
                              .value as any
                            setValue("repasses", newRepasses)
                          }}
                          options={[
                            { text: "Prêmio Líquido", value: "Premio Liquido" },
                            {
                              text: "Comissão da Corretora",
                              value: "Comissão da Corretora",
                            },
                            { text: "Valor Fixo", value: "Valor Fixo" },
                          ]}
                        />
                        {errors.repasses?.[index]?.repasseSobre && (
                          <span className="text-xs text-red-500">
                            {errors.repasses[index].repasseSobre.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <SelectInput
                          label="Forma de Repasse *"
                          field_name={`repasses.${index}.formaRepasse`}
                          value={repasse.formaRepasse}
                          onChange={(e) => {
                            const newRepasses = [...formData.repasses]
                            newRepasses[index].formaRepasse = e.target
                              .value as any
                            setValue("repasses", newRepasses)
                          }}
                          options={[
                            { text: "No recebimento", value: "No recebimento" },
                            {
                              text: "Antecipado 1a parcela",
                              value: "Antecipado 1a parcela",
                            },
                            {
                              text: "Antecipado parcela",
                              value: "Antecipado parcela",
                            },
                            {
                              text: "Antecipado emissão",
                              value: "Antecipado emissão",
                            },
                          ]}
                        />
                        {errors.repasses?.[index]?.formaRepasse && (
                          <span className="text-xs text-red-500">
                            {errors.repasses[index].formaRepasse.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </>
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
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Gerar Parcelas</h3>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Quantidade de parcelas
              </label>
              <Input.Root className="mt-2">
                <Input.Control
                  type="number"
                  min="1"
                  value={numParcelasInput}
                  onChange={(e) => setNumParcelasInput(e.target.value)}
                  placeholder="Digite o número de parcelas"
                  autoFocus
                />
              </Input.Root>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowParcelasModal(false)
                  setNumParcelasInput("")
                }}>
                Cancelar
              </Button>
              <Button onClick={handleGenerateParcelas}>Gerar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
