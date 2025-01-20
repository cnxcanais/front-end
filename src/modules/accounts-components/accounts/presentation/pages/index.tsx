"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { PageTitle } from "@/core/components/PageTitle"
import { AccountsTable } from "@/modules/accounts-components/accounts/presentation/components/AccountsTable"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { FileXls } from "@phosphor-icons/react/dist/ssr"
import { useRouter } from "next/navigation"

export function AccountsPage() {
  const { push } = useRouter()

  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Contas" />
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-4">
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
      <AccountsTable />
    </main>
  )
}
