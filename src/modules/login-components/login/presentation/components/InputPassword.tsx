import { Input } from "@/core/components/Input"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import { useState } from "react"

export function InputPassword() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input name="password" type={showPassword ? "text" : "password"} />
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
