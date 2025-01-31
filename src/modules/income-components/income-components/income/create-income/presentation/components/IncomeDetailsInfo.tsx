import * as Input from "@/core/components/Input"
import { Control, FieldErrors, UseFormRegister } from "react-hook-form"
import { FormType } from "./CreateIncomeForm"

type Props = {
  index: number
  errors: FieldErrors<FormType>
  control: Control<FormType, any>
  initialIndividualValue: number
  register: UseFormRegister<FormType>
}

export function IncomeDetailsInfo({
  errors,
  control,
  index,
  initialIndividualValue,
  register,
}: Props) {
  return (
    <>
      <div className="align-center flex gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`incomeDetailsArray.${index}.part`}
            className="text-sm">
            Parcela
          </label>
          <Input.Root>
            <Input.Control
              {...register(`incomeDetailsArray.${index}.part`)}
              disabled
            />
          </Input.Root>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`incomeDetailsArray.${index}.amount`}
            className="text-sm">
            Valor da Parcela
          </label>
          <Input.Root>
            <Input.Currency
              name={`incomeDetailsArray.${index}.amount`}
              control={control}
            />
          </Input.Root>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`incomeDetailsArray.${index}.observation`}
            className="text-sm">
            Observação
          </label>
          <Input.Root>
            <Input.Control
              {...register(`incomeDetailsArray.${index}.observation`)}
              type="text"
            />
          </Input.Root>
        </div>
      </div>
    </>
  )
}
