"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { SelectInput } from "@/core/components/SelectInput"
import { bffApi } from "@/lib/axios"
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
import { propostaFormSchema, PropostaFormSchema } from "../validation/schema"

interface PropostaFormProps {
  proposta?: Proposta
  isEdit?: boolean
}

export function PropostaForm({ proposta, isEdit }: PropostaFormProps) {
  const [activeTab, setActiveTab] = useState(0)

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
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
      anoFabricacaoVeiculo: proposta?.anoFabricacaoVeiculo,
      anoModeloVeiculo: proposta?.anoModeloVeiculo,
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
      percentualComissao: proposta?.percentualComissao || 0,
      comissaoSobre: (proposta?.comissaoSobre as any) || "Premio Liquido",
      formaComissao: proposta?.formaComissao || "Na Parcela",
      valorComissao: proposta?.valorComissao || 0,
      premioLiquido: proposta?.premioLiquido || 0,
      valoresAdicionais: proposta?.valoresAdicionais,
      iof: proposta?.iof,
      parcelas: proposta?.parcelas?.map(p => ({
        numeroParcela: p.numeroParcela,
        dataVencimento: p.dataVencimento,
        valor: Number(p.valor),
        valorLiquido: Number(p.valorLiquido),
        percentualCorretora: Number(p.percentualCorretora),
        previsaoRecebimento: p.previsaoRecebimento,
        situacao: p.situacao,
      })) || [],
      repasses: proposta?.repasses?.map(r => ({
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
    const numParcelas = Number(prompt("Quantidade de parcelas:"))
    if (!numParcelas || numParcelas < 1) return

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
      percentualCorretora: Number(formData.percentualComissao),
      previsaoRecebimento: "",
      situacao: "Pendente",
    }))

    setValue("parcelas", parcelas)
    toast.success("Parcelas geradas com sucesso!")
  }

  const handleSubmit = async (data: PropostaFormSchema) => {
    try {
      if (isEdit && proposta?.id) {
        await bffApi.put(`/propostas-apolices/${proposta.id}`, data)
        toast.success("Proposta atualizada com sucesso!")
      } else {
        await bffApi.post("/propostas-apolices", data)
        toast.success("Proposta criada com sucesso!")
      }
      push("/propostas")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao salvar proposta")
    }
  }

  const tabs = [
    "Proposta",
    "Vigência",
    "Apólice e Endosso",
    "Comissão",
    "Prêmio e Parcelas",
    "Repasses",
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

      <div>
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
            <SelectInput
              label="Produtor *"
              field_name="produtorId"
              value={formData.produtorId}
              onChange={(e) => setValue("produtorId", e.target.value)}
              options={
                produtores?.data?.map((p) => ({ text: p.nome, value: p.id })) ||
                []
              }
              required
            />
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
            <SelectInput
              label="Ramo *"
              field_name="ramoId"
              value={formData.ramoId}
              onChange={(e) => setValue("ramoId", e.target.value)}
              options={
                ramos?.data?.map((r) => ({ text: r.descricao, value: r.id })) ||
                []
              }
              required
            />
            <SelectInput
              label="Produto"
              field_name="produtoId"
              value={formData.produtoId}
              onChange={(e) => setValue("produtoId", e.target.value)}
              options={produtosOptions}
            />
            <SelectInput
              label="Tipo de Documento *"
              field_name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={(e) => setValue("tipoDocumento", e.target.value as any)}
              options={[
                { text: "Proposta", value: "Proposta" },
                { text: "Apólice", value: "Apólice" },
                { text: "Renovação", value: "Renovação" },
                { text: "Endosso", value: "Endosso" },
              ]}
              required
            />
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
          </div>
        )}

        {activeTab === 1 && (
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

        {activeTab === 2 && (
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

        {activeTab === 3 && (
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
            <SelectInput
              label="Comissão Sobre *"
              field_name="comissaoSobre"
              value={formData.comissaoSobre}
              onChange={(e) => setValue("comissaoSobre", e.target.value as any)}
              options={[
                { text: "Prêmio Líquido", value: "Premio Liquido" },
                { text: "Prêmio Comercial", value: "Premio Comercial" },
                { text: "Prêmio Total", value: "Premio Total" },
              ]}
              required
            />
            <SelectInput
              label="Forma de Comissão *"
              field_name="formaComissao"
              value={formData.formaComissao}
              onChange={(e) => setValue("formaComissao", e.target.value as any)}
              options={[
                { text: "Na Parcela", value: "Na Parcela" },
                { text: "Antecipado", value: "Antecipado" },
                { text: "Recorrência", value: "Recorrencia" },
              ]}
              required
            />
            <div>
              <label>Valor de Comissão</label>
              <Input.Root className="mt-2">
                <Input.Control
                  type="number"
                  value={formData.valorComissao}
                  disabled
                />
              </Input.Root>
            </div>
          </div>
        )}

        {activeTab === 4 && (
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
                    {...register("valoresAdicionais", { valueAsNumber: true })}
                  />
                </Input.Root>
              </div>
              <div>
                <label>IOF</label>
                <Input.Root className="mt-2">
                  <Input.Control
                    type="number"
                    {...register("iof", { valueAsNumber: true })}
                  />
                </Input.Root>
              </div>
            </div>
            <Button onClick={handleGenerateParcelas}>Gerar Parcelas</Button>
            {formData.parcelas.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 font-semibold">Parcelas</h4>
                {formData.parcelas.map((parcela: any, index: number) => (
                  <div key={index} className="mb-2 rounded border p-2">
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label>Parcela</label>
                        <Input.Root>
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

        {activeTab === 5 && (
          <div>
            <h4 className="mb-2 font-semibold">Repasses</h4>
            <p className="text-sm text-gray-600">
              Funcionalidade em desenvolvimento
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleFormSubmit(handleSubmit)}>
          {isEdit ? "Atualizar" : "Criar"} Proposta
        </Button>
        <Button variant="secondary" onClick={() => push("/propostas")}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
