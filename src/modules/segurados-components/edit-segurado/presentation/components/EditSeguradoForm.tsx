"use client"

import { Segurado } from "@/@types/segurado"
import { AutocompleteInput } from "@/core/components/AutocompleteInput"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { MapModal } from "@/core/components/MapModal"
import { SelectInput } from "@/core/components/SelectInput"
import { fetchCep } from "@/core/utils/findCep"
import { formatCep } from "@/core/utils/format-cep"
import {
  formatDocumentNumber,
  formatStaticDocument,
} from "@/core/utils/formatDocumentNumber"
import { formatPhoneNumber } from "@/core/utils/formatPhoneNumber"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useBancosQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-banco-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { useSeguradoByIdQuery } from "@/modules/segurados-components/segurado/infra/hooks/use-segurado-by-id-query"
import {
  EstadoCivilLabels,
  RamoAtividadePJLabels,
  RamoPFLabels,
  SexoLabels,
  StatusSeguradoLabels,
  TipoContaLabels,
} from "@/modules/segurados-components/types/form-enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass, MapPin } from "@phosphor-icons/react"
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
  readOnly?: boolean
}

export function EditSeguradoForm({
  id,
  readOnly = false,
}: EditSeguradoFormProps) {
  const { push } = useRouter()
  const [showMapModal, setShowMapModal] = useState(false)

  const { data: seguradoData, isLoading } = useSeguradoByIdQuery(id)
  const { data: corretorasData } = useCorretoraQuery()
  const corretoraId = seguradoData?.corretoraId
  const { data: produtoresData } = useProdutorQuery(1, -1, { corretoraId })

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UpdateSeguradoSchema>({
    resolver: zodResolver(updateSeguradoFormSchema),
    defaultValues: {
      tipoPessoa: "",
      nomeRazaoSocial: "",
      grupo: "",
      status: "",
      representanteLegalNome: "",
      representanteLegalCpf: "",
      rg: "",
      orgaoEmissor: "",
      dataNascimento: "",
      sexo: "",
      estadoCivil: "",
      telefone: "",
      celular: "",
      email: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      nomeContato: "",
      cargoContato: "",
      ramoAtividade: "",
      vencimentoCnh: "",
      indicadoPor: "",
      banco: "",
      agencia: "",
      conta: "",
      digitoConta: "",
      tipoConta: "",
      pix: "",
      produtorId: "",
      supervisor: "",
      canalVendas: "",
      observacoes: "",
    },
  })

  const tipoPessoaWatch = useWatch({ control, name: "tipoPessoa" }) as
    | string
    | undefined
  const tipoPessoa = tipoPessoaWatch ?? seguradoData?.tipoPessoa
  const produtorIdWatch = useWatch({ control, name: "produtorId" })

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
    if (seguradoData && produtoresData) {
      console.log("seguradoData", seguradoData)
      reset({
        tipoPessoa: seguradoData.tipoPessoa,
        nomeRazaoSocial: seguradoData.nomeRazaoSocial,
        grupo: seguradoData.grupo,
        status: seguradoData.status,
        representanteLegalNome: seguradoData.representanteLegalNome || "",
        representanteLegalCpf:
          formatStaticDocument(seguradoData.representanteLegalCpf) || "",
        rg: seguradoData.rg,
        orgaoEmissor: seguradoData.orgaoEmissor,
        dataNascimento: seguradoData.dataNascimento,
        sexo: seguradoData.sexo,
        estadoCivil: seguradoData.estadoCivil,
        telefone: formatPhoneNumber(seguradoData.telefone),
        celular: formatPhoneNumber(seguradoData.celular),
        email: seguradoData.email,
        cep: seguradoData.cep,
        logradouro: seguradoData.logradouro,
        numero: seguradoData.numero,
        complemento: seguradoData.complemento,
        bairro: seguradoData.bairro,
        cidade: seguradoData.cidade,
        uf: seguradoData.uf,
        nomeContato: seguradoData.nomeContato,
        cargoContato: seguradoData.cargoContato,
        ramoAtividade: seguradoData.ramoAtividade,
        vencimentoCnh: seguradoData.vencimentoCnh,
        indicadoPor: seguradoData.indicadoPor,
        banco: seguradoData.banco,
        agencia: seguradoData.agencia,
        conta: seguradoData.conta,
        digitoConta: seguradoData.digitoConta,
        tipoConta: seguradoData.tipoConta,
        pix: seguradoData.pix,
        produtorId: seguradoData.produtorId,
        supervisor: seguradoData.supervisor,
        canalVendas: seguradoData.canalVendas,
        observacoes: seguradoData.observacoes,
      })
    }
  }, [seguradoData, produtoresData, reset])

  async function onSubmit(data: Segurado.UpdateRequest) {
    try {
      await updateSegurado(id, data)
      toast.success("Segurado atualizado com sucesso!")
      setTimeout(() => push("/segurados"), 2000)
    } catch (error) {
      toast.error("Erro ao atualizar segurado: " + error)
    }
  }

  console.log(errors)

  const fullAddress =
    seguradoData ?
      `${seguradoData.logradouro}, ${seguradoData.numero} - ${seguradoData.bairro}, ${seguradoData.cidade} - ${seguradoData.uf}, ${seguradoData.cep}`
    : ""

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
            <Input.Root>
              <Input.Control
                {...register("nomeRazaoSocial")}
                type="text"
                readOnly={readOnly}
              />
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
              disabled={readOnly}
              {...register("status")}
            />
            {errors.status && (
              <span className="text-xs text-red-500">
                {errors.status.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label>Tipo de Pessoa</label>
            <Input.Root variant="disabled">
              <Input.Control
                value={
                  tipoPessoa === "JURIDICA" ? "Pessoa Jurídica"
                  : tipoPessoa === "FISICA" ?
                    "Pessoa Física"
                  : ""
                }
                type="text"
                disabled
              />
            </Input.Root>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>CPF/CNPJ</label>
            <Input.Root variant="disabled">
              <Input.Control
                value={formatStaticDocument(seguradoData?.cnpjCpf) || ""}
                type="text"
                disabled
              />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Corretora</label>
            <Input.Root variant="disabled">
              <Input.Control
                value={
                  corretorasData?.data?.filter(
                    (corretora) => corretora.id === seguradoData?.corretoraId
                  )[0]?.razaoSocial || ""
                }
                type="text"
                readOnly
              />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Grupo</label>
            <Input.Root variant="disabled">
              <Input.Control
                {...register("grupo")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
            {errors.grupo && (
              <span className="text-xs text-red-500">
                {errors.grupo.message}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label>Vencimento CNH *</label>
            <Input.Root>
              <Input.Control
                {...register("vencimentoCnh")}
                type="date"
                readOnly={readOnly}
              />
            </Input.Root>
            {errors.vencimentoCnh && (
              <span className="text-xs text-red-500">
                {errors.vencimentoCnh.message}
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
                    readOnly={readOnly}
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
                    readOnly={readOnly}
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
                  options={RamoAtividadePJLabels}
                  label="Ramo de Atividade"
                  field_name="ramoAtividade"
                  {...register("ramoAtividade")}
                  disabled={readOnly}
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
                  <Input.Control
                    {...register("rg")}
                    type="text"
                    readOnly={readOnly}
                  />
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
                  <Input.Control
                    {...register("orgaoEmissor")}
                    type="text"
                    readOnly={readOnly}
                  />
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
                  <Input.Control
                    {...register("dataNascimento")}
                    type="date"
                    readOnly={readOnly}
                  />
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
                  disabled={readOnly}
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
                  disabled={readOnly}
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
                    options={RamoPFLabels}
                    label="Ramo de Atividade"
                    field_name="ramoAtividade"
                    {...register("ramoAtividade")}
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Contato */}
      <div className="flex flex-col gap-4 bg-gray-50 p-4 shadow-md">
        <h3 className="text-lg font-semibold">Contato</h3>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Email</label>
            <Input.Root variant={errors.email ? "error" : "primary"}>
              <Input.Control
                {...register("email")}
                type="email"
                readOnly={readOnly}
              />
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
                readOnly={readOnly}
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
                readOnly={readOnly}
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
              <Input.Control
                {...register("nomeContato")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Cargo do Contato</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("cargoContato")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Canal de Vendas</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("canalVendas")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
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
                }}
                readOnly={readOnly}
              />
            </Input.Root>
            {errors.cep && (
              <span className="text-xs text-red-500">{errors.cep.message}</span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Logradouro *</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("logradouro")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
            {errors.logradouro && (
              <span className="text-xs text-red-500">
                {errors.logradouro.message}
              </span>
            )}
          </div>

          <div className="flex max-w-[150px] flex-col gap-2">
            <label>Número *</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("numero")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
            {errors.numero && (
              <span className="text-xs text-red-500">
                {errors.numero.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Complemento</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("complemento")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label>Bairro *</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("bairro")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
            {errors.bairro && (
              <span className="text-xs text-red-500">
                {errors.bairro.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Cidade *</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("cidade")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
            {errors.cidade && (
              <span className="text-xs text-red-500">
                {errors.cidade.message}
              </span>
            )}
          </div>

          <div className="flex max-w-[150px] flex-col gap-2">
            <label>UF *</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("uf")}
                type="text"
                readOnly={readOnly}
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
              variant={errors.banco ? "error" : "primary"}
              {...register("banco")}
              readOnly={readOnly}
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
              <Input.Control
                {...register("agencia")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Conta</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("conta")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
          </div>

          <div className="flex max-w-[150px] flex-col gap-2">
            <label>Dígito</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("digitoConta")}
                type="text"
                readOnly={readOnly}
              />
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
              disabled={readOnly}
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>PIX</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("pix")}
                type="text"
                readOnly={readOnly}
              />
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
              key={`produtor-${seguradoData?.produtorId}-${produtoresData?.data?.length}`}
              options={produtoresOptions}
              label="Produtor *"
              field_name="produtorId"
              value={produtorIdWatch}
              readOnly={readOnly}
              {...register("produtorId")}
            />
            {errors.produtorId && (
              <span className="text-xs text-red-500">
                {errors.produtorId.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Supervisor</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("supervisor")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label>Indicado Por</label>
            <Input.Root variant="primary">
              <Input.Control
                {...register("indicadoPor")}
                type="text"
                readOnly={readOnly}
              />
            </Input.Root>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label>Observações</label>
          <Input.Root variant="primary">
            <Input.Control {...register("observacoes")} readOnly={readOnly} />
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
        {!readOnly && (
          <Button type="submit" variant="secondary" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        )}
      </div>

      <MapModal
        open={showMapModal}
        onClose={() => setShowMapModal(false)}
        address={fullAddress}
      />
    </form>
  )
}
