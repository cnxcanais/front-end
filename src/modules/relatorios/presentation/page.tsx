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

export function ReportsPage() {
  const [measures, setMeasures] = useState<Measure[]>([])
  const [dimensions, setDimensions] = useState<Dimension[]>([])
  const [selectedMeasures, setSelectedMeasures] = useState<string[]>([])
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([])
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
    if (selectedMeasures.length === 0) {
      toast.error("Selecione pelo menos uma medida")
      return
    }

    setLoading(true)
    try {
      const resultSet = await cubeApi.load({
        measures: selectedMeasures,
        dimensions: selectedDimensions,
      })

      setPivotData(resultSet.tablePivot())
    } catch (error) {
      toast.error("Erro ao executar consulta")
    } finally {
      setLoading(false)
    }
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

  const handleDropMeasures = (e: React.DragEvent) => {
    e.preventDefault()
    if (
      draggedItem?.type === "measure" &&
      !selectedMeasures.includes(draggedItem.name)
    ) {
      setSelectedMeasures([...selectedMeasures, draggedItem.name])
    }
    setDraggedItem(null)
  }

  const handleDropDimensions = (e: React.DragEvent) => {
    e.preventDefault()
    if (
      draggedItem?.type === "dimension" &&
      !selectedDimensions.includes(draggedItem.name)
    ) {
      setSelectedDimensions([...selectedDimensions, draggedItem.name])
    }
    setDraggedItem(null)
  }

  const removeMeasure = (name: string) => {
    setSelectedMeasures(selectedMeasures.filter((m) => m !== name))
  }

  const removeDimension = (name: string) => {
    setSelectedDimensions(selectedDimensions.filter((d) => d !== name))
  }

  if (loadingMeta) return <LoadingScreen />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Relatórios Analíticos</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Available Fields */}
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-semibold">Medidas Disponíveis</h2>
            <div className="space-y-2">
              {measures.map((measure) => (
                <div
                  key={measure.name}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, "measure", measure.name)
                  }
                  className="cursor-move rounded bg-blue-50 px-3 py-2 text-sm hover:bg-blue-100">
                  {measure.title}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-semibold">
              Dimensões Disponíveis
            </h2>
            <div className="space-y-2">
              {dimensions.map((dimension) => (
                <div
                  key={dimension.name}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, "dimension", dimension.name)
                  }
                  className="cursor-move rounded bg-green-50 px-3 py-2 text-sm hover:bg-green-100">
                  {dimension.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drop Zones */}
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDropMeasures}
            className="min-h-[200px] rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-4">
            <h2 className="mb-4 text-lg font-semibold text-blue-700">
              Medidas Selecionadas
            </h2>
            <div className="space-y-2">
              {selectedMeasures.length === 0 && (
                <p className="text-sm text-gray-500">Arraste medidas aqui</p>
              )}
              {selectedMeasures.map((name) => {
                const measure = measures.find((m) => m.name === name)
                return (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded bg-blue-100 px-3 py-2 text-sm">
                    <span>{measure?.title}</span>
                    <button
                      onClick={() => removeMeasure(name)}
                      className="text-red-600 hover:text-red-800">
                      <X size={16} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDropDimensions}
            className="min-h-[200px] rounded-lg border-2 border-dashed border-green-300 bg-green-50 p-4">
            <h2 className="mb-4 text-lg font-semibold text-green-700">
              Dimensões Selecionadas
            </h2>
            <div className="space-y-2">
              {selectedDimensions.length === 0 && (
                <p className="text-sm text-gray-500">Arraste dimensões aqui</p>
              )}
              {selectedDimensions.map((name) => {
                const dimension = dimensions.find((d) => d.name === name)
                return (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded bg-green-100 px-3 py-2 text-sm">
                    <span>{dimension?.title}</span>
                    <button
                      onClick={() => removeDimension(name)}
                      className="text-red-600 hover:text-red-800">
                      <X size={16} />
                    </button>
                  </div>
                )
              })}
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
                {Object.keys(pivotData[0]).map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {key.split(".").pop()?.replace("Proposta Analítica ", "")}
                  </th>
                ))}
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
