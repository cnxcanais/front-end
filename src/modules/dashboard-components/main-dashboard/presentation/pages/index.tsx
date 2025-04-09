"use client"

import { LoadingScreen } from "@/core/components/LoadingScreen"
import { PageTitle } from "@/core/components/PageTitle"
import { DailyResultGraph } from "@/modules/dashboard-components/main-dashboard/presentation/components/dailyResultsGraph"
import { MonthlyIncomeGraph } from "@/modules/dashboard-components/main-dashboard/presentation/components/monthlyIncomeGraph"
import { MonthlyExpenseGraph } from "@/modules/dashboard-components/main-dashboard/presentation/components/mothlyExpenseGraph"
import { OverdueExpensesTable } from "@/modules/dashboard-components/main-dashboard/presentation/components/OverdueExpensesTable"
import { OverdueIncomesTable } from "@/modules/dashboard-components/main-dashboard/presentation/components/OverdueIncomesTable"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"

export function MainDashboard() {
  const { data: permissions } = usePermissionQuery()
  if (!permissions) return <LoadingScreen />
  return (
    <>
      <PageTitle content="Dashboard" />
      <div className="mb-6 mt-6 flex flex-col gap-6">
        <div className="h-[400px] w-full">
          <MonthlyIncomeGraph />
        </div>
        <div className="h-[400px]">
          <MonthlyExpenseGraph />
        </div>
        <div className="h-[400px]">
          <DailyResultGraph />
        </div>

        <PageTitle content="Receitas Atrasadas" />
        <OverdueIncomesTable />
        <PageTitle content="Despesas Atrasadas" />
        <OverdueExpensesTable />
      </div>
    </>
  )
}
