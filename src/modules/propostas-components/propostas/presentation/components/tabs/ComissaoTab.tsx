import { SelectInput } from "@/core/components/SelectInput"
import {
  comissaoSobreOptions,
  formaComissaoOptions,
} from "@/modules/propostas-components/types/enums"
import { FieldErrors, UseFormSetValue } from "react-hook-form"
import { PropostaFormSchema } from "../../validation/schema"

interface ComissaoTabProps {
  errors: FieldErrors<PropostaFormSchema>
  formData: PropostaFormSchema
  setValue: UseFormSetValue<PropostaFormSchema>
  readOnly?: boolean
}

export function ComissaoTab({
  errors,
  formData,
  setValue,
  readOnly,
}: ComissaoTabProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <SelectInput
          label="Comissão Sobre *"
          field_name="comissaoSobre"
          value={formData.comissaoSobre}
          onChange={(e) =>
            setValue("comissaoSobre", e.target.value as "Premio Liquido")
          }
          options={comissaoSobreOptions}
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
          onChange={(e) =>
            setValue(
              "formaComissao",
              e.target.value as "Na Parcela" | "Antecipado"
            )
          }
          options={formaComissaoOptions}
          required
          disabled={readOnly}
        />
        {errors.formaComissao && (
          <span className="text-xs text-red-500">
            {errors.formaComissao.message}
          </span>
        )}
      </div>
    </div>
  )
}
