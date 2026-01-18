"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { SinistroKanbam } from "@/modules/sinistros-components/sinistro/presentation/components/SinistroKanbam"

export default function SuppliersRender() {
  return (
    <main className="flex w-full flex-col">
      <PageTitle content="Sinistros" />
      <SinistroKanbam />
    </main>
  )
}
