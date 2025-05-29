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

  // Add title if provided
  let startY = 20
  if (title) {
    doc.setFontSize(16)
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 30, {
      align: "center",
    })
    startY = 50 // Adjust starting position to accommodate the title
  }

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: startY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    margin: { top: 20 },
    didDrawPage: (data) => {
      doc.setFontSize(14)
    },
  })

  doc.save(`${filename}.pdf`)
}
