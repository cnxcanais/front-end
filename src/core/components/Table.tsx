import { ReactNode } from "react"

interface Column {
  header: string
  accessor: string
  render?: (value: any, row: any) => ReactNode
}

export function Table<T>({ columns, data }: { columns: Column[]; data: T[] }) {
  return (
    <div className="">
      <div className="my-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300" id="table">
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
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {column.render ?
                            column.render(row[column.accessor], row)
                          : row[column.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
