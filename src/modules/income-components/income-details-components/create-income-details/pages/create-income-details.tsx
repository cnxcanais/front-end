"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { CreateIncomeDetailsForm } from "../components/CreateIncomeDetailsForm"

export function EditIncomeDetailsPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Criar Parcela" />
      <CreateIncomeDetailsForm />
    </main>
  )
}
