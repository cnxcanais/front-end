"use client"

import { BarGraphData } from "@/@types/bar-graph-data"
import { ExpenseDetails } from "@/@types/expense-details"
import { getAccountId } from "@/core/utils/get-account-id"
import { useExpenseDetailsQuery } from "@/modules/expenses-components/expense-details-components/infra/hooks/use-expense-details-query"
import { useIncomeDetailsQuery } from "@/modules/income-components/income-details-components/infra/hooks/use-income-details-query"
import { useEffect, useState } from "react"
import { BarGraph } from "../components/barGraph"

export function DailyResultGraph() {
  const [incomeArray, setIncomeArray] = useState<BarGraphData.Day[]>([])
  const [expenseArray, setExpenseArray] = useState<BarGraphData.Day[]>([])
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  })
  const [daysOfTheMonth, setDaysOfTheMonth] = useState<number[]>([])
  const [options, setOptions] = useState({})

  const account_id = getAccountId()

  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
  const lastDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  )

  const trimmedFirstDay = `${firstDayOfMonth.getFullYear()}-${firstDayOfMonth.getMonth() + 1}-${firstDayOfMonth.getDate()}`
  const trimmedLastDay = `${lastDayOfMonth.getFullYear()}-${lastDayOfMonth.getMonth() + 1}-${lastDayOfMonth.getDate()}`

  const { data: incomeData } = useIncomeDetailsQuery(account_id, {
    start_date: trimmedFirstDay,
    end_date: trimmedLastDay,
  })
  const { data: expenseData } = useExpenseDetailsQuery(account_id, {
    start_date: trimmedFirstDay,
    end_date: trimmedLastDay,
  })

  useEffect(() => {
    if (incomeData) {
      const sumedArray = []
      incomeData.incomeDetails.forEach((income) => {
        if (income.is_paid) {
          const currentDay = new Date(income.due_date).getDate()
          const existingDayIndex = sumedArray.findIndex(
            (item) => item.day === currentDay
          )

          if (existingDayIndex !== -1) {
            // If day exists, add to its value
            sumedArray[existingDayIndex].value +=
              Number(income.amount) *
              (Number(income.income.income_percentage) / 100)
          } else {
            // If day doesn't exist, push new object
            sumedArray.push({
              day: currentDay,
              value:
                Number(income.amount) *
                (Number(income.income.income_percentage) / 100),
            })
          }
        }
      })

      setIncomeArray(sumedArray)
    }
  }, [incomeData])

  useEffect(() => {
    if (expenseData) {
      const sumedArray = []
      expenseData.expenseDetails.forEach(
        (expense: ExpenseDetails.ExpenseDetailsType) => {
          if (expense.is_paid) {
            const currentDay = new Date(expense.due_date).getDate()
            const existingDayIndex = sumedArray.findIndex(
              (item) => item.day === currentDay
            )

            if (existingDayIndex !== -1) {
              // If day exists, add to its value
              sumedArray[existingDayIndex].value +=
                Number(expense.amount) *
                (Number(expense.expense.expense_percentage) / 100)
            } else {
              // If day doesn't exist, push new object
              sumedArray.push({
                day: currentDay,
                value:
                  Number(expense.amount) *
                  (Number(expense.expense.expense_percentage) / 100),
              })
            }
          }
        }
      )

      setExpenseArray(sumedArray)
    }
  }, [expenseData])

  useEffect(() => {
    const getDaysInMonth = () => {
      const now = new Date()
      const currentDay = now.getDate()
      return Array.from({ length: currentDay }, (_, i) => i + 1)
    }
    setDaysOfTheMonth(getDaysInMonth())
  }, [])

  useEffect(() => {
    if (incomeArray && daysOfTheMonth && expenseArray) {
      const maxIncome = Math.max(...incomeArray.map((item) => item.value), 0)
      const maxExpense = Math.max(...expenseArray.map((item) => item.value), 0)
      const highestValue = Math.max(maxIncome, maxExpense)

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Receitas e Despesas Diárias",
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
              text: "Dias do Mês",
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

      const barChartInfo = {
        labels: daysOfTheMonth,
        datasets: [
          {
            label: "Receitas",
            data: daysOfTheMonth.map((day) => {
              const dayData = incomeArray?.find((item) => item.day === day)
              return dayData ? dayData.value : null
            }),
            backgroundColor: "#8a7444B3",
            borderRadius: 3,
            borderColor: "#453a22",
            borderWidth: 1,
            barPercentage: 1.0,
            categoryPercentage: 0.8,
          },
          {
            label: "Despesas",
            data: daysOfTheMonth.map((day) => {
              const dayData = expenseArray?.find((item) => item.day === day)
              return dayData ? dayData.value : null
            }),
            backgroundColor: "#072a3cB3",
            borderRadius: 3,
            borderColor: "#453a22",
            borderWidth: 1,
            barPercentage: 1.0,
            categoryPercentage: 0.8,
          },
        ],
      }
      setBarChartData(barChartInfo)
      setOptions(options)
    }
  }, [incomeArray, daysOfTheMonth, expenseArray])

  return <BarGraph data={barChartData} options={options} />
}
