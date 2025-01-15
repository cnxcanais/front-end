import { Eye, EyeSlash } from "@phosphor-icons/react"
import { useState } from "react"

export function InputPassword() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <input
        name="password"
        type={showPassword ? "text" : "password"}
        className={
          "w-full rounded-lg border border-white bg-transparent px-3 py-1.5 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
        }
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-100 hover:text-yellow-200"
        onClick={() => setShowPassword(!showPassword)}>
        {showPassword ?
          <Eye className="h-5 w-5" />
        : <EyeSlash className="h-5 w-5" />}
      </button>
    </div>
  )
}
