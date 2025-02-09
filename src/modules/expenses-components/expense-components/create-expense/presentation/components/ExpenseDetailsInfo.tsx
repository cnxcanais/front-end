import * as Input from "@/core/components/Input"
import { formatDate } from "@/core/utils/dateFunctions"
import { useFormContext } from "react-hook-form"
import { FormType } from "./CreateExpenseForm"

type ExpenseDetailsInfoProps = {
  index: number
}

export function ExpenseDetailsInfo({ index }: ExpenseDetailsInfoProps) {
  const {
    register,
    formState: { errors },
    control,
    getValues,
  } = useFormContext<FormType>()

  return (
    <>
      <div className="align-center flex gap-4">
        <div className="flex max-w-[70px] flex-col gap-2">
          <label
            htmlFor={`expenseDetailsArray.${index}.part`}
            className="text-sm">
            Parcela
          </label>
          <Input.Root
            variant={
              errors.expenseDetailsArray?.[index]?.part ? "error" : "primary"
            }>
            <Input.Control
              {...register(`expenseDetailsArray.${index}.part`)}
              disabled
            />
          </Input.Root>
          {errors.expenseDetailsArray?.[index]?.part && (
            <span className="text-xs text-red-500">
              {errors.expenseDetailsArray[index]?.part.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`expenseDetailsArray.${index}.amount`}
            className="text-sm">
            Valor da Parcela
          </label>
          <Input.Root
            variant={
              errors.expenseDetailsArray?.[index]?.amount ? "error" : "primary"
            }>
            <Input.Currency
              name={`expenseDetailsArray.${index}.amount`}
              control={control}
            />
          </Input.Root>
          {errors.expenseDetailsArray?.[index]?.amount && (
            <span className="text-xs text-red-500">
              {errors.expenseDetailsArray?.[index]?.amount.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`expenseDetailsArray.${index}.due_date`}
            className="text-sm">
            Vencimento
          </label>
          <Input.Root
            variant={
              errors.expenseDetailsArray?.[index]?.due_date ?
                "error"
              : "primary"
            }>
            <Input.Control
              name={`expenseDetailsArray.${index}.due_date`}
              {...register(`expenseDetailsArray.${index}.due_date`)}
              type="date"
              value={formatDate(
                getValues(`expenseDetailsArray.${index}.due_date`)
              )}
            />
          </Input.Root>
          {errors.expenseDetailsArray?.[index]?.due_date && (
            <span className="text-xs text-red-500">
              {errors.expenseDetailsArray?.[index]?.due_date.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`expenseDetailsArray.${index}.observation`}
            className="text-sm">
            Observação
          </label>
          <Input.Root>
            <Input.Control
              {...register(`expenseDetailsArray.${index}.observation`)}
              type="text"
            />
          </Input.Root>
        </div>
      </div>
    </>
  )
}
