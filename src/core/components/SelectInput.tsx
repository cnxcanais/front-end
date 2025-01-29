import { UseFormRegister } from "react-hook-form"

type SelectInputProps = {
  label: string
  field_name: string
  options: {
    text: string
    value: string
  }[]
  register: UseFormRegister<any>
}

export default function SelectInput({
  label,
  field_name,
  options,
  register,
}: SelectInputProps) {
  return (
    <div className="mt-8">
      <label htmlFor={field_name} className="text-lg">
        {label}
      </label>
      <div className="mt-2 grid flex-1 grid-cols-1">
        <select
          {...register(field_name)}
          defaultValue="null"
          className="col-start-1 row-start-1 w-full appearance-none rounded-lg border-black bg-white px-4 py-3 pl-3 pr-8 text-sm font-semibold text-gray-900 shadow-sm outline outline-1 -outline-offset-1 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm/6">
          <option value="null"></option>
          {options.map((option, index) => {
            return (
              <option value={option.value} key={index}>
                {option.text}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}
