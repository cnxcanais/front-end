import * as Input from "@/core/components/Input"
import { formatDate } from "@/core/utils/dateFunctions"
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form"
import { FormType } from "./CreateIncomeForm"

type Props = {
  index: number
  errors: FieldErrors<FormType>
  control: Control<FormType, any>
  register: UseFormRegister<FormType>
  getValues: UseFormGetValues<FormType>
}

export function IncomeDetailsInfo({
  errors,
  control,
  index,
  register,
  getValues,
}: Props) {
  return (
    <>
      <div className="align-center flex gap-4">
        <div className="flex max-w-[70px] flex-col gap-2">
          <label
            htmlFor={`incomeDetailsArray.${index}.part`}
            className="text-sm">
            Parcela
          </label>
          <Input.Root
            variant={
              errors.incomeDetailsArray?.[index]?.part ? "error" : "primary"
            }>
            <Input.Control
              {...register(`incomeDetailsArray.${index}.part`)}
              disabled
            />
          </Input.Root>
          {errors.incomeDetailsArray?.[index]?.part && (
            <span className="text-xs text-red-500">
              {errors.incomeDetailsArray[index]?.part.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`incomeDetailsArray.${index}.amount`}
            className="text-sm">
            Valor da Parcela
          </label>
          <Input.Root
            variant={
              errors.incomeDetailsArray?.[index]?.amount ? "error" : "primary"
            }>
            <Input.Currency
              name={`incomeDetailsArray.${index}.amount`}
              control={control}
            />
          </Input.Root>
          {errors.incomeDetailsArray?.[index]?.amount && (
            <span className="text-xs text-red-500">
              {errors.incomeDetailsArray?.[index]?.amount.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`incomeDetailsArray.${index}.due_date`}
            className="text-sm">
            Vencimento
          </label>
          <Input.Root
            variant={
              errors.incomeDetailsArray?.[index]?.due_date ? "error" : "primary"
            }>
            <Input.Control
              name={`incomeDetailsArray.${index}.due_date`}
              {...register(`incomeDetailsArray.${index}.due_date`)}
              type="date"
              value={formatDate(
                getValues(`incomeDetailsArray.${index}.due_date`)
              )}
            />
          </Input.Root>
          {errors.incomeDetailsArray?.[index]?.due_date && (
            <span className="text-xs text-red-500">
              {errors.incomeDetailsArray?.[index]?.due_date.message}
            </span>
          )}
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
