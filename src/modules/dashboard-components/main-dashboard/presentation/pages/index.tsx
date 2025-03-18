"use client"
import { PageTitle } from "@/core/components/PageTitle"
import { DailyResultGraph } from "../components/dailyResultsGraph"
import { MonthlyIncomeGraph } from "../components/monthlyIncomeGraph"

export function MainDashboard() {
  return (
    <>
      <PageTitle content="Dashboard" />
      <div className="mb-6 mt-6 flex flex-col gap-6">
        <DailyResultGraph />
        <MonthlyIncomeGraph />
      </div>
    </>
  )
}
