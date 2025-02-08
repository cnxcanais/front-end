"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { CreateExpenseDetailsForm } from "../components/CreateExpenseDetailsForm"

export function EditExpenseDetailsPage() {
  return (
    <main className="flex w-full max-w-[1200px] flex-col">
      <PageTitle content="Criar Parcela" />
      <CreateExpenseDetailsForm />
    </main>
  )
}
