import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { SelectInput } from "@/core/components/SelectInput"

interface RepassesTabProps {
  register: any
  errors: any
  formData: any
  setValue: any
  produtores: any
}

export function RepassesTab({
  register,
  errors,
  formData,
  setValue,
  produtores,
}: RepassesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Repasses</h4>
        <Button
          onClick={() => {
            const newRepasse = {
              produtorId: "",
              percentualRepasse: undefined,
              repasseSobre: "Premio Liquido" as const,
              formaRepasse: "No recebimento" as const,
            }
            setValue("repasses", [...formData.repasses, newRepasse])
          }}>
          Adicionar Repasse
        </Button>
      </div>
      {formData.repasses.length === 0 ?
        <p className="text-sm text-gray-600">Nenhum repasse cadastrado</p>
      : formData.repasses.map((repasse: any, index: number) => (
          <div key={index} className="rounded border bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h5 className="font-medium">Repasse {index + 1}</h5>
              <button
                type="button"
                onClick={() => {
                  const newRepasses = formData.repasses.filter(
                    (_: any, i: number) => i !== index
                  )
                  setValue("repasses", newRepasses)
                }}
                className="text-sm text-red-600 hover:underline">
                Remover
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <SelectInput
                  label="Produtor *"
                  field_name={`repasses.${index}.produtorId`}
                  value={repasse.produtorId}
                  onChange={(e) => {
                    const newRepasses = [...formData.repasses]
                    newRepasses[index].produtorId = e.target.value
                    setValue("repasses", newRepasses)
                  }}
                  options={
                    produtores?.data?.map((p: any) => ({
                      text: p.nome,
                      value: p.id,
                    })) || []
                  }
                />
                {errors.repasses?.[index]?.produtorId && (
                  <span className="text-xs text-red-500">
                    {errors.repasses[index].produtorId.message}
                  </span>
                )}
              </div>
              <div>
                <label>% Repasse *</label>
                <Input.Root className="mt-2">
                  <Input.Control
                    type="number"
                    {...register(
                      `repasses.${index}.percentualRepasse` as any,
                      { valueAsNumber: true }
                    )}
                  />
                </Input.Root>
                {errors.repasses?.[index]?.percentualRepasse && (
                  <span className="text-xs text-red-500">
                    {errors.repasses[index].percentualRepasse.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  label="Repasse Sobre *"
                  field_name={`repasses.${index}.repasseSobre`}
                  value={repasse.repasseSobre}
                  onChange={(e) => {
                    const newRepasses = [...formData.repasses]
                    newRepasses[index].repasseSobre = e.target.value as any
                    setValue("repasses", newRepasses)
                  }}
                  options={[
                    { text: "Prêmio Líquido", value: "Premio Liquido" },
                    {
                      text: "Comissão da Corretora",
                      value: "Comissão da Corretora",
                    },
                    { text: "Valor Fixo", value: "Valor Fixo" },
                  ]}
                />
                {errors.repasses?.[index]?.repasseSobre && (
                  <span className="text-xs text-red-500">
                    {errors.repasses[index].repasseSobre.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  label="Forma de Repasse *"
                  field_name={`repasses.${index}.formaRepasse`}
                  value={repasse.formaRepasse}
                  onChange={(e) => {
                    const newRepasses = [...formData.repasses]
                    newRepasses[index].formaRepasse = e.target.value as any
                    setValue("repasses", newRepasses)
                  }}
                  options={[
                    { text: "No recebimento", value: "No recebimento" },
                    {
                      text: "Antecipado 1a parcela",
                      value: "Antecipado 1a parcela",
                    },
                    {
                      text: "Antecipado parcela",
                      value: "Antecipado parcela",
                    },
                    {
                      text: "Antecipado emissão",
                      value: "Antecipado emissão",
                    },
                  ]}
                />
                {errors.repasses?.[index]?.formaRepasse && (
                  <span className="text-xs text-red-500">
                    {errors.repasses[index].formaRepasse.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
