"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { PageTitle } from "@/core/components/PageTitle"
import { useRouter } from "next/navigation"

export function CreateAccountPage() {
  const { push } = useRouter()

  return (
    <main>
      <PageTitle content="Criar Conta" />
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label className="text-lg" htmlFor="name">
          Nome
        </label>
        <Input.Root>
          <Input.Control type="text" />
        </Input.Root>
      </div>
      <div className="mt-6 flex gap-4">
        <Button onClick={() => {}} variant="secondary">
          Salvar
        </Button>
        <Button onClick={() => push("/accounts")} variant="tertiary">
          Voltar
        </Button>
      </div>
    </main>
  )
}
