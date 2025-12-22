import { Corretora } from "@/@types/corretora"
import { Produtor } from "@/@types/produtor"
import { Segurado } from "@/@types/segurado"
import { Seguradora } from "@/@types/seguradora"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { SelectInput } from "@/core/components/SelectInput"
import dynamic from "next/dynamic"
import { PropostaFormSchema } from "../../validation/schema"

import { Controller } from "react-hook-form"

import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

interface RevisaoTabProps {
  register: any
  errors: any
  formData: PropostaFormSchema
  setValue: any
  segurados: Segurado.GetResponse
  seguradoras: Seguradora.GetResponse
  produtores: Produtor.GetResponse
  corretoras: Corretora.GetResponse
  ramos: any
  control: any
  produtosOptions: any
  isAutomovelRamo: boolean
}

export function RevisaoTab({
  register,
  errors,
  formData,
  setValue,
  segurados,
  seguradoras,
  produtores,
  corretoras,
  control,
  ramos,
  produtosOptions,
  isAutomovelRamo,
}: RevisaoTabProps) {
  return (
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
                segurados?.data?.map((s: any) => ({
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
                seguradoras?.data?.map((s: any) => ({
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
              onChange={(e) => {
                const produtorId = e.target.value
                setValue("produtorId", produtorId)
                const corretoraId = produtores?.data?.find(
                  (p: any) => p.id === produtorId
                )?.corretoraId
                if (corretoraId) setValue("corretoraId", corretoraId)
              }}
              options={
                produtores?.data?.map((p: any) => ({
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
              disabled
              field_name="corretoraId"
              value={
                produtores?.data?.find((p: any) => p.id === formData.produtorId)
                  ?.corretoraId || ""
              }
              onChange={(e) => setValue("corretoraId", e.target.value)}
              options={
                corretoras?.data?.map((c: any) => ({
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
                ramos?.data?.map((r: any) => ({
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
              onChange={(e) => setValue("tipoDocumento", e.target.value as any)}
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
          </div>
          <div>
            <label>Fim da Vigência *</label>
            <Input.Root className="mt-2">
              <Input.Control type="date" {...register("fimVigencia")} />
            </Input.Root>
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
          </div>
          <div>
            <label>Número do Endosso</label>
            <Input.Root className="mt-2">
              <Input.Control {...register("numeroEndosso")} />
            </Input.Root>
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
          </div>
          <div>
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
            />
          </div>
          <div>
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
            />
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
                        (_: any, i: number) => i !== index
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
                        produtores?.data?.map((p: any) => ({
                          text: p.nome,
                          value: p.id,
                        })) || []
                      }
                    />
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
                  </div>
                  <div>
                    <SelectInput
                      label="Repasse Sobre *"
                      field_name={`repasses.${index}.repasseSobre`}
                      value={repasse.repasseSobre}
                      onChange={(e) => {
                        const newRepasses = [...formData.repasses]
                        newRepasses[index].repasseSobre = e.target.value as any
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
                  </div>
                  <div>
                    <SelectInput
                      label="Forma de Repasse *"
                      field_name={`repasses.${index}.formaRepasse`}
                      value={repasse.formaRepasse}
                      onChange={(e) => {
                        const newRepasses = [...formData.repasses]
                        newRepasses[index].formaRepasse = e.target.value as any
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 text-lg font-semibold">Observações</h3>
        <Controller
          name="observacoes"
          control={control}
          render={({ field }) => (
            <div className="bg-white">
              <ReactQuill
                theme="snow"
                value={field.value || ""}
                onChange={field.onChange}
              />
            </div>
          )}
        />
      </div>
    </>
  )
}
