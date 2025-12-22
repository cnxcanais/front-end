import { Corretora } from "@/@types/corretora"
import { Produtor } from "@/@types/produtor"
import { Segurado } from "@/@types/segurado"
import { Seguradora } from "@/@types/seguradora"
import * as Input from "@/core/components/Input"
import { SelectInput } from "@/core/components/SelectInput"

interface PropostaTabProps {
  register: any
  errors: any
  formData: any
  setValue: any
  segurados: Segurado.GetResponse
  seguradoras: Seguradora.GetResponse
  produtores: Produtor.GetResponse
  corretoras: Corretora.GetResponse
  ramos: any
  produtosOptions: any
  isEndosso?: boolean
  isRenovacao?: boolean
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
}: PropostaTabProps) {
  const isDisabled = isEndosso || isRenovacao
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
        <SelectInput
          label="Segurado *"
          field_name="seguradoId"
          value={formData.seguradoId}
          onChange={(e) => {
            const seguradoId = e.target.value
            setValue("seguradoId", seguradoId)
            const produtorId = segurados?.data?.find(
              (s) => s.id === seguradoId
            ).produtorId
            const corretoraId = segurados?.data?.find(
              (s) => s.id === seguradoId
            ).corretoraId
            if (corretoraId) setValue("corretoraId", corretoraId)
            if (produtorId) setValue("produtorId", produtorId)
          }}
          options={
            segurados?.data?.map((s: any) => ({
              text: s.nomeRazaoSocial,
              value: s.id,
            })) || []
          }
          required
          disabled={isDisabled}
        />
        {errors.seguradoId && (
          <span className="text-xs text-red-500">
            {errors.seguradoId.message}
          </span>
        )}
      </div>
      <div>
        <SelectInput
          label="Seguradora *"
          field_name="seguradoraId"
          value={formData.seguradoraId}
          onChange={(e) => setValue("seguradoraId", e.target.value)}
          options={
            seguradoras?.data?.map((s: any) => ({
              text: s.razaoSocial,
              value: s.id,
            })) || []
          }
          required
          disabled={isDisabled}
        />
        {errors.seguradoraId && (
          <span className="text-xs text-red-500">
            {errors.seguradoraId.message}
          </span>
        )}
      </div>
      <div>
        <SelectInput
          label="Produtor *"
          field_name="produtorId"
          value={formData.produtorId}
          onChange={(e) => {
            const produtorId = e.target.value
            setValue("produtorId", produtorId)
          }}
          options={
            produtores?.data?.map((p: any) => ({
              text: p.nome,
              value: p.id,
            })) || []
          }
          required
          disabled={isDisabled}
        />
        {errors.produtorId && (
          <span className="text-xs text-red-500">
            {errors.produtorId.message}
          </span>
        )}
      </div>
      <div>
        <SelectInput
          label="Corretora *"
          disabled
          field_name="corretoraId"
          value={formData.corretoraId}
          onChange={(e) => setValue("corretoraId", e.target.value)}
          options={
            corretoras?.data?.map((c: any) => ({
              text: c.razaoSocial,
              value: c.id,
            })) || []
          }
          required
        />
        {errors.corretoraId && (
          <span className="text-xs text-red-500">
            {errors.corretoraId.message}
          </span>
        )}
      </div>
      <div>
        <SelectInput
          label="Ramo *"
          field_name="ramoId"
          value={formData.ramoId}
          onChange={(e) => setValue("ramoId", e.target.value)}
          options={
            ramos?.data?.map((r: any) => ({
              text: r.descricao,
              value: r.id,
            })) || []
          }
          required
          disabled={isDisabled}
        />
        {errors.ramoId && (
          <span className="text-xs text-red-500">{errors.ramoId.message}</span>
        )}
      </div>
      <div>
        <SelectInput
          label="Produto"
          field_name="produtoId"
          value={formData.produtoId}
          onChange={(e) => setValue("produtoId", e.target.value)}
          options={produtosOptions}
          disabled={isDisabled}
        />
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
          onChange={(e) => setValue("tipoDocumento", e.target.value as any)}
          options={[
            { text: "Proposta", value: "Proposta" },
            { text: "Apólice", value: "Apólice" },
            { text: "Renovação", value: "Renovação" },
            { text: "Endosso", value: "Endosso" },
          ]}
          required
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
          onChange={(e) => setValue("origem", e.target.value as any)}
          options={[
            { text: "Manual", value: "Manual" },
            { text: "Importação", value: "Importação" },
            { text: "Integração", value: "Integração" },
          ]}
          required
        />
        {errors.origem && (
          <span className="text-xs text-red-500">{errors.origem.message}</span>
        )}
      </div>
    </div>
  )
}
