import { PageTitle } from "@/core/components/PageTitle"
import { BanksTable } from "@/modules/banks-components/banks/presentation/components/BanksTable"

export function BanksPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Bancos" />
      <BanksTable />
    </main>
  )
}
