import * as Input from "@/core/components/Input"

interface VeiculoTabProps {
  register: any
  errors: any
}

export function VeiculoTab({ register, errors }: VeiculoTabProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>Placa do Veículo</label>
        <Input.Root className="mt-2">
          <Input.Control {...register("placaVeiculo")} />
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
          <Input.Control {...register("chassiVeiculo")} />
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
          <Input.Control {...register("marcaVeiculo")} />
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
          <Input.Control {...register("modeloVeiculo")} />
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
          <Input.Control {...register("complementoItem")} />
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
