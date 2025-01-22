import { ComponentProps } from "react"
import { tv, VariantProps } from "tailwind-variants"

const div = tv({
  base: [
    "rounded-lg px-4 text-sm py-3 font-semibold shadow-sm",
    "border flex items-center",
  ],

  variants: {
    variant: {
      primary:
        "border-black focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100",
      secondary:
        "border-white text-white focus-within:border-zinc-300 focus-within:ring-2 focus-within:ring-zinc-100",
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
      className="flex-1 border-0 bg-transparent p-0 outline-none disabled:cursor-not-allowed"
      {...props}
    />
  )
}

export type InputRootProps = ComponentProps<"div"> & VariantProps<typeof div>

export const Root = ({ variant, className, ...props }: InputRootProps) => {
  return <div className={div({ variant, className })} {...props} />
}
