"use client"

import { Button } from "@/core/components/Button"
import { Input } from "@/core/components/Input"
import { PageTitle } from "@/core/components/PageTitle"
import { AccountsTable } from "@/modules/accounts-components/accounts/presentation/components/AccountsTable"
import { FileXls } from "@phosphor-icons/react/dist/ssr"

export function AccountsPage() {
  return (
    <main className="flex max-w-[1200px] flex-col">
      <PageTitle content="Contas" />
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-4">
          <Input placeholder="Pesquisar" variant="secondary" />
          <Button variant="secondary">Cadastrar</Button>
        </div>
        <Button className="flex items-center gap-1" variant="secondary">
          <FileXls size={22} />
          Exportar
        </Button>
      </div>
      <AccountsTable />
      <div>
        <Button variant="secondary">Salvar</Button>
      </div>
    </main>
  )
}
