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
        <div className="flex items-center justify-between">
          <Button onClick={handleOpenParcelaModal}>Gerar Parcelas</Button>
          <div
            className={`flex items-center gap-4 ${
              (
                Math.abs(
                  (formData.premioLiquido || 0) +
                    (formData.valoresAdicionais || 0) +
                    (formData.iof || 0) -
                    (formData.parcelas?.reduce(
                      (acc, parcela) => acc + (parcela.valor || 0),
                      0
                    ) || 0)
                ) < 0.01
              ) ?
                "text-green-500"
              : "text-red-500"
            }`}>
            <div>
              <label>Valor Total</label>
              <h3>
                {(
                  (formData.premioLiquido || 0) +
                  (formData.valoresAdicionais || 0) +
                  (formData.iof || 0)
                ).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>
            </div>
            <span> | </span>
            <div>
              <label>Parcelas</label>
              <h3>
                {(
                  formData.parcelas?.reduce(
                    (acc, parcela) => acc + parcela.valor,
                    0
                  ) || 0
                ).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>
            </div>
          </div>
        </div>
      )}
      {formData.parcelas?.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 font-semibold">Parcelas</h4>
          {formData.parcelas.map((parcela, index: number) => (
            <div key={index} className="mb-2 rounded border p-2">
              <div className="grid grid-cols-[80px_1fr_100px_1fr_1fr] gap-2">
                <div>
                  <label>Parcela</label>
                  <Input.Root variant="disabled">
                    <Input.Control value={parcela.numeroParcela} disabled />
                  </Input.Root>
                </div>
                <div>
                  <label>Valor</label>
                  <Input.Root>
                    <Input.Control
                      type="number"
                      step="0.01"
                      value={parcela.valor}
                      disabled={readOnly}
                      onChange={(e) => {
                        const newParcelas = [...formData.parcelas]
                        newParcelas[index].valor =
                          parseFloat(e.target.value) || 0
                        setValue("parcelas", newParcelas)
                      }}
                    />
                  </Input.Root>
                </div>
                <div>
                  <label>% Comissão</label>
                  <Input.Root>
                    <Input.Control
                      type="number"
                      step="0.01"
                      max="100"
                      value={parcela.percentualComissao ?? ""}
                      disabled={readOnly}
                      onChange={(e) => {
                        const newParcelas = [...formData.parcelas]
                        const value = parseFloat(e.target.value)
                        newParcelas[index].percentualComissao =
                          value ? Math.min(value, 100) : null
                        setValue("parcelas", newParcelas)
                      }}
                    />
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
                  <label>Previsão Pagamento</label>
                  <Input.Root>
                    <Input.Control
                      type="date"
                      value={parcela.previsaoPagamento}
                      onChange={(e) => {
                        const newParcelas = [...formData.parcelas]
                        newParcelas[index].previsaoPagamento = e.target.value
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
