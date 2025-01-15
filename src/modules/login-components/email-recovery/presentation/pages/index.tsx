import { Button } from "@/core/components/Button"
import { Input } from "@/core/components/Input"
import Link from "next/link"

export function PasswordRetrieval() {
  return (
    <div className="flex min-w-96 flex-col gap-3 rounded-lg bg-black-100 p-5 text-white-100">
      <h2 className="mb-2 text-xl font-light">
        Digite seu e-mail para resetar a senha.
      </h2>

      <div className="mb-2 flex flex-col gap-2">
        <label className="text-lg" htmlFor="email">
          E-mail
        </label>
        <Input type="email" />
      </div>

      <Link href="/" className="text-xs text-beige-100 hover:text-yellow-200">
        Voltar para login
      </Link>

      <Button>Resetar</Button>
    </div>
  )
}
