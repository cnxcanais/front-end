"use client"

import { Seguradora } from "@/@types/seguradora"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { fetchCep } from "@/core/utils/findCep"
import { formatDocumentNumber } from "@/core/utils/formatDocumentNumber"
import { useSeguradoraByIdQuery } from "@/modules/seguradoras-components/edit-seguradora/infra/hooks/use-seguradora-by-id-query"
import { editSeguradora } from "@/modules/seguradoras-components/edit-seguradora/infra/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  EditSeguradoraSchema,
  editSeguradoraFormSchema,
} from "../validation/schema"

export function EditSeguradoraForm({ id }: { id: string }) {
  const { push } = useRouter()

  const [isCepSearched, setIsCepSearched] = useState(false)

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
      cnpjFormatado: seguradora?.cnpjFormatado || "",
      codigoSusep: seguradora?.codigoSusep || "",
      cep: seguradora?.cep || "",
      endereco: seguradora?.endereco || "",
      numero: seguradora?.numero || "",
      bairro: seguradora?.bairro || "",
      cidade: seguradora?.cidade || "",
      uf: seguradora?.uf || "",
    },
  })

  async function onSubmit(data: Seguradora.UpdateRequest) {
    try {
      await editSeguradora(data)
      toast.success("Fornecedor editado com sucesso!")
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
      <div className="flex flex-col gap-4">
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
            <label htmlFor="cnpjFormatado">CNPJ</label>
            <Input.Root variant={errors.cnpjFormatado ? "error" : "primary"}>
              <Input.Control
                {...register("cnpjFormatado", {
                  onChange: (e) => {
                    const formatted = formatDocumentNumber(e.target.value)
                    e.target.value = formatted
                  },
                })}
                type="text"
              />
            </Input.Root>
            {errors.cnpjFormatado && (
              <span className="text-xs text-red-500">
                {errors.cnpjFormatado.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="address_1">Susep</label>
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

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="cep">CEP</label>
              <Input.Root variant={errors.cep ? "error" : "primary"}>
                <Input.Icon>
                  <MagnifyingGlass className="mr-2 h-5 w-5" />
                </Input.Icon>
                <Input.Control
                  {...register("cep")}
                  type="text"
                  onBlur={(e) => {
                    fetchCep(e.target.value, setValue)
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
                  type="number"
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
