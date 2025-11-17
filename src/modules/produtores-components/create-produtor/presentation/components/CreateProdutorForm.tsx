"use client"

import { Produtor } from "@/@types/produtor"
import { AutocompleteInput } from "@/core/components/AutocompleteInput"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { SelectInput } from "@/core/components/SelectInput"
import { fetchCep } from "@/core/utils/findCep"
import { formatCep } from "@/core/utils/format-cep"
import { formatDocumentNumber } from "@/core/utils/formatDocumentNumber"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { normalizeDecimals } from "@/core/utils/normalizeDecimals"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useBancosQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-banco-query"
import {
  FormaRepasseLabels,
  StatusProdutorLabels,
  TipoContaLabels,
  TipoPessoaLabels,
  TipoRepasseLabels,
} from "@/modules/produtores-components/types/form-enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createProdutor } from "../../infra/remote/create-produtor"
import {
  CreateProdutorSchema,
  createProdutorFormSchema,
} from "../validation/schema"

export function CreateProdutorForm() {
  const { push } = useRouter()
  const [isCepSearched, setIsCepSearched] = useState(false)

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<CreateProdutorSchema>({
    resolver: zodResolver(createProdutorFormSchema),
  })

  const { data: corretorasData } = useCorretoraQuery()

  const corretorasOptions = useMemo(() => {
    if (!corretorasData) return []

    return corretorasData
      .sort((a, b) => a.razaoSocial.localeCompare(b.razaoSocial))
      .map((corretora) => ({
        text: corretora.razaoSocial,
        value: corretora.id,
      }))
  }, [corretorasData])

  async function onSubmit(data: Produtor.CreateRequest) {
    try {
      await createProdutor(data)
      toast.success("Produtor criado com sucesso!")
      setTimeout(() => push("/produtores"), 2000)
    } catch (error) {
      toast.error("Erro ao criar produtor: " + error)
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
            <label>Nome</label>
            <Input.Root variant={errors.nome ? "error" : "primary"}>
              <Input.Control {...register("nome")} type="text" />
            </Input.Root>
            {errors.nome && (
              <span className="text-xs text-red-500">
                {errors.nome.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <SelectInput
              options={StatusProdutorLabels}
              label="Situação"
              field_name="situacao"
              {...register("situacao")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <SelectInput
              options={TipoPessoaLabels}
              label="Pessoa"
              field_name="pessoa"
              {...register("pessoa")}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>CPF/CNPJ</label>
            <Input.Root variant={errors.cnpjCpf ? "error" : "primary"}>
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
            <SelectInput
              options={corretorasOptions}
              label="Corretora"
              field_name="corretoraId"
              {...register("corretoraId")}
            />
            {errors.corretoraId && (
              <span className="text-xs text-red-500">
                {errors.corretoraId.message}
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
            <label>Home Page</label>
            <Input.Root variant="primary">
              <Input.Control {...register("homePage")} type="text" />
            </Input.Root>
          </div>

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
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Telefone Celular</label>
            <Input.Root variant={errors.telefoneCelular ? "error" : "primary"}>
              <Input.Control
                {...register("telefoneCelular", {
                  onChange: (e) => {
                    e.target.value = formatPhoneNumber(e.target.value)
                  },
                })}
                type="text"
              />
            </Input.Root>
            {errors.telefoneCelular && (
              <span className="text-xs text-red-500">
                {errors.telefoneCelular.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Telefone Fixo</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("telefoneFixo", {
                  onChange: (e) => {
                    e.target.value = formatPhoneNumber(e.target.value)
                  },
                })}
                type="text"
              />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Telefone Comercial</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("telefoneComercial", {
                  onChange: (e) => {
                    e.target.value = formatPhoneNumber(e.target.value)
                  },
                })}
                type="text"
              />
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
                  setIsCepSearched(true)
                }}
              />
            </Input.Root>
            {errors.cep && (
              <span className="text-xs text-red-500">{errors.cep.message}</span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Logradouro</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control
                disabled={!isCepSearched}
                {...register("logradouro")}
                type="text"
              />
            </Input.Root>
            {errors.logradouro && (
              <span className="text-xs text-red-500">
                {errors.logradouro.message}
              </span>
            )}
          </div>

          <div className="flex max-w-[150px] flex-col gap-2">
            <label>Número</label>
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
        </div>

        <div className="flex gap-4">
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

          <div className="flex flex-1 flex-col gap-2">
            <label>Bairro</label>
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

          <div className="flex flex-1 flex-col gap-2">
            <label>Cidade</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control
                disabled={!isCepSearched}
                {...register("cidade")}
                type="text"
              />
            </Input.Root>
            {errors.cidade && (
              <span className="text-xs text-red-500">
                {errors.cidade.message}
              </span>
            )}
          </div>

          <div className="flex max-w-[100px] flex-col gap-2">
            <label>UF</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control
                disabled={!isCepSearched}
                {...register("uf")}
                type="text"
              />
            </Input.Root>
            {errors.uf && (
              <span className="text-xs text-red-500">{errors.uf.message}</span>
            )}
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

          <div className="flex flex-col gap-2">
            <label>Agência</label>
            <Input.Root variant="primary">
              <Input.Control {...register("agencia")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-col gap-2">
            <label>Conta</label>
            <Input.Root variant="primary">
              <Input.Control {...register("conta")} type="text" />
            </Input.Root>
          </div>

          <div className="flex max-w-[100px] flex-col gap-2">
            <label>Dígito</label>
            <Input.Root variant="primary">
              <Input.Control {...register("digitoConta")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-col gap-2">
            <SelectInput
              options={TipoContaLabels}
              field_name="tipoConta"
              label="Tipo Conta"
              {...register("tipoConta")}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>PIX</label>
            <Input.Root variant="primary">
              <Input.Control {...register("pix")} type="text" />
            </Input.Root>
          </div>
        </div>
      </div>

      {/* Repasse */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Repasse</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Conta Contábil</label>
            <Input.Root variant="primary">
              <Input.Control {...register("contaContabil")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Repasse Sobre</label>
            <Input.Root variant="primary">
              <Input.Control {...register("repasseSobre")} type="text" />
            </Input.Root>
          </div>

          <div className="flex items-center gap-2">
            <input
              {...register("excluirRepasse")}
              type="checkbox"
              id="excluirRepasse"
            />
            <label htmlFor="excluirRepasse">Excluir Repasse</label>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <SelectInput
              options={TipoRepasseLabels}
              field_name="tipoRepasse"
              label="Tipo Repasse"
              {...register("tipoRepasse")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <SelectInput
              options={FormaRepasseLabels}
              field_name="formaRepasse"
              label="Forma Repasse"
              {...register("formaRepasse")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>% Imposto</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("percentualImposto")}
                type="text"
                inputMode="decimal"
                onChange={(e) => {
                  normalizeDecimals(e.target, 2)
                }}
              />
            </Input.Root>
          </div>

          <div className="flex flex-col gap-2">
            <label>Primeira Repasse (%)</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("primeiraRepasse")}
                type="text"
                inputMode="decimal"
                onChange={(e) => {
                  normalizeDecimals(e.target, 2)
                }}
              />
            </Input.Root>
          </div>
        </div>
      </div>

      {/* Observações e LGPD */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Outros</h3>
        <div className="flex flex-col gap-2">
          <label>Observações</label>
          <Input.Root variant="primary">
            <Input.Control {...register("observacoes")} type="text" />
          </Input.Root>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Grupos</label>
            <Input.Root variant="primary">
              <Input.Control {...register("grupos")} type="text" />
            </Input.Root>
          </div>

          <div className="flex items-center gap-2">
            <input
              {...register("lgpdConsentimento")}
              type="checkbox"
              id="lgpdConsentimento"
            />
            <label htmlFor="lgpdConsentimento">Consentimento LGPD</label>
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
          onClick={() => push("/produtores")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
