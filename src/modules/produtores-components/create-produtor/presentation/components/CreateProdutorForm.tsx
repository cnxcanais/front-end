"use client"

import { Produtor } from "@/@types/produtor"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { fetchCep } from "@/core/utils/findCep"
import { formatDocumentNumber } from "@/core/utils/formatDocumentNumber"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<CreateProdutorSchema>({
    resolver: zodResolver(createProdutorFormSchema),
  })

  async function onSubmit(data: Produtor.CreateRequest) {
    try {
      const response = await createProdutor(data)
      toast.success(response)
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
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Dados Pessoais</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Nome</label>
            <Input.Root variant={errors.nome ? "error" : "primary"}>
              <Input.Control {...register("nome")} type="text" />
            </Input.Root>
            {errors.nome && <span className="text-xs text-red-500">{errors.nome.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label>Situação</label>
            <select {...register("situacao")} className="rounded border p-2">
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label>Pessoa</label>
            <select {...register("pessoa")} className="rounded border p-2">
              <option value="FISICA">Física</option>
              <option value="JURIDICA">Jurídica</option>
            </select>
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
            {errors.cnpjCpf && <span className="text-xs text-red-500">{errors.cnpjCpf.message}</span>}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Corretora ID</label>
            <Input.Root variant={errors.corretoraId ? "error" : "primary"}>
              <Input.Control {...register("corretoraId")} type="text" />
            </Input.Root>
            {errors.corretoraId && <span className="text-xs text-red-500">{errors.corretoraId.message}</span>}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Inscrição Estadual</label>
            <Input.Root variant="primary">
              <Input.Control {...register("inscricaoEstadual")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Inscrição Municipal</label>
            <Input.Root variant="primary">
              <Input.Control {...register("inscricaoMunicipal")} type="text" />
            </Input.Root>
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Contato</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Email</label>
            <Input.Root variant={errors.email ? "error" : "primary"}>
              <Input.Control {...register("email")} type="email" />
            </Input.Root>
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

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
            {errors.telefoneCelular && <span className="text-xs text-red-500">{errors.telefoneCelular.message}</span>}
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
        </div>
      </div>

      {/* Endereço */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Endereço</h3>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <label>CEP</label>
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
            {errors.cep && <span className="text-xs text-red-500">{errors.cep.message}</span>}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Logradouro</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control disabled={!isCepSearched} {...register("logradouro")} type="text" />
            </Input.Root>
            {errors.logradouro && <span className="text-xs text-red-500">{errors.logradouro.message}</span>}
          </div>

          <div className="flex max-w-[150px] flex-col gap-2">
            <label>Número</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control disabled={!isCepSearched} {...register("numero")} type="text" />
            </Input.Root>
            {errors.numero && <span className="text-xs text-red-500">{errors.numero.message}</span>}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Complemento</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control disabled={!isCepSearched} {...register("complemento")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Bairro</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control disabled={!isCepSearched} {...register("bairro")} type="text" />
            </Input.Root>
            {errors.bairro && <span className="text-xs text-red-500">{errors.bairro.message}</span>}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Cidade</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control disabled={!isCepSearched} {...register("cidade")} type="text" />
            </Input.Root>
            {errors.cidade && <span className="text-xs text-red-500">{errors.cidade.message}</span>}
          </div>

          <div className="flex max-w-[100px] flex-col gap-2">
            <label>UF</label>
            <Input.Root variant={isCepSearched ? "primary" : "disabled"}>
              <Input.Control disabled={!isCepSearched} {...register("uf")} type="text" />
            </Input.Root>
            {errors.uf && <span className="text-xs text-red-500">{errors.uf.message}</span>}
          </div>
        </div>
      </div>

      {/* Dados Bancários */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Dados Bancários</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Banco</label>
            <Input.Root variant="primary">
              <Input.Control {...register("banco")} type="text" />
            </Input.Root>
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
              <Input.Control {...register("digito")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-col gap-2">
            <label>Tipo Conta</label>
            <select {...register("tipoConta")} className="rounded border p-2">
              <option value="">Selecione</option>
              <option value="CORRENTE">Corrente</option>
              <option value="POUPANCA">Poupança</option>
            </select>
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
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Repasse</h3>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <label>Tipo Repasse</label>
            <select {...register("tipoRepasse")} className="rounded border p-2">
              <option value="">Selecione</option>
              <option value="DIRETO">Direto</option>
              <option value="INDIRETO">Indireto</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label>Forma Repasse</label>
            <select {...register("formaRepasse")} className="rounded border p-2">
              <option value="">Selecione</option>
              <option value="DEPOSITO">Depósito</option>
              <option value="PIX">PIX</option>
              <option value="TED">TED</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label>% Imposto</label>
            <Input.Root variant="primary">
              <Input.Control {...register("percentualImposto")} type="number" step="0.01" />
            </Input.Root>
          </div>

          <div className="flex flex-col gap-2">
            <label>Primeira Repasse (%)</label>
            <Input.Root variant="primary">
              <Input.Control {...register("primeiraRepasse")} type="number" step="0.01" />
            </Input.Root>
          </div>

          <div className="flex flex-col gap-2">
            <label>Demais Repasse (%)</label>
            <Input.Root variant="primary">
              <Input.Control {...register("demaisRepasse")} type="number" step="0.01" />
            </Input.Root>
          </div>
        </div>
      </div>

      {/* Grupo */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Grupo</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Grupos</label>
            <Input.Root variant="primary">
              <Input.Control {...register("grupos")} type="text" />
            </Input.Root>
          </div>

          <div className="flex flex-col gap-2">
            <label>Grupo Produtor</label>
            <select {...register("grupoProdutor")} className="rounded border p-2">
              <option value="">Selecione</option>
              <option value="LIDER">Líder</option>
              <option value="MEMBRO">Membro</option>
            </select>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Líder Grupo ID</label>
            <Input.Root variant="primary">
              <Input.Control {...register("liderGrupoId")} type="text" />
            </Input.Root>
          </div>
        </div>
      </div>

      {/* Observações e LGPD */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label>Observações</label>
          <Input.Root variant="primary">
            <Input.Control {...register("observacoes")} type="text" />
          </Input.Root>
        </div>

        <div className="flex items-center gap-2">
          <input {...register("lgpdConsentimento")} type="checkbox" id="lgpdConsentimento" />
          <label htmlFor="lgpdConsentimento">Consentimento LGPD</label>
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
