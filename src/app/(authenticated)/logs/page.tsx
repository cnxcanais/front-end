import { PageTitle } from "@/core/components/PageTitle"
import { LogsTable } from "@/modules/logs-components/presentation/components/LogsTable"

export default function LogsPage() {
  return (
    <div>
      <PageTitle content="Registros" />
      <LogsTable />
    </div>
  )
}
