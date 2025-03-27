"use client"

import { PageTitle } from "@/core/components/PageTitle"
import { DailyResultGraph } from "@/modules/dashboard-components/main-dashboard/presentation/components/dailyResultsGraph"
import { MonthlyIncomeGraph } from "@/modules/dashboard-components/main-dashboard/presentation/components/monthlyIncomeGraph"
import { MonthlyExpenseGraph } from "@/modules/dashboard-components/main-dashboard/presentation/components/mothlyExpenseGraph"
import { OverdueTable } from "../components/OverdueTable"

export function MainDashboard() {
  return (
    <>
      <PageTitle content="Dashboard" />
      <div className="mb-6 mt-6 flex flex-col gap-6">
        <div className="grid w-full max-w-[1800px] grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-[400px] w-full">
            <MonthlyIncomeGraph />
          </div>
          <div className="h-[400px] w-full">
            <MonthlyExpenseGraph />
          </div>
        </div>
        <div className="h-[400px] w-full max-w-[1800px]">
          <DailyResultGraph />
        </div>

        <OverdueTable />
      </div>
    </>
  )
}
