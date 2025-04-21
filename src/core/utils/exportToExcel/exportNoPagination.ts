import * as XLSX from "xlsx"

export const exportNoPagination = () => {
  const table = document.getElementById("table")
  if (!table) return

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
        // Check if it's a date and convert if necessary

        tableObject[headers[index]].push(value)
      }
    })
  })

  tableObject["Data"]?.forEach((date, index) => {
    if (!date || date.trim() === "") {
      tableObject["Data"][index] = ""
      return
    }
    const [day, month, year] = date.split("/")
    const formattedDate = `${year}-${month}-${day}`
    tableObject["Data"][index] = new Date(formattedDate + "T08:00:00.000Z")
  })

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

  tableObject["Valor"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Valor"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Valor"][index] = Number(formattedValue)
  })

  tableObject["Valor Total"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Valor"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Valor Total"][index] = Number(formattedValue)
  })

  tableObject["Total"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Total"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Total"][index] = Number(formattedValue)
  })

  tableObject["Jan"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Jan"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Jan"][index] = Number(formattedValue)
  })

  tableObject["Fev"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Fev"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Fev"][index] = Number(formattedValue)
  })

  tableObject["Mar"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Mar"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Mar"][index] = Number(formattedValue)
  })

  tableObject["Abr"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Abr"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Abr"][index] = Number(formattedValue)
  })

  tableObject["Mai"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Mai"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Mai"][index] = Number(formattedValue)
  })

  tableObject["Jun"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Jun"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Jun"][index] = Number(formattedValue)
  })

  tableObject["Ago"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Ago"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Ago"][index] = Number(formattedValue)
  })

  tableObject["Set"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Set"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Set"][index] = Number(formattedValue)
  })

  tableObject["Out"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Out"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Out"][index] = Number(formattedValue)
  })

  tableObject["Nov"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Nov"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Nov"][index] = Number(formattedValue)
  })

  tableObject["Dez"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Dez"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Dez"][index] = Number(formattedValue)
  })

  tableObject["Valor Restante"]?.forEach((value, index) => {
    if (!value || value.trim() === "") {
      tableObject["Valor Restante"][index] = ""
      return
    }
    const formattedValue = value
      .replace("R$", "")
      .replace(" ", "")
      .replace(".", "")
      .replace(",", ".")
    tableObject["Valor Restante"][index] = Number(formattedValue)
  })

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

  // console.log("tableObject", formattedTable)

  // const tableData = Array.from(table?.getElementsByTagName("tr") || [])
  // const workbook = XLSX.utils.table_to_book(table, { sheet: "Tabela 1" })
  // XLSX.writeFile(workbook, "Tabela Exportada.xlsx")
}
