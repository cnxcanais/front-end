import { ReactNode, useMemo, useState } from "react"

interface Column {
  header: string | ReactNode
  accessor: string
  accessor2?: string
  sortable?: boolean
  render?: (value: any, row: any) => ReactNode
}

type SortConfig = {
  key: string
  direction: "asc" | "desc"
} | null

export function Table<T>({
  id = "table",
  columns,
  data,
  className,
  ref,
  expandedRowIds,
  expandedRowContent,
  enableSorting = false,
}: Readonly<{
  id?: string
  columns: Column[]
  data: T[]
  className?: string
  ref?: React.Ref<HTMLTableElement>
  expandedRowIds?: string[]
  expandedRowContent?: (row: T) => ReactNode
  enableSorting?: boolean
}>) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" }
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" }
      }
      return null
    })
  }

  const sortedData = useMemo(() => {
    if (!enableSorting || !sortConfig) return data

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // Convert to numbers if both values are numeric
      const aNum = Number(aValue)
      const bNum = Number(bValue)
      if (!isNaN(aNum) && !isNaN(bNum)) {
        aValue = aNum
        bValue = bNum
      }

      if (aValue === bValue) return 0

      const comparison = aValue < bValue ? -1 : 1
      return sortConfig.direction === "asc" ? comparison : -comparison
    })
  }, [data, sortConfig, enableSorting])
  return (
    <div className="">
      <div className="my-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="ring-black/5 overflow-hidden shadow ring-1 sm:rounded-lg">
              <table
                className={`${className} min-w-full divide-y divide-gray-300`}
                id={id}
                ref={ref}>
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column, columnIndex) => {
                      const isSortable = enableSorting && column.sortable !== false
                      const isCurrentSort = sortConfig?.key === column.accessor
                      
                      return (
                        <th
                          key={columnIndex}
                          scope="col"
                          className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${
                            isSortable ? "cursor-pointer select-none hover:text-blue-600" : ""
                          }`}
                          onClick={() => isSortable && handleSort(column.accessor)}>
                          {typeof column.header === "string" ? column.header : column.header}
                          {isSortable && isCurrentSort && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedData.flatMap((row, rowIndex) => {
                    const rowId = (row as any).id || (row as any)._id
                    const rows = [
                      <tr key={`row-${rowIndex}-${rowId}`}>
                        {columns.map((column, colIndex) => (
                          <td
                            key={`${column.accessor}-${colIndex}`}
                            className="no-scrollbar max-w-96 overflow-x-auto whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {column.render ?
                              column.render(
                                column.accessor2 && row[column.accessor] ?
                                  row[column.accessor][column.accessor2]
                                : row[column.accessor],
                                row
                              )
                            : column.accessor2 && row[column.accessor] ?
                              row[column.accessor][column.accessor2]
                            : row[column.accessor]}
                          </td>
                        ))}
                      </tr>,
                    ]
                    if (expandedRowIds?.includes(rowId) && expandedRowContent) {
                      rows.push(
                        <tr key={`expanded-${rowIndex}-${rowId}`}>
                          <td
                            colSpan={columns.length}
                            className="bg-gray-50 px-3 py-3 pb-6">
                            {expandedRowContent(row)}
                          </td>
                        </tr>
                      )
                    }
                    return rows
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
