import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form"
import { toast } from "sonner"
import { PropostaFormSchema } from "../../validation/schema"

interface PremioParcelasTabProps {
  register: UseFormRegister<PropostaFormSchema>
  errors: FieldErrors<PropostaFormSchema>
  formData: PropostaFormSchema
  setValue: UseFormSetValue<PropostaFormSchema>
  setShowParcelasModal: (show: boolean) => void
  premioLiquido: number
  readOnly?: boolean
}

export function PremioParcelasTab({
  register,
  errors,
  formData,
  setValue,
  setShowParcelasModal,
  premioLiquido,
  readOnly,
}: PremioParcelasTabProps) {
  const handleOpenParcelaModal = () => {
    console.log(premioLiquido)
    if (!premioLiquido) {
      toast.error("Defina o valor do prêmio líquido")
      return
    }
    setShowParcelasModal(true)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label>Prêmio Líquido *</label>
          <Input.Root className="mt-2">
            <Input.Control
              type="number"
              {...register("premioLiquido", { valueAsNumber: true })}
              required
              disabled={readOnly}
            />
          </Input.Root>
          {errors.premioLiquido && (
            <span className="text-xs text-red-500">
              {errors.premioLiquido.message}
            </span>
          )}
        </div>
        <div>
          <label>Valores Adicionais</label>
          <Input.Root className="mt-2">
            <Input.Control
              type="number"
              {...register("valoresAdicionais", {
                setValueAs: (v) => (v === "" ? null : Number(v)),
              })}
              disabled={readOnly}
            />
          </Input.Root>
        </div>
        <div>
          <label>IOF</label>
          <Input.Root className="mt-2">
            <Input.Control
              type="number"
              {...register("iof", {
                setValueAs: (v) => (v === "" ? null : Number(v)),
              })}
              disabled={readOnly}
            />
          </Input.Root>
        </div>
      </div>
      {!readOnly && (
        <Button onClick={handleOpenParcelaModal}>Gerar Parcelas</Button>
      )}
      {formData.parcelas?.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 font-semibold">Parcelas</h4>
          {formData.parcelas.map((parcela: any, index: number) => (
            <div key={index} className="mb-2 rounded border p-2">
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label>Parcela</label>
                  <Input.Root variant="disabled">
                    <Input.Control value={parcela.numeroParcela} disabled />
                  </Input.Root>
                </div>
                <div>
                  <label>Valor</label>
                  <Input.Root>
                    <Input.Control value={parcela.valor} disabled />
                  </Input.Root>
                </div>
                <div>
                  <label>Vencimento</label>
                  <Input.Root>
                    <Input.Control
                      type="date"
                      value={parcela.dataVencimento}
                      onChange={(e) => {
                        const newParcelas = [...formData.parcelas]
                        newParcelas[index].dataVencimento = e.target.value
                        setValue("parcelas", newParcelas)
                      }}
                      disabled={readOnly}
                    />
                  </Input.Root>
                </div>
                <div>
                  <label>Previsão Recebimento</label>
                  <Input.Root>
                    <Input.Control
                      type="date"
                      value={parcela.previsaoRecebimento}
                      onChange={(e) => {
                        const newParcelas = [...formData.parcelas]
                        newParcelas[index].previsaoRecebimento = e.target.value
                        setValue("parcelas", newParcelas)
                      }}
                      disabled={readOnly}
                    />
                  </Input.Root>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
