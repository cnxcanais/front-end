import { ComponentProps } from "react"
import { Controller, Control as HookControl } from "react-hook-form"
import { NumericFormat, NumericFormatProps } from "react-number-format"
import Select from "react-select"
import { tv, VariantProps } from "tailwind-variants"

const div = tv({
  base: [
    "rounded-lg px-4 text-sm py-3 font-semibold shadow-sm",
    "border flex items-center",
    "focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-100",
  ],

  variants: {
    variant: {
      primary: "border-black bg-white",
      secondary: "border-white bg-transparent !text-white",
      error:
        "border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100",
    },
  },

  defaultVariants: {
    variant: "primary",
  },
})

type InputPrefixProps = ComponentProps<"div">

export function Icon(props: InputPrefixProps) {
  return <div className="cursor-pointer" {...props} />
}

type InputControlProps = ComponentProps<"input">

export function Control(props: InputControlProps) {
  return (
    <input
      className="w-full !border-none bg-transparent p-0 text-sm !outline-none !ring-0 autofill:bg-transparent autofill:text-white disabled:cursor-not-allowed"
      {...props}
    />
  )
}

type CurrencyInputProps = {
  name?: string
  control?: HookControl<any>
  value?: number
  onChange?: (value: number | undefined) => void
} & Omit<NumericFormatProps, "value" | "onChange">

export function Currency({
  name,
  control,
  value: externalValue,
  onChange: externalOnChange,
  ...props
}: CurrencyInputProps) {
  // For React Hook Form
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <NumericFormat
            value={value || ""}
            onValueChange={({ floatValue }) => {
              onChange(floatValue || 0)
            }}
            decimalSeparator=","
            thousandSeparator="."
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            className="w-full !border-none bg-transparent p-0 text-sm !outline-none !ring-0 disabled:cursor-not-allowed"
            {...props}
          />
        )}
      />
    )
  }

  // For standalone use
  return (
    <NumericFormat
      value={externalValue || ""}
      onValueChange={({ floatValue }) => {
        externalOnChange?.(floatValue || 0)
      }}
      decimalSeparator=","
      thousandSeparator="."
      prefix="R$ "
      decimalScale={2}
      fixedDecimalScale
      className="w-full !border-none bg-transparent p-0 text-sm !outline-none !ring-0 disabled:cursor-not-allowed"
      {...props}
    />
  )
}

type Option = {
  label: string
  value: string
}

type SelectInputProps = {
  name: string
  control: HookControl<any>
  options: Option[]
  placeholder?: string
  isDisabled?: boolean
}

export function SelectInput({
  name,
  control,
  options,
  placeholder,
  disabled,
  ...props
}: SelectInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Select
          value={options.find((option) => option.value === value) || null}
          onChange={(option) => onChange(option ? option.value : null)}
          options={options}
          placeholder={placeholder}
          isDisabled={disabled}
          classNames={{
            control: () =>
              "!border-0 !bg-transparent !shadow-none !ring-0 flex-1",
            valueContainer: () => "!p-0",
            input: () => "!text-sm",
            menu: () => "!text-sm",
            indicatorSeparator: () => "!hidden",
            container: () => "flex-1",
            dropdownIndicator: () => "!p-0",
            placeholder: () => "!m-0",
            singleValue: () => "!m-0",
          }}
          styles={{
            control: (base) => ({
              ...base,
              boxShadow: "none",
              minHeight: "unset",
              padding: 0,
              "&:hover": {
                border: "none",
              },
            }),
            container: (base) => ({
              ...base,
              flex: "1",
              width: "100%",
            }),
            valueContainer: (base) => ({
              ...base,
              padding: 0,
            }),
            input: (base) => ({
              ...base,
              margin: 0,
              padding: 0,
            }),
            dropdownIndicator: (base) => ({
              ...base,
              padding: 0,
            }),
          }}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: "#000",
              primary25: "#f3f4f6",
              neutral20: "transparent",
              neutral30: "transparent",
            },
          })}
          {...props}
        />
      )}
    />
  )
}

export type InputRootProps = ComponentProps<"div"> & VariantProps<typeof div>

export const Root = ({ variant, className, ...props }: InputRootProps) => {
  return <div className={div({ variant, className })} {...props} />
}
