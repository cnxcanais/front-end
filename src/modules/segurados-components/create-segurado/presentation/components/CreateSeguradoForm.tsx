"use client"

import { Segurado } from "@/@types/segurado"
import { AutocompleteInput } from "@/core/components/AutocompleteInput"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { SelectInput } from "@/core/components/SelectInput"
import { fetchCep } from "@/core/utils/findCep"
import { formatCep } from "@/core/utils/format-cep"
import { formatDocumentNumber } from "@/core/utils/formatDocumentNumber"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useBancosQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-banco-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { useRamoQuery } from "@/modules/ramos-components/ramos/infra/hooks/use-ramo-query"
import {
  EstadoCivilLabels,
  SexoLabels,
  StatusSeguradoLabels,
  TipoContaLabels,
  TipoPessoaLabels,
} from "@/modules/segurados-components/types/form-enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { createSegurado } from "../../infra/remote/create-segurado"
import {
  CreateSeguradoSchema,
  createSeguradoFormSchema,
} from "../validation/schema"

export function CreateSeguradoForm() {
  const { push } = useRouter()
  const [isCepSearched, setIsCepSearched] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = useForm<CreateSeguradoSchema>({
    resolver: zodResolver(createSeguradoFormSchema),
  })

  console.log(errors)

  const tipoPessoa = useWatch({ control, name: "tipoPessoa" })
  const { data: corretorasData } = useCorretoraQuery()
  const { data: bancosData } = useBancosQuery()
  const nomeRazaoSocialValue = useWatch({
    control,
    name: "nomeRazaoSocial" as any,
  }) as string | undefined

  const corretoraId = watch("corretoraId")

  const { data: produtoresData } = useProdutorQuery(1, -1, { corretoraId })
  const { data: ramosData } = useRamoQuery()

  const ramosOptions = useMemo(() => {
    if (!ramosData?.data) return []

    return ramosData.data
      .sort((a, b) => a.descricao.localeCompare(b.descricao))
      .map((ramo) => ({
        text: ramo.descricao,
        value: ramo.id,
      }))
  }, [corretorasData])

  const corretorasOptions = useMemo(() => {
    if (!corretorasData?.data) return []

    return corretorasData.data
      .sort((a, b) => a.razaoSocial.localeCompare(b.razaoSocial))
      .map((corretora) => ({
        text: corretora.razaoSocial,
        value: corretora.id,
      }))
  }, [corretorasData])

  const produtoresOptions = useMemo(() => {
    if (!produtoresData?.data) return []

    return produtoresData.data
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .map((produtor) => ({
        text: produtor.nome,
        value: produtor.id,
      }))
  }, [produtoresData])

  const bancosOptions = useMemo(() => {
    if (!bancosData) return []

    return bancosData
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((banco) => ({
        text: `${banco.name} - ${banco.code}`,
        value: banco.code,
      }))
  }, [bancosData])

  async function onSubmit(data: Segurado.CreateRequest) {
    try {
      await createSegurado(data)
      toast.success("Segurado criado com sucesso!")
      setTimeout(() => push("/segurados"), 2000)
    } catch (error) {
      toast.error("Erro ao criar segurado: " + error)
    }
  }

  return (
    <form
      className="mt-6 flex max-w-[1200px] flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}>
      {/* Dados Pessoais */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Dados Pessoais</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>
              Nome/Razão Social <span style={{ color: "text-red-500" }}>*</span>
            </label>
            <Input.Root>
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
              label="Status *"
              field_name="status"
              {...register("status")}
            />
            {errors.status && (
              <span className="text-xs text-red-500">
                {errors.status.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <SelectInput
              options={TipoPessoaLabels}
              label="Tipo de Pessoa *"
              field_name="tipoPessoa"
              {...register("tipoPessoa")}
            />
            {errors.tipoPessoa && (
              <span className="text-xs text-red-500">
                {errors.tipoPessoa.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>CPF/CNPJ *</label>
            <Input.Root>
              <Input.Control
                {...register("cnpjCpf", {
                  onChange: (e) => {
                    e.target.value = formatDocumentNumber(e.target.value)
                  },
                })}
                type="text"
              />
            </Input.Root>
            {errors.cnpjCpf && (
              <span className="text-xs text-red-500">
                {errors.cnpjCpf.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <AutocompleteInput
              options={corretorasOptions}
              label="Corretora *"
              field_name="corretoraId"
              {...register("corretoraId")}
            />
            {errors.corretoraId && (
              <span className="text-xs text-red-500">
                {errors.corretoraId.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Grupo *</label>
            <Input.Root>
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
        {tipoPessoa === "JURIDICA" && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <label>Nome do Representante Legal *</label>
                <Input.Root>
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
                <Input.Root>
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
              <div className="flex flex-1 flex-col gap-2">
                <SelectInput
                  options={ramosOptions}
                  label="Ramo de Atividade"
                  field_name="ramoAtividade"
                  {...register("ramoAtividade")}
                />
              </div>
            </div>
          </div>
        )}

        {tipoPessoa === "FISICA" && (
          <>
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <label>RG *</label>
                <Input.Root variant="primary">
                  <Input.Control {...register("rg")} type="text" />
                </Input.Root>
                {errors.rg && (
                  <span className="text-xs text-red-500">
                    {errors.rg.message}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label>Órgão Emissor *</label>
                <Input.Root variant="primary">
                  <Input.Control {...register("orgaoEmissor")} type="text" />
                </Input.Root>
                {errors.orgaoEmissor && (
                  <span className="text-xs text-red-500">
                    {errors.orgaoEmissor.message}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label>Data de Nascimento *</label>
                <Input.Root variant="primary">
                  <Input.Control {...register("dataNascimento")} type="date" />
                </Input.Root>
                {errors.dataNascimento && (
                  <span className="text-xs text-red-500">
                    {errors.dataNascimento.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <SelectInput
                  options={SexoLabels}
                  label="Sexo *"
                  field_name="sexo"
                  {...register("sexo")}
                />
                {errors.sexo && (
                  <span className="text-xs text-red-500">
                    {errors.sexo.message}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <SelectInput
                  options={EstadoCivilLabels}
                  label="Estado Civil *"
                  field_name="estadoCivil"
                  {...register("estadoCivil")}
                />
                {errors.estadoCivil && (
                  <span className="text-xs text-red-500">
                    {errors.estadoCivil.message}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-1 flex-col gap-2">
                  <SelectInput
                    options={ramosOptions}
                    label="Ramo de Atividade"
                    field_name="ramoAtividade"
                    {...register("ramoAtividade")}
                  />
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <label>Vencimento CNH *</label>
                  <Input.Root>
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
          </>
        )}
      </div>

      {/* Contato (bloco separado) */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Contato</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Email *</label>
            <Input.Root>
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
            {errors.celular && (
              <span className="text-xs text-red-500">
                {errors.celular.message}
              </span>
            )}
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
            <label>CEP *</label>
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
              <span className="text-xs text-red-500">{errors.cep.message}</span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Logradouro *</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control
                disabled={!isCepSearched}
                {...register("logradouro")}
                type="text"
              />
            </Input.Root>
          </div>

          <div className="flex max-w-[150px] flex-col gap-2">
            <label>Número *</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control
                disabled={!isCepSearched}
                {...register("numero")}
                type="text"
              />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Complemento</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control
                disabled={!isCepSearched}
                {...register("complemento")}
                type="text"
              />
            </Input.Root>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Bairro *</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control
                disabled={!isCepSearched}
                {...register("bairro")}
                type="text"
              />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Cidade *</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control
                disabled={!isCepSearched}
                {...register("cidade")}
                type="text"
              />
            </Input.Root>
          </div>

          <div className="flex max-w-[150px] flex-col gap-2">
            <label>UF *</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control
                disabled={!isCepSearched}
                {...register("uf")}
                type="text"
              />
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
              {...register("banco")}
            />
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
              label="Produtor *"
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

      <div className="mb-5 flex justify-end gap-4">
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
