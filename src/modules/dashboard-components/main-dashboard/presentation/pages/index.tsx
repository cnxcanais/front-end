"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { DailyResultGraph } from "../components/dailyResultsGraph"
import { MonthlyIncomeGraph } from "../components/monthlyIncomeGraph"
import { MonthlyExpenseGraph } from "../components/mothlyExpenseGraph"

export function MainDashboard() {
  return (
    <>
      <PageTitle content="Dashboard" />
      <div className="mb-6 mt-6 flex flex-col gap-6">
        <div className="flex max-w-[1000px] flex-col gap-6">
          <DailyResultGraph />
        </div>

        <div className="flex max-w-[1200px] gap-6">
          <MonthlyIncomeGraph />
          <MonthlyExpenseGraph />
        </div>
      </div>
    </>
  )
}
