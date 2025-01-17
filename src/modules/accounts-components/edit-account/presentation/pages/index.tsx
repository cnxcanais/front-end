"use client"

import { Button } from "@/core/components/Button"
import { Input } from "@/core/components/Input"
import { PageTitle } from "@/core/components/PageTitle"
import { useRouter } from "next/navigation"

export function EditAccountPage({ id }: { id: string }) {
  const { push } = useRouter()

  return (
    <main>
      <PageTitle content="Editar Conta" />
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label className="text-lg" htmlFor="name">
          Nome
        </label>
        <Input variant="secondary" name="name" type="text" />
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
