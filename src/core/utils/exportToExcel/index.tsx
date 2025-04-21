import { Table } from "@/core/components/Table"
import { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import * as XLSX from "xlsx"

export const exportToExcel = (tableData: any, columns: any) => {
  return new Promise((resolve) => {
    const tempDiv = document.createElement("div")
    const root = createRoot(tempDiv)

    const ExportTable = () => {
      const tableRef = useRef<HTMLTableElement>(null)

      useEffect(() => {
        if (!tableRef.current) return

        const table = tableRef.current

        // Get headers (th elements)
        const headers = Array.from(table.getElementsByTagName("th")).map(
          (th) => th.textContent || ""
        )

        // Get all rows (tr elements)
        const rows = Array.from(table.getElementsByTagName("tr"))

        // Create an object to store the key-value pairs
        const tableObject: { [key: string]: any[] } = {}

        // Initialize arrays for each header
        headers.forEach((header) => {
          tableObject[header] = []
        })

        rows.forEach((row) => {
          const cells = Array.from(row.getElementsByTagName("td"))
          cells.forEach((cell, index) => {
            if (headers[index]) {
              const value = cell.textContent || ""
              tableObject[headers[index]].push(value)
            }
          })
        })

        // Date formatting for "Data" field
        tableObject["Data"]?.forEach((date, index) => {
          if (!date || date.trim() === "") {
            tableObject["Data"][index] = ""
            return
          }
          const dateArray = date.split("/")

          if (dateArray.length === 3) {
            const [day, month, year] = dateArray
            const formattedDate = `${year}-${month}-${day}`
            tableObject["Data"][index] = new Date(
              formattedDate + "T08:00:00.000Z"
            )
          }

          if (dateArray.length === 2) {
            const [month, year] = dateArray
            const formattedDate = `${year}-${month}-01`
            tableObject["Data"][index] = new Date(
              formattedDate + "T08:00:00.000Z"
            )
          }
        })

        // Date formatting for "Vencimento" field
        tableObject["Vencimento"]?.forEach((date, index) => {
          if (!date || date.trim() === "") {
            tableObject["Vencimento"][index] = ""
            return
          }
          const [day, month, year] = date.split("-")
          const formattedDate = `${year}-${month}-${day}`
          tableObject["Vencimento"][index] = new Date(
            formattedDate + "T08:00:00.000Z"
          )
        })

        // Function to format currency values
        const formatCurrencyField = (fieldName: string) => {
          tableObject[fieldName]?.forEach((value, index) => {
            if (!value || value.trim() === "") {
              tableObject[fieldName][index] = ""
              return
            }
            const formattedValue = value
              .replace("R$", "")
              .replace(" ", "")
              .replace(".", "")
              .replace(",", ".")
            tableObject[fieldName][index] = Number(formattedValue)
          })
        }

        // Format all currency fields
        const currencyFields = [
          "Valor",
          "Valor Total",
          "Total",
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
          "Valor Restante",
        ]
        currencyFields.forEach(formatCurrencyField)

        // Format Parcelas field
        tableObject["Parcelas"]?.forEach((value, index) => {
          if (!value || value.trim() === "") {
            tableObject["Parcelas"][index] = ""
            return
          }
          tableObject["Parcelas"][index] = Number(value)
        })

        const { Arquivos, Ações, Obs, ...formattedTable } = tableObject

        const finalRows = formattedTable[Object.keys(formattedTable)[0]].map(
          (_, rowIndex) => {
            const row = {}
            Object.keys(formattedTable).forEach((header) => {
              row[header] = formattedTable[header][rowIndex]
            })
            return row
          }
        )

        const ws = XLSX.utils.json_to_sheet(finalRows)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Tabela 1")
        XLSX.writeFile(wb, "Tabela Exportada.xlsx")

        resolve(undefined)
      }, [])

      return <Table ref={tableRef} columns={columns} data={tableData} />
    }

    root.render(<ExportTable />)
  })
}
