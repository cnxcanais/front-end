import { ComponentProps } from "react"
import { tv, VariantProps } from "tailwind-variants"

const button = tv({
  base: [
    "rounded-md text-sm font-semibold outline-none shadow-sm",
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black",
    "active:opacity-80 duration-300 ease-in-out",
  ],

  variants: {
    variant: {
      primary: "bg-yellow-100 text-white hover:bg-yellow-200",
      secondary: "bg-yellow-200 hover:bg-yellow-100 text-white",
      tertiary: "bg-blue-100 hover:bg-blue-200",
    },
  },

  defaultVariants: {
    variant: "primary",
  },
})

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof button>

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button {...props} className={button({ variant, className })} />
}
