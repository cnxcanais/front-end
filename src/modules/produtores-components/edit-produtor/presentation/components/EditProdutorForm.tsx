"use client"

import { Produtor } from "@/@types/produtor"
import { AutocompleteInput } from "@/core/components/AutocompleteInput"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { MapModal } from "@/core/components/MapModal"
import { SelectInput } from "@/core/components/SelectInput"
import { fetchCep } from "@/core/utils/findCep"
import { formatCep } from "@/core/utils/format-cep"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { normalizeDecimals } from "@/core/utils/normalizeDecimals"
import { useCorretoraByIdQuery } from "@/modules/corretoras-components/edit-corretora/infra/hooks/use-corretora-by-id-query"
import { useProdutorByIdQuery } from "@/modules/produtores-components/edit-produtor/infra/hooks/use-produtor-by-id-query"
import { editProdutor } from "@/modules/produtores-components/edit-produtor/infra/remote"
import { useBancosQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-banco-query"
import {
  FormaRepasseLabels,
  RepasseSobreLabels,
  StatusProdutorLabels,
  TipoContaLabels,
  TipoRepasseLabels,
} from "@/modules/produtores-components/types/form-enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass, MapPin } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  EditProdutorSchema,
  editProdutorFormSchema,
} from "../validation/schema"

export function EditProdutorForm({ id }: { id: string }) {
  const { push } = useRouter()
  const [isCepSearched, setIsCepSearched] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)

  const { data: bancosData, isLoading: isLoadingBancos } = useBancosQuery()

  const bancosOptions = useMemo(() => {
    if (!bancosData) return []

    return bancosData
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((banco) => ({
        text: `${banco.name} - ${banco.code}`,
        value: banco.name,
      }))
  }, [bancosData])

  const { data: produtor, isLoading } = useProdutorByIdQuery(id)

  const { data: corretoraData, isLoading: isLoadingCorretora } =
    useCorretoraByIdQuery(produtor?.corretoraId)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<EditProdutorSchema>({
    resolver: zodResolver(editProdutorFormSchema),
    values: {
      nome: produtor?.nome || "",
      situacao: produtor?.situacao || "ATIVO",
      homePage: produtor?.homePage || "",
      telefoneComercial: produtor?.telefoneComercial || "",
      contaContabil: produtor?.contaContabil || "",
      repasseSobre: produtor?.repasseSobre || "",
      excluirRepasse: produtor?.excluirRepasse || false,
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
      digitoConta: produtor?.digitoConta || "",
      pix: produtor?.pix || "",
      tipoRepasse: produtor?.tipoRepasse || "",
      formaRepasse: produtor?.formaRepasse || "",
      percentualImposto: produtor?.percentualImposto,
      primeiraRepasse: produtor?.primeiraRepasse,
      grupos: produtor?.grupos || "",
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

  if (!produtor || isLoading || isLoadingBancos || isLoadingCorretora)
    return <LoadingScreen />

  const fullAddress = `${produtor.logradouro}, ${produtor.numero} - ${produtor.bairro}, ${produtor.cidade} - ${produtor.uf}, ${produtor.cep}`

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
            <label>Tipo Pessoa</label>
            <Input.Root variant="disabled">
              <Input.Control value={produtor?.pessoa} type="text" disabled />
            </Input.Root>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>CPF/CNPJ</label>
            <Input.Root variant="disabled">
              <Input.Control value={produtor?.cnpjCpf} type="text" disabled />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Corretora</label>
            <Input.Root variant="disabled">
              <Input.Control
                value={corretoraData?.razaoSocial || ""}
                type="text"
                disabled
              />
            </Input.Root>
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
            {errors.telefoneFixo && (
              <span className="text-xs text-red-500">
                {errors.telefoneFixo.message}
              </span>
            )}
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

            {errors.telefoneComercial && (
              <span className="text-xs text-red-500">
                {errors.telefoneComercial.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Endereço</h3>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowMapModal(true)}
            className="flex items-center gap-2">
            <MapPin size={18} />
            Ver no Mapa
          </Button>
        </div>
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
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Dados Bancários</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <AutocompleteInput
              options={bancosOptions}
              field_name="banco"
              {...register("banco")}
              label="Banco"
              defaultValue={produtor?.banco}
              variant={`${errors.banco ? "error" : "primary"}`}
            />
            {errors.banco && (
              <span className="text-xs text-red-500">
                {errors.banco.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label>Agência</label>
            <Input.Root variant={`${errors.agencia ? "error" : "primary"}`}>
              <Input.Control {...register("agencia")} type="text" />
            </Input.Root>
            {errors.agencia && (
              <span className="text-xs text-red-500">
                {errors.agencia.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label>Conta</label>
            <Input.Root variant={`${errors.conta ? "error" : "primary"}`}>
              <Input.Control {...register("conta")} type="text" />
            </Input.Root>
            {errors.conta && (
              <span className="text-xs text-red-500">
                {errors.conta.message}
              </span>
            )}
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
            {errors.tipoConta && (
              <span className="text-xs text-red-500">
                {errors.tipoConta.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>PIX</label>
            <Input.Root variant={`${errors.pix ? "error" : "primary"}`}>
              <Input.Control {...register("pix")} type="text" />
            </Input.Root>
            {errors.pix && (
              <span className="text-xs text-red-500">{errors.pix.message}</span>
            )}
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
            <SelectInput
              options={RepasseSobreLabels}
              field_name="repasseSobre"
              label="Repasse Sobre"
              {...register("repasseSobre")}
            />
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

      {/* Outros */}
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
      <MapModal
        open={showMapModal}
        onClose={() => setShowMapModal(false)}
        address={fullAddress}
      />

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
