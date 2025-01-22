"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { PageTitle } from "@/core/components/PageTitle"
import { getCookie } from "@/lib/cookies"
import { IncomeGroupTable } from "@/modules/income-groups-components/presentation/components/IncomeGroupsTable"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { FileXls } from "@phosphor-icons/react/dist/ssr"
import { useRouter } from "next/navigation"

export function IncomeGroupPage() {
  const { push } = useRouter()

  const { create } = JSON.parse(getCookie("permissions")).componentAccess
    .income_groups

  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Grupos de Receita" />
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-4">
          <Input.Root>
            <Input.Control placeholder="Procurar" />
            <Input.Icon>
              <MagnifyingGlass className="h-5 w-5" />
            </Input.Icon>
          </Input.Root>{" "}
          {create && (
            <Button
              onClick={() => push("/income-groups/create")}
              variant="secondary">
              Cadastrar
            </Button>
          )}
        </div>
        <Button className="flex items-center gap-1" variant="secondary">
          <FileXls size={22} />
          Exportar
        </Button>
      </div>
      <IncomeGroupTable />
    </main>
  )
}
