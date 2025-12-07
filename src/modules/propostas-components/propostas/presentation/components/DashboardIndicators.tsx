"use client"

import {
  ArrowClockwise,
  CheckCircle,
  Clock,
  FileText,
} from "@phosphor-icons/react"
import { useState } from "react"
import { usePropostaQuery } from "../../infra/hooks/use-proposta-query"

interface DashboardIndicatorsProps {
  onFilterChange?: (filterType: string, data: any[]) => void
}

export function DashboardIndicators({
  onFilterChange,
}: DashboardIndicatorsProps) {
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const handleRefresh = () => {
    setLastUpdated(new Date())
  }

  const propostasAtivas = usePropostaQuery(1, 100, {
    situacao: "Ativo",
    tipoDocumento: "Proposta",
  })

  const propostasVigentes = propostasAtivas?.data?.data?.filter(
    (p) =>
      new Date(p._inicioVigencia) <= new Date() &&
      new Date(p._fimVigencia) >= new Date()
  ) || []

  const apolicesAtivas = usePropostaQuery(1, 100, {
    situacao: "Ativo",
    tipoDocumento: "Apólice",
  })

  const apolicesVigentes = apolicesAtivas?.data?.data?.filter(
    (p) =>
      new Date(p._inicioVigencia) <= new Date() &&
      new Date(p._fimVigencia) >= new Date()
  ) || []

  const formatDate = (date: Date) => {
    return (
      date.toLocaleDateString("pt-BR") +
      " " +
      date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    )
  }

  return (
    <div className="mb-8 grid grid-cols-3 gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Propostas</h3>
          </div>
          <button
            onClick={handleRefresh}
            className="rounded p-1 hover:bg-gray-100"
            title="Atualizar">
            <ArrowClockwise size={18} className="text-gray-600" />
          </button>
        </div>
        <div className="mb-4 text-xs text-gray-500">
          Atualizado em: {formatDate(lastUpdated)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <button
              onClick={() => onFilterChange?.("propostas", propostasVigentes)}
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-green-600">
                {propostasVigentes?.length}
              </div>
              <div className="mt-1 text-xs text-gray-600">Vigentes</div>
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() => onFilterChange?.("propostas", [])}
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-red-600">0</div>
              <div className="mt-1 text-xs text-gray-600">
                Pendentes de emissão
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            <h3 className="font-semibold text-gray-900">Apólices</h3>
          </div>
          <button
            onClick={handleRefresh}
            className="rounded p-1 hover:bg-gray-100"
            title="Atualizar">
            <ArrowClockwise size={18} className="text-gray-600" />
          </button>
        </div>
        <div className="mb-4 text-xs text-gray-500">
          Atualizado em: {formatDate(lastUpdated)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <button
              onClick={() => onFilterChange?.("apolices", apolicesVigentes)}
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-green-600">
                {apolicesVigentes?.length}
              </div>
              <div className="mt-1 text-xs text-gray-600">Vigentes</div>
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() => onFilterChange?.("apolices", [])}
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-red-600">0</div>
              <div className="mt-1 text-xs text-gray-600">
                Pendentes de renovação
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-orange-600" />
            <h3 className="font-semibold text-gray-900">Renovações</h3>
          </div>
          <button
            onClick={handleRefresh}
            className="rounded p-1 hover:bg-gray-100"
            title="Atualizar">
            <ArrowClockwise size={18} className="text-gray-600" />
          </button>
        </div>
        <div className="mb-4 text-xs text-gray-500">
          Atualizado em: {formatDate(lastUpdated)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <button
              onClick={() => onFilterChange?.("renovacoes", [])}
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-orange-600">0</div>
              <div className="mt-1 text-xs text-gray-600">Hoje</div>
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() => onFilterChange?.("renovacoes", [])}
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-orange-600">0</div>
              <div className="mt-1 text-xs text-gray-600">Próximos 30 dias</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
