import { Corretora } from "@/@types/corretora"
import { Produtor } from "@/@types/produtor"
import { Ramo } from "@/@types/ramo"
import { Segurado } from "@/@types/segurado"
import { Seguradora } from "@/@types/seguradora"
import * as Input from "@/core/components/Input"
import { SelectInput } from "@/core/components/SelectInput"
import { RamosResponse } from "@/modules/ramos-components/ramos/infra/remote"
import { Plus } from "@phosphor-icons/react"
import { useState } from "react"
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form"
import { PropostaFormSchema } from "../../validation/schema"
import { CreateCorretoraModal } from "../modals/CreateCorretoraModal"
import { CreateProdutoModal } from "../modals/CreateProdutoModal"
import { CreateProdutorModal } from "../modals/CreateProdutorModal"
import { CreateRamoModal } from "../modals/CreateRamoModal"
import { CreateSeguradoModal } from "../modals/CreateSeguradoModal"
import { CreateSeguradoraModal } from "../modals/CreateSeguradoraModal"

interface PropostaTabProps {
  register: UseFormRegister<PropostaFormSchema>
  errors: FieldErrors<PropostaFormSchema>
  formData: PropostaFormSchema
  setValue: UseFormSetValue<PropostaFormSchema>
  segurados: Segurado.GetResponse
  seguradoras: Seguradora.GetResponse
  produtores: Produtor.GetResponse
  corretoras: Corretora.GetResponse
  produtosOptions: {
    text: string
    value: string
  }[]
  ramos: RamosResponse
  isEndosso?: boolean
  isRenovacao?: boolean
  readOnly?: boolean
  refetchSegurados: () => void
  refetchSeguradoras: () => void
  refetchProdutores: () => void
  refetchCorretoras: () => void
  refetchRamos: () => void
  refetchProdutos: () => void
}

