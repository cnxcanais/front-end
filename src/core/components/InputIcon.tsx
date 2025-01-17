import { MagnifyingGlass } from "@phosphor-icons/react"
import clsx from "clsx"
import { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement> & {
  iconType: "search"
  type?: string
  width?: string
}

export function InputIcon({
  iconType,
  type = "text",
  width = "w-[350px]",
  ...props
}: Props) {
  return (
    <div className={width}>
      <div className="grid grid-cols-1">
        <input
          {...props}
          type={type}
          className={clsx(
            "col-start-1 row-start-1 block rounded-md bg-white py-1.5 pl-3 pr-10 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pr-9 sm:text-sm/6",
            width
          )}
        />

        {iconType === "search" && (
          <MagnifyingGlass
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-gray-400 sm:size-4"
          />
        )}
      </div>
    </div>
  )
}
