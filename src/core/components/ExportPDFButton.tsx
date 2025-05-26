import { ReactNode, useState } from "react"
import { exportTableToPDF } from "../utils/export-table-to-pdf"
import { Button } from "./Button"

export function ExportTableToPDFButton({
  tableId = "table",
  filename = "table-export",
  className = "",
  children,
  options = {},
}: {
  tableId?: string
  filename?: string
  className?: string
  children?: ReactNode
  options?: {
    orientation?: "portrait" | "landscape"
    format?: "a4" | "a3" | "letter"
    scale?: number
    backgroundColor?: string
    padding?: number
  }
}) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      exportTableToPDF(tableId, filename)
    } catch (error) {
      console.error("Erro na exportação:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button className="flex" onClick={handleExport} disabled={isExporting}>
      {isExporting ?
        <>
          <svg
            className="-ml-1 mr-2 h-4 w-4 animate-spin text-current"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children || "Exportando..."}
        </>
      : <>
          <svg
            className="-ml-1 mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {children || "Exportar PDF"}
        </>
      }
    </Button>
  )
}
