"use client"

import { Corretora } from "@/@types/corretora"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { fetchCep } from "@/core/utils/findCep"
import { formatDocumentNumber } from "@/core/utils/formatDocumentNumber"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { useCorretoraByIdQuery } from "@/modules/corretoras-components/edit-corretora/infra/hooks/use-corretora-by-id-query"
import { editCorretora } from "@/modules/corretoras-components/edit-corretora/infra/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  EditCorretoraSchema,
  editCorretoraFormSchema,
} from "../validation/schema"

export function EditCorretoraForm({ id }: { id: string }) {
  const { push } = useRouter()
  const [isCepSearched, setIsCepSearched] = useState(false)

  const { data: corretora, isLoading } = useCorretoraByIdQuery(id)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<EditCorretoraSchema>({
    resolver: zodResolver(editCorretoraFormSchema),
    values: {
      id: corretora?.id || "",
      razaoSocial: corretora?.razaoSocial || "",
      nomeFantasia: corretora?.nomeFantasia || "",
      cnpjCpfFormatado: corretora?.cnpjCpfFormatado || "",
      codigoSusep: corretora?.codigoSusep || "",
      cepFormatado: corretora?.cepFormatado || "",
      endereco: corretora?.endereco || "",
      numero: corretora?.numero || "",
      complemento: corretora?.complemento || "",
      bairro: corretora?.bairro || "",
      cidade: corretora?.cidade || "",
      uf: corretora?.uf || "",
      email: corretora?.email || "",
      telefone: corretora?.telefone || "",
      telefoneSecundario: corretora?.telefoneSecundario || "",
      website: corretora?.website || "",
      percentualComissao: corretora?.percentualComissao || 0,
      observacoes: corretora?.observacoes || "",
      consentimentoLgpd: corretora?.consentimentoLgpd || false,
    },
  })

  async function onSubmit(data: Corretora.UpdateRequest) {
    try {
      await editCorretora(data)
      toast.success("Corretora editada com sucesso!")
      setTimeout(() => push("/corretoras"), 2000)
    } catch (error) {
      toast.error("Erro ao editar corretora: " + error)
    }
  }

  if (!corretora || isLoading) return <LoadingScreen />

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="razaoSocial">Razão Social</label>
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
            <label htmlFor="nomeFantasia">Nome Fantasia</label>
            <Input.Root variant={errors.nomeFantasia ? "error" : "primary"}>
              <Input.Control {...register("nomeFantasia")} type="text" />
            </Input.Root>
            {errors.nomeFantasia && (
              <span className="text-xs text-red-500">
                {errors.nomeFantasia.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="cnpjCpfFormatado">CNPJ/CPF</label>
            <Input.Root
              variant={errors.cnpjCpfFormatado ? "error" : "disabled"}>
              <Input.Control
                {...register("cnpjCpfFormatado", {
                  onChange: (e) => {
                    e.target.value = formatDocumentNumber(e.target.value)
                  },
                })}
                type="text"
                disabled
              />
            </Input.Root>
            {errors.cnpjCpfFormatado && (
              <span className="text-xs text-red-500">
                {errors.cnpjCpfFormatado.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="codigoSusep">Código Susep</label>
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
          <div className="flex flex-col gap-2">
            <label htmlFor="cepFormatado">CEP</label>
            <Input.Root variant={errors.cepFormatado ? "error" : "primary"}>
              <Input.Icon>
                <MagnifyingGlass className="mr-2 h-5 w-5" />
              </Input.Icon>
              <Input.Control
                {...register("cepFormatado")}
                type="text"
                onBlur={(e) => {
                  fetchCep(e.target.value, setValue)
                  setIsCepSearched(true)
                }}
              />
            </Input.Root>
            {errors.cepFormatado && (
              <span className="text-xs text-red-500">
                {errors.cepFormatado.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="cidade">Cidade</label>
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
            <label htmlFor="uf">Estado</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control {...register("uf")} type="text" />
            </Input.Root>
            {errors.uf && (
              <span className="text-xs text-red-500">{errors.uf.message}</span>
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
            <label htmlFor="numero">Número</label>
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
            <label htmlFor="complemento">Complemento</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control
                disabled={!isCepSearched}
                {...register("complemento")}
                type="text"
              />
            </Input.Root>
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

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="email">Email</label>
            <Input.Root variant={errors.email ? "error" : "primary"}>
              <Input.Control {...register("email")} type="email" />
            </Input.Root>
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="telefone">Telefone</label>
            <Input.Root variant={errors.telefone ? "error" : "primary"}>
              <Input.Control
                {...register("telefone", {
                  onChange: (e) => {
                    e.target.value = formatPhoneNumber(e.target.value)
                  },
                })}
                type="text"
              />
            </Input.Root>
            {errors.telefone && (
              <span className="text-xs text-red-500">
                {errors.telefone.message}
              </span>
            )}
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
            <label htmlFor="website">Website</label>
            <Input.Root variant={errors.website ? "error" : "primary"}>
              <Input.Control {...register("website")} type="text" />
            </Input.Root>
            {errors.website && (
              <span className="text-xs text-red-500">
                {errors.website.message}
              </span>
            )}
          </div>

          <div className="flex max-w-[200px] flex-1 flex-col gap-2">
            <label htmlFor="percentualComissao">% Comissão</label>
            <Input.Root
              variant={errors.percentualComissao ? "error" : "primary"}>
              <Input.Control
                {...register("percentualComissao")}
                type="number"
                step="0.01"
              />
            </Input.Root>
            {errors.percentualComissao && (
              <span className="text-xs text-red-500">
                {errors.percentualComissao.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="observacoes">Observações</label>
          <Input.Root variant="primary">
            <Input.Control {...register("observacoes")} type="text" />
          </Input.Root>
        </div>

        <div className="flex items-center gap-2">
          <input
            {...register("consentimentoLgpd")}
            type="checkbox"
            id="consentimentoLgpd"
          />
          <label htmlFor="consentimentoLgpd">Consentimento LGPD</label>
        </div>
      </div>

      <div className="my-2 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/corretoras")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
