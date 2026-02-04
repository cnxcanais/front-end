import * as Input from "@/core/components/Input"
import { FieldErrors, UseFormRegister } from "react-hook-form"
import { PropostaFormSchema } from "../../validation/schema"

interface VeiculoTabProps {
  register: UseFormRegister<PropostaFormSchema>
  errors: FieldErrors<PropostaFormSchema>
  readOnly?: boolean
}

export function VeiculoTab({ register, errors, readOnly }: VeiculoTabProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>Placa do Veículo</label>
        <Input.Root className="mt-2">
          <Input.Control {...register("placaVeiculo")} disabled={readOnly} />
        </Input.Root>
        {errors.placaVeiculo && (
          <span className="text-xs text-red-500">
            {errors.placaVeiculo.message}
          </span>
        )}
      </div>
      <div>
        <label>Chassi do Veículo</label>
        <Input.Root className="mt-2">
          <Input.Control {...register("chassiVeiculo")} disabled={readOnly} />
        </Input.Root>
        {errors.chassiVeiculo && (
          <span className="text-xs text-red-500">
            {errors.chassiVeiculo.message}
          </span>
        )}
      </div>
      <div>
        <label>Marca do Veículo</label>
        <Input.Root className="mt-2">
          <Input.Control {...register("marcaVeiculo")} disabled={readOnly} />
        </Input.Root>
        {errors.marcaVeiculo && (
          <span className="text-xs text-red-500">
            {errors.marcaVeiculo.message}
          </span>
        )}
      </div>
      <div>
        <label>Modelo do Veículo</label>
        <Input.Root className="mt-2">
          <Input.Control {...register("modeloVeiculo")} disabled={readOnly} />
        </Input.Root>
        {errors.modeloVeiculo && (
          <span className="text-xs text-red-500">
            {errors.modeloVeiculo.message}
          </span>
        )}
      </div>
      <div>
        <label>Ano de Fabricação</label>
        <Input.Root className="mt-2">
          <Input.Control
            type="number"
            {...register("anoFabricacaoVeiculo", { valueAsNumber: true })}
            disabled={readOnly}
          />
        </Input.Root>
        {errors.anoFabricacaoVeiculo && (
          <span className="text-xs text-red-500">
            {errors.anoFabricacaoVeiculo.message}
          </span>
        )}
      </div>
      <div>
        <label>Ano do Modelo</label>
        <Input.Root className="mt-2">
          <Input.Control
            type="number"
            {...register("anoModeloVeiculo", { valueAsNumber: true })}
            disabled={readOnly}
          />
        </Input.Root>
        {errors.anoModeloVeiculo && (
          <span className="text-xs text-red-500">
            {errors.anoModeloVeiculo.message}
          </span>
        )}
      </div>
      <div className="col-span-2">
        <label>Complemento do Item</label>
        <Input.Root className="mt-2">
          <Input.Control {...register("complementoItem")} disabled={readOnly} />
        </Input.Root>
        {errors.complementoItem && (
          <span className="text-xs text-red-500">
            {errors.complementoItem.message}
          </span>
        )}
      </div>
    </div>
  )
}
