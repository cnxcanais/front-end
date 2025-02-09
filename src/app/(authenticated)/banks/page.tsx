import { PageTitle } from "@/core/components/PageTitle"
import { BanksTable } from "@/modules/banks-components/banks/presentation/components/BanksTable"

export default function BanksRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Bancos" />
      <BanksTable />
    </main>
  )
}
