import * as Input from "@/core/components/Input"
import { SelectInput } from "@/core/components/SelectInput"

interface ComissaoTabProps {
  register: any
  errors: any
  formData: any
  setValue: any
  readOnly?: boolean
}

export function ComissaoTab({
  register,
  errors,
  formData,
  setValue,
  readOnly,
}: ComissaoTabProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>% Comissão *</label>
        <Input.Root className="mt-2">
          <Input.Control
            type="number"
            {...register("percentualComissao", { valueAsNumber: true })}
            required
            disabled={readOnly}
          />
        </Input.Root>
        {errors.percentualComissao && (
          <span className="text-xs text-red-500">
            {errors.percentualComissao.message}
          </span>
        )}
      </div>
      <div>
        <SelectInput
          label="Comissão Sobre *"
          field_name="comissaoSobre"
          value={formData.comissaoSobre}
          onChange={(e) => setValue("comissaoSobre", e.target.value as any)}
          options={[
            { text: "Prêmio Líquido", value: "Premio Liquido" },
            { text: "Prêmio Comercial", value: "Premio Comercial" },
            { text: "Prêmio Total", value: "Premio Total" },
          ]}
          required
          disabled={readOnly}
        />
        {errors.comissaoSobre && (
          <span className="text-xs text-red-500">
            {errors.comissaoSobre.message}
          </span>
        )}
      </div>
      <div>
        <SelectInput
          label="Forma de Comissão *"
          field_name="formaComissao"
          value={formData.formaComissao}
          onChange={(e) => setValue("formaComissao", e.target.value as any)}
          options={[
            { text: "Na Parcela", value: "Na Parcela" },
            { text: "Antecipado", value: "Antecipado" },
            { text: "Recorrência", value: "Recorrencia" },
          ]}
          required
          disabled={readOnly}
        />
        {errors.formaComissao && (
          <span className="text-xs text-red-500">
            {errors.formaComissao.message}
          </span>
        )}
      </div>
      <div>
        <label>Valor de Comissão</label>
        <Input.Root className="mt-2">
          <Input.Control
            type="number"
            value={formData.valorComissao}
            disabled
          />
        </Input.Root>
        {errors.valorComissao && (
          <span className="text-xs text-red-500">
            {errors.valorComissao.message}
          </span>
        )}
      </div>
    </div>
  )
}
