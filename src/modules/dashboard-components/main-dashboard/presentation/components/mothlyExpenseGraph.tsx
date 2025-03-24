"use client"
import { getAccountId } from "@/core/utils/get-account-id"
import { useExpenseDetailsByMonthQuery } from "@/modules/expenses-components/expense-details-components/infra/hooks/use-expense-details-by-month"
import { useEffect, useState } from "react"
import { BarGraph } from "./barGraph"

export function MonthlyExpenseGraph() {
  const [options, setOptions] = useState({})
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  })

  const account_id = getAccountId()

  const { data: currentYear } = useExpenseDetailsByMonthQuery(
    account_id,
    new Date().getFullYear()
  )
  const { data: lastYear } = useExpenseDetailsByMonthQuery(
    account_id,
    new Date().getFullYear() - 1
  )
  useEffect(() => {
    if (currentYear && lastYear) {
      const months = currentYear.totalPerMonth.map((item) => {
        const date = new Date(new Date().getFullYear(), item.month - 1)
        return date.toLocaleString("pt-br", { month: "short" })
      })

      const barChartInfo = {
        labels: months,
        datasets: [
          {
            label: (new Date().getFullYear() - 1).toString(),
            data:
              lastYear?.totalPerMonth
                .map((item) => item.value)
                .slice(0, currentYear.totalPerMonth.length) || [],
            backgroundColor: "#8a7444B3",
            borderRadius: 3,
            borderColor: "#453a22",
            borderWidth: 1,
            barPercentage: 1.0,
            categoryPercentage: 0.8,
          },
          {
            label: new Date().getFullYear().toString(),
            data: currentYear?.totalPerMonth.map((item) => item.value) || [],
            backgroundColor: "#072a3cB3",
            borderRadius: 3,
            borderColor: "#453a22",
            borderWidth: 1,
            barPercentage: 1.0,
            categoryPercentage: 0.8,
          },
        ],
      }

      const highestValue = Math.max(
        ...currentYear.totalPerMonth.map((item) => item.value),
        0
      )

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        outerWidth: 400,
        plugins: {
          title: {
            display: true,
            text: "Comparativo de Despesas Mensais",
            font: {
              size: 20,
              weight: "bold",
            },
            padding: 20,
          },
        },
        scales: {
          x: {
            stacked: false,
            title: {
              display: true,
              text: "Meses do Ano",
            },
          },
          y: {
            stacked: false,
            title: {
              display: true,
              text: "Valor",
            },
            max: highestValue + 500, // Set max to highest value + 1000
            min: 0,
          },
        },
      }

      setOptions(options)
      setBarChartData(barChartInfo)
    }
  }, [currentYear, lastYear])

  return <BarGraph data={barChartData} options={options} />
}
