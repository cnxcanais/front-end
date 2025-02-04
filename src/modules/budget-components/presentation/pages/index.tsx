"use client"

import { ExpenseBudgetPage } from "@/modules/budget-components/budget-expense/budget-expenses/presentation/pages"
import { IncomeBudgetPage } from "@/modules/budget-components/budget-income/budget-incomes/presentation/pages"
import {
  NavigationBar,
  TabName,
} from "@/modules/budget-components/presentation/components/NavigationBar"
import { useState } from "react"

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
