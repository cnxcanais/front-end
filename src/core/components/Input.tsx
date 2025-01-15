import { ComponentProps } from "react"
import { tv, VariantProps } from "tailwind-variants"

const input = tv({
  base: [
    "rounded-lg px-4 py-3 text-sm font-semibold shadow-sm",
    "text-white data-[focus]:outline-white/25 w-full bg-transparent border px-3 py-1.5 text-sm/6 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2",
  ],

  variants: {
    variant: {
      primary: "border-white",
      secondary: "border-black",
    },
  },

  defaultVariants: {
    variant: "primary",
  },
})

export type InputProps = ComponentProps<"input"> & VariantProps<typeof input>

export function Input({ className, variant, ...props }: InputProps) {
  return <input className={input({ variant, className })} {...props} />
}
