"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { PageTitle } from "@/core/components/PageTitle"
import { FileXls, MagnifyingGlass } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"

export const IncomeGroupDashboard = () => {
  const { push } = useRouter()

  return (
    <main className="flex max-w-[1000px] flex-col">
      <PageTitle content="Cadastrar Grupo de Receitas" />
      <div className="mt-8 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <Input.Root>
            <Input.Control placeholder="Procurar" />
            <Input.Icon>
              <MagnifyingGlass className="h-5 w-5" />
            </Input.Icon>
          </Input.Root>{" "}
          <Button onClick={() => push("/accounts/create")} variant="secondary">
            Cadastrar
          </Button>
        </div>
        <Button className="flex items-center gap-1" variant="secondary">
          <FileXls size={22} />
          Exportar
        </Button>
      </div>
    </main>
  )
}
