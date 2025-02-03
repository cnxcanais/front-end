"use client"

import { useState } from "react"
import { ExpenseBudgetPage } from "../../budget-expense/budget-expenses/presentation/pages"
import { IncomeBudgetPage } from "../../budget-income/budget-incomes/presentation/pages"
import { NavigationBar, TabName } from "../components/NavigationBar"

export function BudgetPage() {
  const [tab, setTab] = useState<TabName>(TabName.RECEITAS)

  const handleSetTab = (selectedTab: TabName) => {
    setTab(selectedTab)
  }
  return (
    <>
      <NavigationBar setTab={handleSetTab} activeTab={tab} />
      {tab === TabName.RECEITAS ?
        <IncomeBudgetPage />
      : <ExpenseBudgetPage />}
    </>
  )
}
