import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import Link from "next/link"

export function PasswordRetrieval() {
  return (
    <div className="flex min-w-96 flex-col gap-4 rounded-lg bg-zinc-900/80 p-7 text-white">
      <h2 className="mb-2 text-xl font-light">
        Digite seu e-mail para resetar a senha
      </h2>

      <div className="mb-2 flex flex-col gap-3">
        <label htmlFor="email">E-mail</label>
        <Input.Root variant="secondary">
          <Input.Control type="email" />
        </Input.Root>
      </div>

      <Link href="/" className="text-xs text-yellow-100 hover:text-yellow-200">
        Voltar para login
      </Link>

      <Button>Resetar</Button>
    </div>
  )
}
