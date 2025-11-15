import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function exportTableToPDF(
  tableId: string = "table",
  filename: string = "exportacao",
  autoExclude: boolean = true,
  title?: string
) {
  const table = document.getElementById(tableId) as HTMLTableElement
  if (!table) {
    console.error(`Tabela com id "${tableId}" não encontrada.`)
    return
  }

  const doc = new jsPDF("landscape", "pt", "a4")

  // Padrão de exclusão automático (case insensitive)
  const commonExcludeHeaders =
    autoExclude ?
      [
        "ações",
        "acoes",
        "actions",
        "action",
        "quitar",
        "quit",
        "pay",
        "obs",
        "obs.",
        "observações",
        "observacoes",
        "observations",
        "notes",
        "editar",
        "edit",
        "update",
        "deletar",
        "delete",
        "remove",
        "remover",
        "detalhes",
        "details",
        "view",
        "visualizar",
        "opções",
        "opcoes",
        "options",
        "controles",
        "controls",
      ]
    : []

  // Obter índices de colunas a excluir
  const thElements = Array.from(table.querySelectorAll("thead tr th"))
  const excludeIndexes = thElements
    .map((th, i) => ({
      index: i,
      text: th.textContent?.trim().toLowerCase() || "",
    }))
    .filter((th) => commonExcludeHeaders.includes(th.text))
    .map((th) => th.index)

  // Cabeçalhos (sem os excluídos)
  const headers = thElements
    .map((th, i) => ({
      text: th.textContent?.trim() || "",
      index: i,
    }))
    .filter((h) => !excludeIndexes.includes(h.index))
    .map((h) => h.text)

  // Corpo da tabela (sem os excluídos)
  const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
    Array.from(tr.querySelectorAll("td"))
      .map((td, i) => ({
        text: td.textContent?.trim() || "",
        index: i,
      }))
      .filter((cell) => !excludeIndexes.includes(cell.index))
      .map((cell) => cell.text)
  )

  let startY = 20

  // Split title into lines
  const titleLines = title.split("\n")
  const lineHeight = 15

  titleLines.forEach((line, index) => {
    // Set font size for each line - first line larger, rest smaller
    if (index === 0) {
      doc.setFontSize(16) // First line gets larger font
    } else {
      doc.setFontSize(10) // Subsequent lines get smaller font
    }

    doc.text(line.trim(), 40, 30 + index * lineHeight)
  })

  const addLogo = () => {
    const logoUrl = "/images/cnx-logo.png"

    try {
      // Calculate position for upper right corner
      const pageWidth = doc.internal.pageSize.getWidth()
      const imgWidth = 120
      const imgHeight = 40
      const xPos = pageWidth - imgWidth - 40
      const yPos = titleLines.length > 1 ? 20 : 10

      doc.addImage(logoUrl, "PNG", xPos, yPos, imgWidth, imgHeight)
    } catch (error) {
      console.error("Error adding logo:", error)
    }
  }

  addLogo()

  // Add title if provided

  startY = 40 + titleLines.length * lineHeight // Adjust starting position

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: startY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    margin: { top: 10 },
    didDrawPage: (data) => {
      doc.setFontSize(14)
    },
  })

  doc.save(`${filename}.pdf`)
}
