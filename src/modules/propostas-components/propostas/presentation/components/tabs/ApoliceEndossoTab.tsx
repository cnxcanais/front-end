import * as Input from "@/core/components/Input"
import { SelectInput } from "@/core/components/SelectInput"

interface ApoliceEndossoTabProps {
  register: any
  errors: any
  formData: any
  setValue: any
}

export function ApoliceEndossoTab({
  register,
  errors,
  formData,
  setValue,
}: ApoliceEndossoTabProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>Data de Emissão</label>
        <Input.Root className="mt-2">
          <Input.Control type="date" {...register("dataEmissao")} />
        </Input.Root>
        {errors.dataEmissao && (
          <span className="text-xs text-red-500">
            {errors.dataEmissao.message}
          </span>
        )}
      </div>
      <div>
        <label>Número da Apólice</label>
        <Input.Root className="mt-2">
          <Input.Control {...register("numeroApolice")} />
        </Input.Root>
        {errors.numeroApolice && (
          <span className="text-xs text-red-500">
            {errors.numeroApolice.message}
          </span>
        )}
      </div>
      <div>
        <label>Número do Endosso</label>
        <Input.Root className="mt-2">
          <Input.Control {...register("numeroEndosso")} />
        </Input.Root>
        {errors.numeroEndosso && (
          <span className="text-xs text-red-500">
            {errors.numeroEndosso.message}
          </span>
        )}
      </div>
      <div>
        <SelectInput
          label="Renovação"
          field_name="renovacao"
          value={formData.renovacao}
          onChange={(e) => setValue("renovacao", e.target.value as any)}
          options={[
            { text: "Renovável", value: "Renovável" },
            { text: "Não Renovável", value: "Não Renovável" },
          ]}
        />
        {errors.renovacao && (
          <span className="text-xs text-red-500">
            {errors.renovacao.message}
          </span>
        )}
      </div>
      {formData.renovacao === "Não Renovável" && (
        <div className="col-span-2">
          <label>Motivo da Não Renovação</label>
          <Input.Root className="mt-2">
            <Input.Control {...register("motivoNaoRenovacao")} />
          </Input.Root>
          {errors.motivoNaoRenovacao && (
            <span className="text-xs text-red-500">
              {errors.motivoNaoRenovacao.message}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
