"use client"

import { getAccountId } from "@/core/utils/get-account-id"
import { useIncomeDetailsByMonthQuery } from "@/modules/income-components/income-details-components/infra/hooks/use-income-details-by-month-query"
import { ChartOptions } from "chart.js"
import { useEffect, useState } from "react"
import { BarGraph } from "./barGraph"

export function MonthlyIncomeGraph() {
  const [options, setOptions] = useState({})
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  })

  const account_id = getAccountId()

  const { data: currentYear } = useIncomeDetailsByMonthQuery(
    account_id,
    new Date().getFullYear()
  )
  const { data: lastYear } = useIncomeDetailsByMonthQuery(
    account_id,
    new Date().getFullYear() - 1
  )

  console.log(currentYear)

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

      const options: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Comparativo de Receitas Mensais",
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
