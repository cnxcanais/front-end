"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import cubeApi from "@/lib/cubejs"
import { FileXls, X } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Measure = {
  name: string
  title: string
}

type Dimension = {
  name: string
  title: string
  type: string
}

type Filter = {
  dimension: string
  operator: string
  values: string[]
}

export function ReportsPage() {
  const [measures, setMeasures] = useState<Measure[]>([])
  const [dimensions, setDimensions] = useState<Dimension[]>([])
  const [rowDimensions, setRowDimensions] = useState<string[]>([])
  const [columnDimensions, setColumnDimensions] = useState<string[]>([])
  const [valueMeasures, setValueMeasures] = useState<string[]>([])
  const [filters, setFilters] = useState<Filter[]>([])
  const [pivotData, setPivotData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [draggedItem, setDraggedItem] = useState<{
    type: "measure" | "dimension"
    name: string
  } | null>(null)

  useEffect(() => {
    loadMetadata()
  }, [])

  const loadMetadata = async () => {
    try {
      const meta = await cubeApi.meta()
      const cube = meta.cubes.find(
        (c: any) => c.name === "VwPropostasAnalitica"
      )

      if (cube) {
        setMeasures(
          cube.measures.map((m: any) => ({
            name: m.name,
            title: (m.title || m.name).replace("Proposta Analítica ", ""),
          }))
        )

        setDimensions(
          cube.dimensions
            .filter((d: any) => d.public !== false)
            .map((d: any) => ({
              name: d.name,
              title: (d.title || d.name).replace("Proposta Analítica ", ""),
              type: d.type,
            }))
        )
      }
    } catch (error) {
      toast.error("Erro ao carregar metadados")
    } finally {
      setLoadingMeta(false)
    }
  }

  const handleRunQuery = async () => {
    if (valueMeasures.length === 0) {
      toast.error("Adicione pelo menos uma medida em Valores")
      return
    }

    setLoading(true)
    try {
      const allDimensions = [...rowDimensions, ...columnDimensions]
      const query: any = {
        measures: valueMeasures,
        dimensions: allDimensions,
      }

      if (filters.length > 0) {
        query.filters = filters.map((f) => ({
          member: f.dimension,
          operator: f.operator as any,
          values: f.values,
        }))
      }

      const resultSet = await cubeApi.load(query)
      const rawData = resultSet.tablePivot()

      // If we have both row and column dimensions, create a proper pivot
      if (rowDimensions.length > 0 && columnDimensions.length > 0) {
        const pivoted = createPivotTable(rawData, rowDimensions, columnDimensions, valueMeasures)
        setPivotData(pivoted)
      } else {
        setPivotData(rawData)
      }
    } catch (error) {
      toast.error("Erro ao executar consulta")
    } finally {
      setLoading(false)
    }
  }

  const createPivotTable = (
    data: any[],
    rows: string[],
    cols: string[],
    values: string[]
  ) => {
    if (data.length === 0) return []

    // Get unique values for columns
    const colValues = new Set<string>()
    data.forEach((row) => {
      cols.forEach((col) => {
        const colKey = row[col]
        if (colKey) colValues.add(colKey)
      })
    })

    // Group by row dimensions
    const grouped = new Map<string, any>()
    data.forEach((row) => {
      const rowKey = rows.map((r) => row[r]).join('|')
      if (!grouped.has(rowKey)) {
        const newRow: any = {}
        rows.forEach((r) => {
          newRow[r] = row[r]
        })
        grouped.set(rowKey, newRow)
      }

      const colKey = cols.map((c) => row[c]).join('|')
      values.forEach((val) => {
        grouped.get(rowKey)![`${colKey}_${val}`] = row[val] || 0
      })
    })

    return Array.from(grouped.values())
  }

  const handleExport = () => {
    if (pivotData.length === 0) {
      toast.error("Nenhum dado para exportar")
      return
    }

    const headers = Object.keys(pivotData[0])
    const csv = [
      headers.join(","),
      ...pivotData.map((row) => headers.map((h) => row[h]).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-${new Date().toISOString()}.csv`
    a.click()
  }

  const handleDragStart = (
    e: React.DragEvent,
    type: "measure" | "dimension",
    name: string
  ) => {
    setDraggedItem({ type, name })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDropRows = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem?.type === "dimension" && !rowDimensions.includes(draggedItem.name)) {
      setRowDimensions([...rowDimensions, draggedItem.name])
    }
    setDraggedItem(null)
  }

  const handleDropColumns = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem?.type === "dimension" && !columnDimensions.includes(draggedItem.name)) {
      setColumnDimensions([...columnDimensions, draggedItem.name])
    }
    setDraggedItem(null)
  }

  const handleDropValues = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem?.type === "measure" && !valueMeasures.includes(draggedItem.name)) {
      setValueMeasures([...valueMeasures, draggedItem.name])
    }
    setDraggedItem(null)
  }

  const handleDropFilters = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem?.type === "dimension") {
      const existingFilter = filters.find((f) => f.dimension === draggedItem.name)
      if (!existingFilter) {
        setFilters([...filters, { dimension: draggedItem.name, operator: "equals", values: [] }])
      }
    }
    setDraggedItem(null)
  }

  if (loadingMeta) return <LoadingScreen />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Relatórios Analíticos</h1>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Available Fields - Left Sidebar */}
        <div className="col-span-3 space-y-4">
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">Campos Disponíveis</h2>
            
            <div className="mb-4">
              <h3 className="mb-2 text-xs font-medium text-gray-600">Dimensões</h3>
              <div className="space-y-1">
                {dimensions.map((dimension) => (
                  <div
                    key={dimension.name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, "dimension", dimension.name)}
                    className="cursor-move rounded bg-gray-50 px-2 py-1.5 text-xs hover:bg-gray-100">
                    📊 {dimension.title}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-medium text-gray-600">Medidas</h3>
              <div className="space-y-1">
                {measures.map((measure) => (
                  <div
                    key={measure.name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, "measure", measure.name)}
                    className="cursor-move rounded bg-gray-50 px-2 py-1.5 text-xs hover:bg-gray-100">
                    Σ {measure.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pivot Table Builder - Right Side */}
        <div className="col-span-9 space-y-4">
          {/* Filters */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDropFilters}
            className="min-h-[60px] rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3">
            <h3 className="mb-2 text-xs font-semibold text-gray-600">🔍 FILTROS</h3>
            <div className="flex flex-wrap gap-2">
              {filters.length === 0 && (
                <p className="text-xs text-gray-400">Arraste dimensões aqui para filtrar</p>
              )}
              {filters.map((filter, idx) => {
                const dim = dimensions.find((d) => d.name === filter.dimension)
                return (
                  <div key={idx} className="flex items-center gap-2 rounded bg-white px-2 py-1 text-xs shadow-sm">
                    <span>{dim?.title}</span>
                    <button
                      onClick={() => setFilters(filters.filter((_, i) => i !== idx))}
                      className="text-red-600 hover:text-red-800">
                      <X size={12} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pivot Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Columns */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDropColumns}
              className="col-span-2 min-h-[60px] rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 p-3">
              <h3 className="mb-2 text-xs font-semibold text-purple-700">📋 COLUNAS</h3>
              <div className="flex flex-wrap gap-2">
                {columnDimensions.length === 0 && (
                  <p className="text-xs text-gray-400">Arraste dimensões aqui</p>
                )}
                {columnDimensions.map((name) => {
                  const dim = dimensions.find((d) => d.name === name)
                  return (
                    <div key={name} className="flex items-center gap-2 rounded bg-purple-100 px-2 py-1 text-xs">
                      <span>{dim?.title}</span>
                      <button
                        onClick={() => setColumnDimensions(columnDimensions.filter((d) => d !== name))}
                        className="text-red-600 hover:text-red-800">
                        <X size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Rows */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDropRows}
              className="min-h-[120px] rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-3">
              <h3 className="mb-2 text-xs font-semibold text-blue-700">📊 LINHAS</h3>
              <div className="space-y-1">
                {rowDimensions.length === 0 && (
                  <p className="text-xs text-gray-400">Arraste dimensões aqui</p>
                )}
                {rowDimensions.map((name) => {
                  const dim = dimensions.find((d) => d.name === name)
                  return (
                    <div key={name} className="flex items-center justify-between rounded bg-blue-100 px-2 py-1 text-xs">
                      <span>{dim?.title}</span>
                      <button
                        onClick={() => setRowDimensions(rowDimensions.filter((d) => d !== name))}
                        className="text-red-600 hover:text-red-800">
                        <X size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Values */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDropValues}
              className="min-h-[120px] rounded-lg border-2 border-dashed border-green-300 bg-green-50 p-3">
              <h3 className="mb-2 text-xs font-semibold text-green-700">Σ VALORES</h3>
              <div className="space-y-1">
                {valueMeasures.length === 0 && (
                  <p className="text-xs text-gray-400">Arraste medidas aqui</p>
                )}
                {valueMeasures.map((name) => {
                  const measure = measures.find((m) => m.name === name)
                  return (
                    <div key={name} className="flex items-center justify-between rounded bg-green-100 px-2 py-1 text-xs">
                      <span>{measure?.title}</span>
                      <button
                        onClick={() => setValueMeasures(valueMeasures.filter((m) => m !== name))}
                        className="text-red-600 hover:text-red-800">
                        <X size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleRunQuery} disabled={loading}>
          {loading ? "Carregando..." : "Executar Consulta"}
        </Button>
        {pivotData.length > 0 && (
          <Button
            variant="secondary"
            onClick={handleExport}
            className="flex items-center gap-2">
            <FileXls size={20} />
            Exportar CSV
          </Button>
        )}
      </div>

      {pivotData.length > 0 && (
        <div className="overflow-auto rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(pivotData[0]).map((key) => {
                  // If key contains underscore, it's a pivoted column (colValue_measure)
                  if (key.includes('_')) {
                    const parts = key.split('_')
                    const colValue = parts.slice(0, -1).join('_') // Everything before last underscore
                    return (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        {colValue}
                      </th>
                    )
                  }
                  // Otherwise it's a row dimension
                  return (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {key.split(".").pop()?.replace("Proposta Analítica ", "")}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {pivotData.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((value: any, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {typeof value === "number" ?
                        value.toLocaleString("pt-BR")
                      : value || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
