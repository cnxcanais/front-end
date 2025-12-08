import * as Input from "@/core/components/Input"

interface VigenciaTabProps {
  register: any
  errors: any
}

export function VigenciaTab({ register, errors }: VigenciaTabProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>Início da Vigência *</label>
        <Input.Root className="mt-2">
          <Input.Control type="date" {...register("inicioVigencia")} />
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
          <Input.Control type="date" {...register("fimVigencia")} />
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
