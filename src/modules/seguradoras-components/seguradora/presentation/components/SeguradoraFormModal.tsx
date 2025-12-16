"use client"

import { Seguradora } from "@/@types/seguradora"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { SelectInput } from "@/core/components/SelectInput"
import { fetchCep } from "@/core/utils/findCep"
import { formatCep } from "@/core/utils/format-cep"
import { formatDocumentNumber } from "@/core/utils/formatDocumentNumber"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { useGrupoEconomicoQuery } from "@/modules/grupos-economicos-components/grupos-economicos/infra/hooks/use-grupo-economico-query"
import { createSeguradora } from "@/modules/seguradoras-components/create-seguradora/infra/remote/create-seguradora"
import { createSeguradoraFormSchema } from "@/modules/seguradoras-components/create-seguradora/presentation/validation/schema"
import { editSeguradora } from "@/modules/seguradoras-components/edit-seguradora/infra/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface SeguradoraFormModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  seguradora?: Seguradora.Type
}

export function SeguradoraFormModal({
  open,
  onClose,
  onSuccess,
  seguradora,
}: SeguradoraFormModalProps) {
  const [isCepSearched, setIsCepSearched] = useState(!!seguradora)
  const isEditMode = !!seguradora

  const { data: gruposEconomicos } = useGrupoEconomicoQuery(1, 100)

  const gruposOptions = useMemo(() => {
    if (!gruposEconomicos?.data) return []
    return gruposEconomicos.data
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .map((grupo) => ({ text: grupo.nome, value: grupo.id }))
  }, [gruposEconomicos])

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(createSeguradoraFormSchema),
  })

  useEffect(() => {
    if (seguradora) {
      reset({
        razaoSocial: seguradora.razaoSocial,
        codigoSusep: seguradora.codigoSusep,
        cnpj: seguradora.cnpj,
        fantasia: seguradora.fantasia,
        grupoEconomicoId: seguradora.grupoEconomicoId,
        diretor: seguradora.diretor,
        gerente: seguradora.gerente,
        email: seguradora.email,
        telefone: seguradora.telefone,
        telefoneSecundario: seguradora.telefoneSecundario,
        telefoneAssistencia24h: seguradora.telefoneAssistencia24h,
        website: seguradora.website,
        cep: seguradora.cep,
        endereco: seguradora.endereco,
        numero: seguradora.numero,
        complemento: seguradora.complemento,
        bairro: seguradora.bairro,
        cidade: seguradora.cidade,
        uf: seguradora.uf,
        impostoRetido: seguradora.impostoRetido,
        calculoDesconto: seguradora.calculoDesconto,
        habilitarJuros: seguradora.habilitarJuros,
        calculoDescontoPadrao: seguradora.calculoDescontoPadrao,
        observacoes: seguradora.observacoes,
      })
    } else {
      reset({})
    }
  }, [seguradora, reset])

  async function onSubmit(data: any) {
    try {
      if (isEditMode) {
        await editSeguradora({ ...data, id: seguradora.id })
        toast.success("Seguradora atualizada com sucesso!")
      } else {
        await createSeguradora(data)
        toast.success("Seguradora criada com sucesso!")
      }
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(`Erro ao ${isEditMode ? "atualizar" : "criar"} seguradora`)
    }
  }

  return (
    <Modal
      title={isEditMode ? "Editar Seguradora" : "Nova Seguradora"}
      onClose={onClose}
      open={open}
      size="xlarge">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div>
            <label>Razão Social *</label>
            <Input.Root
              className="mt-2"
              variant={errors.razaoSocial ? "error" : "primary"}>
              <Input.Control {...register("razaoSocial")} />
            </Input.Root>
            {errors.razaoSocial && (
              <span className="text-xs text-red-500">
                {String(errors.razaoSocial.message)}
              </span>
            )}
          </div>
          <div>
            <label>CNPJ *</label>
            <Input.Root
              className="mt-2"
              variant={errors.cnpj ? "error" : "primary"}>
              <Input.Control
                {...register("cnpj", {
                  onChange: (e) => {
                    e.target.value = formatDocumentNumber(e.target.value)
                  },
                })}
                disabled={isEditMode}
              />
            </Input.Root>
            {errors.cnpj && (
              <span className="text-xs text-red-500">
                {String(errors.cnpj.message)}
              </span>
            )}
          </div>
          <div>
            <label>Código SUSEP</label>
            <Input.Root className="mt-2">
              <Input.Control {...register("codigoSusep")} />
            </Input.Root>
          </div>
          <div>
            <label>Nome Fantasia</label>
            <Input.Root className="mt-2">
              <Input.Control {...register("fantasia")} />
            </Input.Root>
          </div>
          <div>
            <SelectInput
              label="Grupo Econômico"
              field_name="grupoEconomicoId"
              options={gruposOptions}
              {...register("grupoEconomicoId")}
            />
          </div>
          <div>
            <label>Email</label>
            <Input.Root className="mt-2">
              <Input.Control {...register("email")} type="email" />
            </Input.Root>
          </div>
          <div>
            <label>Telefone</label>
            <Input.Root className="mt-2">
              <Input.Control
                {...register("telefone", {
                  onChange: (e) => {
                    e.target.value = formatPhoneNumber(e.target.value)
                  },
                })}
              />
            </Input.Root>
          </div>
          <div>
            <label>CEP</label>
            <Input.Root className="mt-2">
              <Input.Icon>
                <MagnifyingGlass className="mr-2 h-5 w-5" />
              </Input.Icon>
              <Input.Control
                {...register("cep", {
                  onChange: (e) => {
                    e.target.value = formatCep(
                      e.target.value.replace(/\D/g, "").slice(0, 8)
                    )
                  },
                })}
                onBlur={(e) => {
                  const cleanedCep = e.target.value.replace(/\D/g, "")
                  fetchCep(cleanedCep, setValue)
                  setIsCepSearched(true)
                }}
              />
            </Input.Root>
          </div>
          <div>
            <label>Cidade</label>
            <Input.Root className="mt-2">
              <Input.Control {...register("cidade")} />
            </Input.Root>
          </div>
          <div>
            <label>UF</label>
            <Input.Root className="mt-2">
              <Input.Control {...register("uf")} />
            </Input.Root>
          </div>
          <div>
            <label>Endereço</label>
            <Input.Root className="mt-2">
              <Input.Control {...register("endereco")} />
            </Input.Root>
          </div>
          <div>
            <label>Número</label>
            <Input.Root className="mt-2">
              <Input.Control {...register("numero")} />
            </Input.Root>
          </div>
          <div>
            <label>Bairro</label>
            <Input.Root className="mt-2">
              <Input.Control {...register("bairro")} />
            </Input.Root>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" onClick={onClose} variant="tertiary">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="secondary">
            {isEditMode ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
