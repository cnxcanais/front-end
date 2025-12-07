import { ReactNode } from "react"

interface Column {
  header: string
  accessor: string
  accessor2?: string
  render?: (value: any, row: any) => ReactNode
}

export function Table<T>({
  columns,
  data,
  className,
  ref,
  expandedRowId,
  expandedRowContent,
}: {
  columns: Column[]
  data: T[]
  className?: string
  ref?: React.Ref<HTMLTableElement>
  expandedRowId?: string
  expandedRowContent?: (row: T) => ReactNode
}) {
  return (
    <div className="">
      <div className="my-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table
                className={`${className} min-w-full divide-y divide-gray-300`}
                id="table"
                ref={ref}>
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column, columnIndex) => (
                      <th
                        key={columnIndex}
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column) => (
                        <td
                          key={column.header}
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
                    </tr>
                  ))}
                  {expandedRowId && expandedRowContent && (
                    <>
                      {data.map((row, rowIndex) =>
                        expandedRowId === (row as any)._id ? (
                          <tr key={`expanded-${rowIndex}`}>
                            <td colSpan={columns.length} className="px-3 py-3 bg-gray-50">
                              {expandedRowContent(row)}
                            </td>
                          </tr>
                        ) : null
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
