import { Button } from "@/core/components/Button"
import { Input } from "@/core/components/Input"
import { PageTitle } from "@/core/components/PageTitle"

export function CreateAccountPage() {
  return (
    <>
      <PageTitle content="Criar Conta" />
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label className="text-lg" htmlFor="name">
          Nome
        </label>
        <Input variant="secondary" name="name" type="text" />
      </div>
      <div className="mt-6 flex gap-4">
        <Button variant="secondary">Salvar</Button>
        <Button variant="tertiary">Voltar</Button>
      </div>
    </>
  )
}
