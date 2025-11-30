"use client"

import { Segurado } from "@/@types/segurado"
import { AutocompleteInput } from "@/core/components/AutocompleteInput"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { fetchCep } from "@/core/utils/findCep"
import { formatCep } from "@/core/utils/format-cep"
import { formatDocumentNumber } from "@/core/utils/formatDocumentNumber"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { useBancosQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-banco-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { useSeguradoByIdQuery } from "@/modules/segurados-components/segurado/infra/hooks/use-segurado-by-id-query"
import {
  EstadoCivilLabels,
  SexoLabels,
  StatusSeguradoLabels,
  TipoContaLabels,
} from "@/modules/segurados-components/types/form-enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { updateSegurado } from "../../infra/remote/update-segurado"
import {
  UpdateSeguradoSchema,
  updateSeguradoFormSchema,
} from "../validation/schema"

type EditSeguradoFormProps = {
  id: string
}

export function EditSeguradoForm({ id }: EditSeguradoFormProps) {
  const { push } = useRouter()
  const [isCepSearched, setIsCepSearched] = useState(false)

  const { data: seguradoData, isLoading } = useSeguradoByIdQuery(id)
  const { data: produtoresData } = useProdutorQuery()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm<UpdateSeguradoSchema>({
    resolver: zodResolver(updateSeguradoFormSchema),
  })

  const tipoPessoaWatch = useWatch({ control, name: "tipoPessoa" as any }) as
    | string
    | undefined
  const tipoPessoa = tipoPessoaWatch ?? seguradoData?.tipoPessoa

  const nomeRazaoSocialValue = useWatch({
    control,
    name: "nomeRazaoSocial" as any,
  }) as string | undefined
  const grupoValue = useWatch({ control, name: "grupo" as any }) as
    | string
    | undefined
  const statusValue = useWatch({ control, name: "status" as any }) as
    | string
    | undefined
  const emailValue = useWatch({ control, name: "email" as any }) as
    | string
    | undefined
  const vencimentoCnhValue = useWatch({
    control,
    name: "vencimentoCnh" as any,
  }) as string | undefined
  const representanteLegalNomeValue = useWatch({
    control,
    name: "representanteLegalNome" as any,
  }) as string | undefined
  const representanteLegalCpfValue = useWatch({
    control,
    name: "representanteLegalCpf" as any,
  }) as string | undefined
  const bancoValue = useWatch({ control, name: "banco" as any }) as
    | string
    | undefined
  const { data: bancosData } = useBancosQuery()

  const bancosOptions = useMemo(() => {
    if (!bancosData) return []

    return bancosData
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((banco) => ({
        text: `${banco.name} - ${banco.code}`,
        value: banco.code,
      }))
  }, [bancosData])

  const produtoresOptions = useMemo(() => {
    if (!produtoresData?.data) return []

    return produtoresData.data
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .map((produtor) => ({
        text: produtor.nome,
        value: produtor.id,
      }))
  }, [produtoresData])

  useEffect(() => {
    if (seguradoData) {
      setValue("nomeRazaoSocial", seguradoData.nomeRazaoSocial)
      setValue("grupo", seguradoData.grupo)
      setValue("status", seguradoData.status)
      setValue(
        "representanteLegalNome",
        seguradoData.representanteLegalNome || ""
      )
      setValue(
        "representanteLegalCpf",
        seguradoData.representanteLegalCpf || ""
      )
      setValue("rg", seguradoData.rg)
      setValue("orgaoEmissor", seguradoData.orgaoEmissor)
      setValue("dataNascimento", seguradoData.dataNascimento)
      setValue("sexo", seguradoData.sexo)
      setValue("estadoCivil", seguradoData.estadoCivil)
      setValue("telefone", seguradoData.telefone)
      setValue("celular", seguradoData.celular)
      setValue("email", seguradoData.email)
      setValue("cep", seguradoData.cep)
      setValue("logradouro", seguradoData.logradouro)
      setValue("numero", seguradoData.numero)
      setValue("complemento", seguradoData.complemento)
      setValue("bairro", seguradoData.bairro)
      setValue("cidade", seguradoData.cidade)
      setValue("uf", seguradoData.uf)
      setValue("nomeContato", seguradoData.nomeContato)
      setValue("cargoContato", seguradoData.cargoContato)
      setValue("ramoAtividade", seguradoData.ramoAtividade)
      setValue("vencimentoCnh", seguradoData.vencimentoCnh)
      setValue("indicadoPor", seguradoData.indicadoPor)
      setValue("banco", seguradoData.banco)
      setValue("agencia", seguradoData.agencia)
      setValue("conta", seguradoData.conta)
      setValue("digitoConta", seguradoData.digitoConta)
      setValue("tipoConta", seguradoData.tipoConta)
      setValue("pix", seguradoData.pix)
      setValue("produtorId", seguradoData.produtorId)
      setValue("supervisor", seguradoData.supervisor)
      setValue("canalVendas", seguradoData.canalVendas)
      setValue("observacoes", seguradoData.observacoes)
      setIsCepSearched(true)
    }
  }, [seguradoData, setValue])

  async function onSubmit(data: Segurado.UpdateRequest) {
    try {
      await updateSegurado(id, data)
      toast.success("Segurado atualizado com sucesso!")
      setTimeout(() => push("/segurados"), 2000)
    } catch (error) {
      toast.error("Erro ao atualizar segurado: " + error)
    }
  }

  if (isLoading) return <LoadingScreen />

  return (
    <form
      className="mt-6 flex max-w-[1200px] flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}>
      {/* Dados Pessoais */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Dados Pessoais</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Nome/Razão Social</label>
            <Input.Root
              variant={
                errors.nomeRazaoSocial ? "error"
                : (
                  !nomeRazaoSocialValue ||
                  nomeRazaoSocialValue?.toString().trim() === ""
                ) ?
                  "error"
                : "primary"
              }>
              <Input.Control {...register("nomeRazaoSocial")} type="text" />
            </Input.Root>
            {errors.nomeRazaoSocial && (
              <span className="text-xs text-red-500">
                {errors.nomeRazaoSocial.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <SelectInput
              options={StatusSeguradoLabels}
              label="Status"
              field_name="status"
              style={{
                borderColor:
                  errors.status || !statusValue ? "rgb(239 68 68)" : undefined,
              }}
              {...register("status")}
            />
            {errors.status && (
              <span className="text-xs text-red-500">
                {errors.status.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Grupo</label>
            <Input.Root
              variant={
                errors.grupo ? "error"
                : !grupoValue || grupoValue?.toString().trim() === "" ?
                  "error"
                : "primary"
              }>
              <Input.Control {...register("grupo")} type="text" />
            </Input.Root>
            {errors.grupo && (
              <span className="text-xs text-red-500">
                {errors.grupo.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dados Pessoais Adicionais */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Dados Adicionais</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>RG</label>
            <Input.Root variant="primary">
              <Input.Control {...register("rg")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Órgão Emissor</label>
            <Input.Root variant="primary">
              <Input.Control {...register("orgaoEmissor")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Data de Nascimento</label>
            <Input.Root variant="primary">
              <Input.Control {...register("dataNascimento")} type="date" />
            </Input.Root>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <SelectInput
              options={SexoLabels}
              label="Sexo"
              field_name="sexo"
              {...register("sexo")}
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <SelectInput
              options={EstadoCivilLabels}
              label="Estado Civil"
              field_name="estadoCivil"
              {...register("estadoCivil")}
            />
          </div>

          {tipoPessoa === "JURIDICA" && (
            <div className="flex flex-col gap-4 border-l-4 border-yellow-400 bg-yellow-50 p-4">
              <h4 className="font-semibold text-yellow-800">
                Dados do Representante Legal
              </h4>
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-2">
                  <label>Nome do Representante Legal *</label>
                  <Input.Root
                    variant={
                      errors.representanteLegalNome ? "error" : "primary"
                    }>
                    <Input.Control
                      {...register("representanteLegalNome")}
                      type="text"
                    />
                  </Input.Root>
                  {errors.representanteLegalNome && (
                    <span className="text-xs text-red-500">
                      {errors.representanteLegalNome.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <label>CPF do Representante Legal *</label>
                  <Input.Root
                    variant={
                      errors.representanteLegalCpf ? "error" : "primary"
                    }>
                    <Input.Control
                      {...register("representanteLegalCpf", {
                        onChange: (e) => {
                          e.target.value = formatDocumentNumber(e.target.value)
                        },
                      })}
                      type="text"
                    />
                  </Input.Root>
                  {errors.representanteLegalCpf && (
                    <span className="text-xs text-red-500">
                      {errors.representanteLegalCpf.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Ramo de Atividade</label>
            <Input.Root variant="primary">
              <Input.Control {...register("ramoAtividade")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Vencimento CNH *</label>
            <Input.Root variant="primary">
              <Input.Control {...register("vencimentoCnh")} type="date" />
            </Input.Root>
            {errors.vencimentoCnh && (
              <span className="text-xs text-red-500">
                {errors.vencimentoCnh.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Contato</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Email</label>
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
            <label>Telefone</label>
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
            <label>Celular</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("celular", {
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
            <label>Nome do Contato</label>
            <Input.Root variant="primary">
              <Input.Control {...register("nomeContato")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Cargo do Contato</label>
            <Input.Root variant="primary">
              <Input.Control {...register("cargoContato")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Canal de Vendas</label>
            <Input.Root variant="primary">
              <Input.Control {...register("canalVendas")} type="text" />
            </Input.Root>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Endereço</h3>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <label>CEP</label>
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
                }}
              />
            </Input.Root>
            {errors.cep && (
              <span className="text-xs text-red-500">{errors.cep.message}</span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Logradouro</label>
            <Input.Root variant="primary">
              <Input.Control {...register("logradouro")} type="text" />
            </Input.Root>
          </div>

          <div className="flex max-w-[150px] flex-col gap-2">
            <label>Número</label>
            <Input.Root variant="primary">
              <Input.Control {...register("numero")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Complemento</label>
            <Input.Root variant="primary">
              <Input.Control {...register("complemento")} type="text" />
            </Input.Root>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Bairro</label>
            <Input.Root variant="primary">
              <Input.Control {...register("bairro")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Cidade</label>
            <Input.Root variant="primary">
              <Input.Control {...register("cidade")} type="text" />
            </Input.Root>
          </div>

          <div className="flex max-w-[150px] flex-col gap-2">
            <label>UF</label>
            <Input.Root variant="primary">
              <Input.Control {...register("uf")} type="text" />
            </Input.Root>
          </div>
        </div>
      </div>

      {/* Dados Bancários */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Dados Bancários</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <AutocompleteInput
              options={bancosOptions}
              label="Banco"
              field_name="banco"
              variant={
                errors.banco ? "error"
                : !bancoValue || bancoValue?.toString().trim() === "" ?
                  "error"
                : "primary"
              }
              {...register("banco")}
            />
            {errors.banco && (
              <span className="text-xs text-red-500">
                {errors.banco.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Agência</label>
            <Input.Root variant="primary">
              <Input.Control {...register("agencia")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Conta</label>
            <Input.Root variant="primary">
              <Input.Control {...register("conta")} type="text" />
            </Input.Root>
          </div>

          <div className="flex max-w-[150px] flex-col gap-2">
            <label>Dígito</label>
            <Input.Root variant="primary">
              <Input.Control {...register("digitoConta")} type="text" />
            </Input.Root>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <SelectInput
              options={TipoContaLabels}
              label="Tipo de Conta"
              field_name="tipoConta"
              {...register("tipoConta")}
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>PIX</label>
            <Input.Root variant="primary">
              <Input.Control {...register("pix")} type="text" />
            </Input.Root>
          </div>
        </div>
      </div>

      {/* Informações Comerciais */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Informações Comerciais</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <AutocompleteInput
              options={produtoresOptions}
              label="Produtor"
              field_name="produtorId"
              {...register("produtorId")}
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Supervisor</label>
            <Input.Root variant="primary">
              <Input.Control {...register("supervisor")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Indicado Por</label>
            <Input.Root variant="primary">
              <Input.Control {...register("indicadoPor")} type="text" />
            </Input.Root>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label>Observações</label>
          <Input.Root variant="primary">
            <Input.Control {...register("observacoes")} />
          </Input.Root>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="tertiary"
          onClick={() => push("/segurados")}>
          Cancelar
        </Button>
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  )
}
