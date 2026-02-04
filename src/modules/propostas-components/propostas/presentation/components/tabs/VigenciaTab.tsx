import * as Input from "@/core/components/Input"
import { FieldErrors, UseFormRegister } from "react-hook-form"
import { PropostaFormSchema } from "../../validation/schema"

interface VigenciaTabProps {
  register: UseFormRegister<PropostaFormSchema>
  errors: FieldErrors<PropostaFormSchema>
  readOnly?: boolean
}

export function VigenciaTab({ register, errors, readOnly }: VigenciaTabProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>Início da Vigência *</label>
        <Input.Root className="mt-2">
          <Input.Control
            type="date"
            {...register("inicioVigencia")}
            disabled={readOnly}
          />
        </Input.Root>
        {errors.inicioVigencia && (
          <span className="text-xs text-red-500">
            {errors.inicioVigencia.message}
          </span>
        )}
      </div>
      <div>
        <label>Fim da Vigência *</label>
        <Input.Root className="mt-2">
          <Input.Control
            type="date"
            {...register("fimVigencia")}
            disabled={readOnly}
          />
        </Input.Root>
        {errors.fimVigencia && (
          <span className="text-xs text-red-500">
            {errors.fimVigencia.message}
          </span>
        )}
      </div>
    </div>
  )
}
