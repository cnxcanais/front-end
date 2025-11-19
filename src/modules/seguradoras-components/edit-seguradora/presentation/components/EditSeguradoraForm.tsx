"use client"

import { Seguradora } from "@/@types/seguradora"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { fetchCep } from "@/core/utils/findCep"
import { formatCep } from "@/core/utils/format-cep"
import { formatDocumentNumber } from "@/core/utils/formatDocumentNumber"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { normalizeDecimals } from "@/core/utils/normalizeDecimals"
import { useGrupoEconomicoQuery } from "@/modules/grupos-economicos-components/grupos-economicos/infra/hooks/use-grupo-economico-query"
import { useSeguradoraByIdQuery } from "@/modules/seguradoras-components/edit-seguradora/infra/hooks/use-seguradora-by-id-query"
import { editSeguradora } from "@/modules/seguradoras-components/edit-seguradora/infra/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  EditSeguradoraSchema,
  editSeguradoraFormSchema,
} from "../validation/schema"

export function EditSeguradoraForm({ id }: { id: string }) {
  const { push } = useRouter()

  const [isCepSearched, setIsCepSearched] = useState(false)

  const { data: gruposEconomicos } = useGrupoEconomicoQuery()

  const gruposOptions = useMemo(() => {
    if (!gruposEconomicos?.data) return []

    return gruposEconomicos.data
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .map((grupo) => ({
        text: grupo.nome,
        value: grupo.id,
      }))
  }, [gruposEconomicos])

  const { data: seguradora, isLoading } = useSeguradoraByIdQuery(id)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<EditSeguradoraSchema>({
    resolver: zodResolver(editSeguradoraFormSchema),
    values: {
      id: seguradora?.id || "",
      razaoSocial: seguradora?.razaoSocial || "",
      codigoSusep: seguradora?.codigoSusep || "",
      fantasia: seguradora?.fantasia || "",
      grupoEconomicoId: seguradora?.grupoEconomicoId || "",
      impostoRetido: seguradora?.impostoRetido,
      habilitarJuros: seguradora?.habilitarJuros || false,
      calculoDesconto: seguradora?.calculoDesconto || "",
      calculoDescontoPadrao: seguradora?.calculoDescontoPadrao || false,
      diretor: seguradora?.diretor || "",
      gerente: seguradora?.gerente || "",
      website: seguradora?.website || "",
      email: seguradora?.email || "",
      telefone: formatPhoneNumber(seguradora?.telefone) || "",
      telefoneSecundario:
        formatPhoneNumber(seguradora?.telefoneSecundario) || "",
      telefoneAssistencia24h:
        formatPhoneNumber(seguradora?.telefoneAssistencia24h) || "",
      observacoes: seguradora?.observacoes || "",
      cep: seguradora ? formatCep(seguradora.cep) : "",
      endereco: seguradora?.endereco || "",
      numero: seguradora?.numero || "",
      bairro: seguradora?.bairro || "",
      cidade: seguradora?.cidade || "",
      uf: seguradora?.uf || "",
    },
  })

  async function onSubmit(data: any) {
    try {
      await editSeguradora(data as Seguradora.UpdateRequest)
      toast.success("Seguradora editada com sucesso!")
      setTimeout(() => push("/seguradoras"), 2000)
    } catch (error) {
      toast.error("Erro ao editar fornecedor: " + error)
    }
  }

  if (!seguradora || isLoading) return <LoadingScreen />

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      {/* Dados Cadastrais */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Dados Cadastrais</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="razaoSocial">Nome</label>
            <Input.Root variant={errors.razaoSocial ? "error" : "primary"}>
              <Input.Control {...register("razaoSocial")} type="text" />
            </Input.Root>
            {errors.razaoSocial && (
              <span className="text-xs text-red-500">
                {errors.razaoSocial.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="codigoSusep">Susep</label>
            <Input.Root variant={errors.codigoSusep ? "error" : "primary"}>
              <Input.Control {...register("codigoSusep")} type="text" />
            </Input.Root>
            {errors.codigoSusep && (
              <span className="text-xs text-red-500">
                {errors.codigoSusep.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="cnpj">CNPJ</label>
            <Input.Root variant="disabled">
              <Input.Control
                value={formatDocumentNumber(seguradora.cnpj)}
                disabled
                type="text"
              />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="fantasia">Fantasia</label>
            <Input.Root variant="primary">
              <Input.Control {...register("fantasia")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <SelectInput
              options={gruposOptions}
              label="Grupo Econômico"
              field_name="grupoEconomicoId"
              {...register("grupoEconomicoId")}
            />
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Contato</h3>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="diretor">Diretor</label>
            <Input.Root variant="primary">
              <Input.Control {...register("diretor")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="gerente">Gerente</label>
            <Input.Root variant="primary">
              <Input.Control {...register("gerente")} type="text" />
            </Input.Root>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="email">Email</label>
            <Input.Root variant="primary">
              <Input.Control {...register("email")} type="email" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="telefone">Telefone</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("telefone", {
                  onChange: (e) => {
                    e.target.value = formatPhoneNumber(e.target.value)
                  },
                })}
                type="text"
              />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="telefoneSecundario">Telefone Secundário</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("telefoneSecundario", {
                  onChange: (e) => {
                    e.target.value = formatPhoneNumber(e.target.value)
                  },
                })}
                type="text"
              />
            </Input.Root>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="telefoneAssistencia24h">
              Telefone Assistência 24h
            </label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("telefoneAssistencia24h", {
                  onChange: (e) => {
                    e.target.value = formatPhoneNumber(e.target.value)
                  },
                })}
                type="text"
              />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="website">Website</label>
            <Input.Root variant="primary">
              <Input.Control {...register("website")} type="text" />
            </Input.Root>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Endereço</h3>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="cep">CEP</label>
              <Input.Root variant={errors.cep ? "error" : "primary"}>
                <Input.Icon>
                  <MagnifyingGlass className="mr-2 h-5 w-5" />
                </Input.Icon>
                <Input.Control
                  {...register("cep", {
                    onChange: (e) => {
                      const cleaned = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 8)
                      e.target.value = formatCep(cleaned)
                    },
                  })}
                  type="text"
                  onBlur={(e) => {
                    const cleanedCep = e.target.value.replace(/\D/g, "")
                    fetchCep(cleanedCep, setValue)
                    setIsCepSearched(true)
                  }}
                />
              </Input.Root>
              {errors.cep && (
                <span className="text-xs text-red-500">
                  {errors.cep.message}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="city">Cidade</label>
              <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
                <Input.Control {...register("cidade")} type="text" />
              </Input.Root>
              {errors.cidade && (
                <span className="text-xs text-red-500">
                  {errors.cidade.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="state">Estado</label>
              <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
                <Input.Control {...register("uf")} type="state" />
              </Input.Root>
              {errors.uf && (
                <span className="text-xs text-red-500">
                  {errors.uf.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="endereco">Endereço</label>
              <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
                <Input.Control
                  disabled={!isCepSearched}
                  {...register("endereco")}
                  type="text"
                />
              </Input.Root>
              {errors.endereco && (
                <span className="text-xs text-red-500">
                  {errors.endereco.message}
                </span>
              )}
            </div>

            <div className="flex max-w-[150px] flex-1 flex-col gap-2">
              <label htmlFor="Número">Número</label>
              <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
                <Input.Control
                  disabled={!isCepSearched}
                  {...register("numero")}
                  type="text"
                />
              </Input.Root>
              {errors.numero && (
                <span className="text-xs text-red-500">
                  {errors.numero.message}
                </span>
              )}
            </div>

            <div className="flex max-w-[200px] flex-1 flex-col gap-2">
              <label htmlFor="bairro">Bairro</label>
              <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
                <Input.Control
                  disabled={!isCepSearched}
                  {...register("bairro")}
                  type="text"
                />
              </Input.Root>
              {errors.bairro && (
                <span className="text-xs text-red-500">
                  {errors.bairro.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Impostos */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Impostos</h3>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="impostoRetido">Imposto Retido (%)</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("impostoRetido")}
                type="text"
                inputMode="decimal"
                onChange={(e) => {
                  normalizeDecimals(e.target, 2)
                }}
              />
            </Input.Root>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="calculoDesconto">Cálculo Desconto</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("calculoDesconto")}
                type="text"
                inputMode="decimal"
                onChange={(e) => {
                  normalizeDecimals(e.target, 2)
                }}
              />
            </Input.Root>
          </div>

          <div className="flex items-center gap-2">
            <input
              {...register("habilitarJuros")}
              type="checkbox"
              id="habilitarJuros"
              defaultChecked={seguradora.habilitarJuros}
            />
            <label htmlFor="habilitarJuros">Habilitar Juros</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              {...register("calculoDescontoPadrao")}
              type="checkbox"
              id="calculoDescontoPadrao"
              defaultChecked={seguradora.calculoDescontoPadrao}
            />
            <label htmlFor="calculoDescontoPadrao">
              Cálculo Desconto Padrão
            </label>
          </div>
        </div>
      </div>

      {/* Outros */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Outros</h3>
        <div className="flex flex-col gap-2">
          <label htmlFor="observacoes">Observações</label>
          <Input.Root variant="primary">
            <Input.Control {...register("observacoes")} type="text" />
          </Input.Root>
        </div>
      </div>

      <div className="my-2 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/seguradoras")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