export function PropostaTab({
  register,
  errors,
  formData,
  setValue,
  segurados,
  seguradoras,
  produtores,
  corretoras,
  ramos,
  produtosOptions,
  isEndosso = false,
  isRenovacao = false,
  readOnly = false,
  refetchSegurados,
  refetchSeguradoras,
  refetchProdutores,
  refetchCorretoras,
  refetchRamos,
  refetchProdutos,
}: PropostaTabProps) {
  const [showCreateSeguradoModal, setShowCreateSeguradoModal] = useState(false)
  const [showCreateSeguradoraModal, setShowCreateSeguradoraModal] =
    useState(false)
  const [showCreateProdutorModal, setShowCreateProdutorModal] = useState(false)
  const [showCreateCorretoraModal, setShowCreateCorretoraModal] =
    useState(false)
  const [showCreateRamoModal, setShowCreateRamoModal] = useState(false)
  const [showCreateProdutoModal, setShowCreateProdutoModal] = useState(false)
  const isDisabled = isEndosso || isRenovacao || readOnly
  const RAMO_ID_GARANTIA = process.env.NEXT_PUBLIC_RAMO_GARANTIA_ID

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>Número da Proposta *</label>
        <Input.Root className="mt-2">
          <Input.Control
            {...register("numeroProposta")}
            disabled={isDisabled}
          />
        </Input.Root>
        {errors.numeroProposta && (
          <span className="text-xs text-red-500">
            {errors.numeroProposta.message}
          </span>
        )}
      </div>
      <div>
        <label>Segurado *</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SelectInput
              label=""
              field_name="seguradoId"
              value={formData.seguradoId}
              onChange={(e) => {
                const seguradoId = e.target.value
                setValue("seguradoId", seguradoId)
                const segurado = segurados?.data?.find(
                  (s) => s.id === seguradoId
                )
                if (segurado) {
                  setValue("corretoraId", segurado.corretoraId || "")
                  setValue("produtorId", segurado.produtorId || "")
                }
              }}
              options={
                segurados?.data?.map((s: Segurado.Type) => ({
                  text: s.nomeRazaoSocial,
                  value: s.id,
                })) || []
              }
              required
              disabled={isDisabled}
            />
          </div>
          {!isDisabled && (
            <button
              type="button"
              onClick={() => setShowCreateSeguradoModal(true)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700">
              <Plus size={20} weight="bold" />
            </button>
          )}
        </div>
        {errors.seguradoId && (
          <span className="text-xs text-red-500">
            {errors.seguradoId.message}
          </span>
        )}
      </div>
      <div>
        <label>Seguradora *</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SelectInput
              label=""
              field_name="seguradoraId"
              value={formData.seguradoraId}
              onChange={(e) => setValue("seguradoraId", e.target.value)}
              options={
                seguradoras?.data?.map((s: Seguradora.Type) => ({
                  text: s.razaoSocial,
                  value: s.id,
                })) || []
              }
              required
              disabled={isDisabled}
            />
          </div>
          {!isDisabled && (
            <button
              type="button"
              onClick={() => setShowCreateSeguradoraModal(true)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700">
              <Plus size={20} weight="bold" />
            </button>
          )}
        </div>
        {errors.seguradoraId && (
          <span className="text-xs text-red-500">
            {errors.seguradoraId.message}
          </span>
        )}
      </div>
      <div>
        <label>Produtor *</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SelectInput
              label=""
              field_name="produtorId"
              value={formData.produtorId}
              onChange={(e) => {
                const produtorId = e.target.value
                setValue("produtorId", produtorId)
              }}
              options={
                produtores?.data
                  ?.filter((p) => p.corretoraId === formData.corretoraId)
                  ?.map((p: Produtor.Type) => ({
                    text: p.nome,
                    value: p.id,
                  })) || []
              }
              required
              disabled={isDisabled}
            />
          </div>
          {!isDisabled && (
            <button
              type="button"
              onClick={() => setShowCreateProdutorModal(true)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700">
              <Plus size={20} weight="bold" />
            </button>
          )}
        </div>
        {errors.produtorId && (
          <span className="text-xs text-red-500">
            {errors.produtorId.message}
          </span>
        )}
      </div>
      <div>
        <label>Corretora *</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SelectInput
              label=""
              field_name="corretoraId"
              disabled={readOnly}
              value={formData.corretoraId}
              onChange={(e) => setValue("corretoraId", e.target.value)}
              options={
                corretoras?.data?.map((c: Corretora.Type) => ({
                  text: c.razaoSocial,
                  value: c.id,
                })) || []
              }
              required
            />
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={() => setShowCreateCorretoraModal(true)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700">
              <Plus size={20} weight="bold" />
            </button>
          )}
        </div>
        {errors.corretoraId && (
          <span className="text-xs text-red-500">
            {errors.corretoraId.message}
          </span>
        )}
      </div>
      <div>
        <label>Ramo *</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SelectInput
              label=""
              field_name="ramoId"
              value={formData.ramoId}
              onChange={(e) => {
                setValue("ramoId", e.target.value)
              }}
              options={
                ramos?.data?.map((r: Ramo) => ({
                  text: r.descricao,
                  value: r.id,
                })) || []
              }
              required
              disabled={isDisabled}
            />
          </div>
          {!isDisabled && (
            <button
              type="button"
              onClick={() => setShowCreateRamoModal(true)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700">
              <Plus size={20} weight="bold" />
            </button>
          )}
        </div>
        {errors.ramoId && (
          <span className="text-xs text-red-500">{errors.ramoId.message}</span>
        )}
      </div>
      {formData.ramoId === RAMO_ID_GARANTIA && (
        <div>
          <SelectInput
            label="Tomador"
            field_name="tomadorId"
            value={formData.tomadorId}
            onChange={(e) => setValue("tomadorId", e.target.value)}
            options={
              segurados?.data?.map((s: Segurado.Type) => ({
                text: s.nomeRazaoSocial,
                value: s.id,
              })) || []
            }
            required
            disabled={isDisabled}
          />
          {errors.tomadorId && (
            <span className="text-xs text-red-500">
              {errors.tomadorId.message}
            </span>
          )}
        </div>
      )}

      <div>
        <label>Produto</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SelectInput
              label=""
              field_name="produtoId"
              value={formData.produtoId}
              onChange={(e) => setValue("produtoId", e.target.value)}
              options={produtosOptions || []}
              disabled={isDisabled}
            />
          </div>
          {!isDisabled && (
            <button
              type="button"
              onClick={() => setShowCreateProdutoModal(true)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700">
              <Plus size={20} weight="bold" />
            </button>
          )}
        </div>
        {errors.produtoId && (
          <span className="text-xs text-red-500">
            {errors.produtoId.message}
          </span>
        )}
      </div>
      <div>
        <SelectInput
          label="Tipo de Documento *"
          field_name="tipoDocumento"
          value={formData.tipoDocumento}
          onChange={(e) =>
            setValue(
              "tipoDocumento",
              e.target.value as "Proposta" | "Apólice" | "Renovação" | "Endosso"
            )
          }
          options={[
            { text: "Proposta", value: "Proposta" },
            { text: "Apólice", value: "Apólice" },
            { text: "Renovação", value: "Renovação" },
            { text: "Endosso", value: "Endosso" },
          ]}
          required
          disabled={isDisabled}
        />
        {errors.tipoDocumento && (
          <span className="text-xs text-red-500">
            {errors.tipoDocumento.message}
          </span>
        )}
      </div>
      <div>
        <SelectInput
          label="Origem *"
          field_name="origem"
          value={formData.origem}
          onChange={(e) =>
            setValue(
              "origem",
              e.target.value as "Manual" | "Importação" | "Integração"
            )
          }
          options={[
            { text: "Manual", value: "Manual" },
            { text: "Importação", value: "Importação" },
            { text: "Integração", value: "Integração" },
          ]}
          required
          disabled={isDisabled}
        />
        {errors.origem && (
          <span className="text-xs text-red-500">{errors.origem.message}</span>
        )}
      </div>

      <CreateSeguradoModal
        open={showCreateSeguradoModal}
        onClose={() => setShowCreateSeguradoModal(false)}
        onSuccess={(seguradoId) => {
          refetchSegurados()
          setValue("seguradoId", seguradoId)
          setShowCreateSeguradoModal(false)
        }}
      />

      <CreateSeguradoraModal
        open={showCreateSeguradoraModal}
        onClose={() => setShowCreateSeguradoraModal(false)}
        onSuccess={(seguradoraId) => {
          refetchSeguradoras()
          setValue("seguradoraId", seguradoraId)
          setShowCreateSeguradoraModal(false)
        }}
      />

      <CreateProdutorModal
        open={showCreateProdutorModal}
        onClose={() => setShowCreateProdutorModal(false)}
        onSuccess={(produtorId) => {
          refetchProdutores()
          setValue("produtorId", produtorId)
          setShowCreateProdutorModal(false)
        }}
      />

      <CreateCorretoraModal
        open={showCreateCorretoraModal}
        onClose={() => setShowCreateCorretoraModal(false)}
        onSuccess={(corretoraId) => {
          refetchCorretoras()
          setValue("corretoraId", corretoraId)
          setShowCreateCorretoraModal(false)
        }}
      />

      <CreateRamoModal
        open={showCreateRamoModal}
        onClose={() => setShowCreateRamoModal(false)}
        onSuccess={(ramoId) => {
          refetchRamos()
          setValue("ramoId", ramoId)
          setShowCreateRamoModal(false)
        }}
      />

      <CreateProdutoModal
        open={showCreateProdutoModal}
        onClose={() => setShowCreateProdutoModal(false)}
        onSuccess={(produtoId) => {
          refetchProdutos()
          setValue("produtoId", produtoId)
          setShowCreateProdutoModal(false)
        }}
      />
    </div>
  )
}
