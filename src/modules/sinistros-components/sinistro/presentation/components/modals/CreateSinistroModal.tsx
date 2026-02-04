"use client"

import { Proposta } from "@/@types/proposta"
import { Sinistro } from "@/@types/sinistro"
import { AutocompleteInput } from "@/core/components/AutocompleteInput"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Modal } from "@/core/components/Modals/Modal"
import { getCookie } from "@/lib/cookies"
import { queryClient } from "@/lib/react-query"
import { usePropostaQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-query"
import { useTipoSinistroQuery } from "@/modules/tipos-sinistros-components/tipos-sinistros/infra/hooks/use-tipo-sinistro-query"
import { useUsuarioQuery } from "@/modules/usuarios-components/usuario/infra/hooks/use-usuario-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createSinistro } from "../../../infra/remote"
import {
  createSinistroSchema,
  type CreateSinistroSchema,
} from "../../validation/schema"

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  isAdmin?: boolean
}

export function CreateSinistroModal({
  open,
  onClose,
  onSuccess,
  isAdmin,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSinistroSchema>({
    resolver: zodResolver(createSinistroSchema),
  })

  const { data: tiposSinistros } = useTipoSinistroQuery(1, -1)
  const { data: propostas } = usePropostaQuery(1, -1, {
    situacao: "Ativo",
  })

  const [selectedProposta, setSelectedProposta] = useState<Proposta>()

  const corretoraId = getCookie("corretoraId")
  const apoliceId = watch("apoliceId")

  const { data: usuarios } = useUsuarioQuery(1, -1)

  const filteredUsuarios = useMemo(() => {
    if (!usuarios) return []
    if (isAdmin) {
      return usuarios.data
    }
    return usuarios.data.filter((u) => u.props.corretoraId === corretoraId)
  }, [usuarios, isAdmin, corretoraId])

  useEffect(() => {
    if (propostas && apoliceId) {
      const proposta = propostas.data.find((p) => p.id === apoliceId)
      setSelectedProposta(proposta)
    } else {
      setSelectedProposta(undefined)
    }
  }, [apoliceId, propostas])

  const tiposSinistrosOptions = useMemo(() => {
    if (!tiposSinistros) return []
    return tiposSinistros.data
      .filter((t) => t.ramo?.id === selectedProposta?.ramoId)
      .map((tipo) => ({
        text: tipo.descricao,
        value: tipo.id,
      }))
  }, [tiposSinistros, selectedProposta])

  const usuariosOptions = useMemo(() => {
    if (!filteredUsuarios) return []
    return filteredUsuarios.map((usuario) => ({
      text: usuario.props.nome,
      value: usuario.props.id,
    }))
  }, [filteredUsuarios])

  const propostasOptions = useMemo(() => {
    if (!propostas) return []
    const filteredPropostas =
      isAdmin ?
        propostas.data.filter((p) => p.tipoDocumento !== "Proposta")
      : propostas.data.filter(
          (p) => p.corretoraId === corretoraId && p.tipoDocumento !== "Proposta"
        )
    return filteredPropostas.map((proposta) => ({
      text: `${proposta.numeroProposta} - ${proposta.seguradoNome}`,
      value: proposta.id,
    }))
  }, [propostas, isAdmin, corretoraId])

  const onSubmit = async (data: CreateSinistroSchema) => {
    try {
      await createSinistro(data as Sinistro.PostBody)
      reset()
      await queryClient.invalidateQueries({ queryKey: ["sinistros"] })
      toast.success("Sinistro criado com sucesso!")
      onSuccess()
      onClose()
    } catch (error) {
      toast.error("Erro ao criar sinistro: " + error?.response?.data?.message)
    }
  }

  return (
    <Modal title="Criar Sinistro" open={open} onClose={onClose} size="large">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block">Número Sinistro *</label>
            <Input.Root className="min-w-80 text-sm">
              <Input.Control type="text" {...register("numeroSinistro")} />
            </Input.Root>
            {errors.numeroSinistro && (
              <span className="text-xs text-red-500">
                {errors.numeroSinistro.message}
              </span>
            )}
          </div>
          <div>
            <AutocompleteInput
              options={propostasOptions}
              label="Apólice *"
              field_name="apoliceId"
              {...register("apoliceId")}
            />
            {errors.apoliceId && (
              <span className="text-xs text-red-500">
                {errors.apoliceId.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <AutocompleteInput
              options={tiposSinistrosOptions}
              label="Tipo Sinistro *"
              field_name="tipoSinistroId"
              {...register("tipoSinistroId")}
            />
            {errors.tipoSinistroId && (
              <span className="text-xs text-red-500">
                {errors.tipoSinistroId.message}
              </span>
            )}
          </div>
          <div>
            <label className="mb-2 block">Email Segurado *</label>
            <Input.Root className="min-w-80 text-sm">
              <Input.Control type="email" {...register("emailSegurado")} />
            </Input.Root>
            {errors.emailSegurado && (
              <span className="text-xs text-red-500">
                {errors.emailSegurado.message}
              </span>
            )}
          </div>
          <div>
            <label>Data/Hora Ocorrido *</label>
            <Input.Root className="min-w-80 text-sm">
              <Input.Control
                type="datetime-local"
                {...register("dataHoraOcorrido")}
              />
            </Input.Root>
            {errors.dataHoraOcorrido && (
              <span className="text-xs text-red-500">
                {errors.dataHoraOcorrido.message}
              </span>
            )}
          </div>
          <div>
            <label>Prestadora</label>
            <Input.Root className="min-w-80 text-sm">
              <Input.Control type="text" {...register("prestadora")} />
            </Input.Root>
            {errors.prestadora && (
              <span className="text-xs text-red-500">
                {errors.prestadora.message}
              </span>
            )}
          </div>
          <div>
            <label>Andamento</label>
            <Input.Root className="min-w-80 text-sm">
              <Input.Control type="text" {...register("andamento")} />
            </Input.Root>
            {errors.andamento && (
              <span className="text-xs text-red-500">
                {errors.andamento.message}
              </span>
            )}
          </div>
          <div>
            <label>Data Última Tratativa *</label>
            <Input.Root className="min-w-80 text-sm">
              <Input.Control type="date" {...register("dataUltimaTratativa")} />
            </Input.Root>
            {errors.dataUltimaTratativa && (
              <span className="text-xs text-red-500">
                {errors.dataUltimaTratativa.message}
              </span>
            )}
          </div>
          <div>
            <AutocompleteInput
              options={usuariosOptions}
              label="Responsável Usuário *"
              field_name="responsavelUsuarioId"
              {...register("responsavelUsuarioId")}
            />
            {errors.responsavelUsuarioId && (
              <span className="text-xs text-red-500">
                {errors.responsavelUsuarioId.message}
              </span>
            )}
          </div>
        </div>
        <div>
          <label>Descrição do Ocorrido *</label>
          <textarea
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            {...register("descricaoOcorrido")}
            rows={4}
          />
          {errors.descricaoOcorrido && (
            <span className="text-xs text-red-500">
              {errors.descricaoOcorrido.message}
            </span>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="primary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Sinistro"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
