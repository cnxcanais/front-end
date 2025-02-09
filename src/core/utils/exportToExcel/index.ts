import * as XLSX from "xlsx"

export const exportToExcel = () => {
  const table = document.getElementById("table")
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Tabela 1" })
  XLSX.writeFile(workbook, "Tabela Exportada.xlsx")
}
