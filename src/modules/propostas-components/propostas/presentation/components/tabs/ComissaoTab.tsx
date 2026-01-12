import { SelectInput } from "@/core/components/SelectInput"
import {
  comissaoSobreOptions,
  formaComissaoOptions,
} from "@/modules/propostas-components/types/enums"

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
        <SelectInput
          label="Comissão Sobre *"
          field_name="comissaoSobre"
          value={formData.comissaoSobre}
          onChange={(e) => setValue("comissaoSobre", e.target.value as any)}
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
          onChange={(e) => setValue("formaComissao", e.target.value as any)}
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
