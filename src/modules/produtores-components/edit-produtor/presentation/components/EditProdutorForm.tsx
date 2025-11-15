"use client"

import { Produtor } from "@/@types/produtor"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { fetchCep } from "@/core/utils/findCep"
import { formatCep } from "@/core/utils/format-cep"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { normalizeDecimals } from "@/core/utils/normalizeDecimals"
import { useProdutorByIdQuery } from "@/modules/produtores-components/edit-produtor/infra/hooks/use-produtor-by-id-query"
import { editProdutor } from "@/modules/produtores-components/edit-produtor/infra/remote"
import {
  FormaRepasseLabels,
  GrupoProdutorLabels,
  StatusProdutorLabels,
  TipoContaLabels,
  TipoRepasseLabels,
} from "@/modules/produtores-components/types/form-enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  EditProdutorSchema,
  editProdutorFormSchema,
} from "../validation/schema"

export function EditProdutorForm({ id }: { id: string }) {
  const { push } = useRouter()
  const [isCepSearched, setIsCepSearched] = useState(false)

  const { data: produtor, isLoading } = useProdutorByIdQuery(id)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<EditProdutorSchema>({
    resolver: zodResolver(editProdutorFormSchema),
    values: {
      id: produtor?.id || "",
      nome: produtor?.nome || "",
      situacao: produtor?.situacao || "ATIVO",
      inscricaoEstadual: produtor?.inscricaoEstadual || "",
      inscricaoMunicipal: produtor?.inscricaoMunicipal || "",
      telefoneFixo: produtor?.telefoneFixo || "",
      telefoneCelular: produtor?.telefoneCelular || "",
      email: produtor?.email || "",
      cep: produtor ? formatCep(produtor.cep) : "",
      logradouro: produtor?.logradouro || "",
      numero: produtor?.numero || "",
      complemento: produtor?.complemento || "",
      bairro: produtor?.bairro || "",
      cidade: produtor?.cidade || "",
      uf: produtor?.uf || "",
      banco: produtor?.banco || "",
      agencia: produtor?.agencia || "",
      conta: produtor?.conta || "",
      tipoConta: produtor?.tipoConta || "",
      digito: produtor?.conta?.split("-")[1] || "",
      pix: produtor?.pix || "",
      tipoRepasse: produtor?.tipoRepasse || "",
      formaRepasse: produtor?.formaRepasse || "",
      percentualImposto: produtor?.percentualImposto || 0,
      primeiraRepasse: produtor?.primeiraRepasse || 0,
      demaisRepasse: produtor?.demaisRepasse || 0,
      grupos: produtor?.grupos || "",
      grupoProdutor: produtor?.grupoProdutor || "",
      liderGrupoId: produtor?.liderGrupoId || "",
      lgpdConsentimento: produtor?.lgpdConsentimento || false,
      observacoes: produtor?.observacoes || "",
    },
  })

  async function onSubmit(data: Produtor.UpdateRequest) {
    try {
      await editProdutor(id, data)
      toast.success("Produtor editado com sucesso!")
      setTimeout(() => push("/produtores"), 2000)
    } catch (error) {
      toast.error("Erro ao editar produtor: " + error)
    }
  }

  if (!produtor || isLoading) return <LoadingScreen />

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
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
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
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Repasse</h3>
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

          <div className="flex flex-col gap-2">
            <label>Demais Repasse (%)</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("demaisRepasse")}
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
            <SelectInput
              options={GrupoProdutorLabels}
              field_name="grupoProdutor"
              label="Grupo Produtor"
              {...register("grupoProdutor")}
            />
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
          <input
            {...register("lgpdConsentimento")}
            type="checkbox"
            id="lgpdConsentimento"
          />
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
