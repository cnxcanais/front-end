import { CreateIncomeDetailsForm } from "@/modules/income-components/income-details-components/create-income-details/components/CreateIncomeDetailsForm"

export default async function CreateIncomeDetailsRender({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <CreateIncomeDetailsForm income_id={id} />
}
