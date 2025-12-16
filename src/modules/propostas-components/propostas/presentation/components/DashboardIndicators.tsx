"use client"

import { Proposta } from "@/modules/propostas-components/types/proposta"
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
  const [clickedAttribute, setClickedAttribute] = useState({
    propostasVigentes: false,
    propostasPendentes: false,
    apolicesVigentes: false,
    apolicesPendentes: false,
    renovacoesHoje: false,
    renovacoesProximos30: false,
    renovacoesVencidas: false,
  })

  const handleAttributeClick = (
    filterName: string,
    filteredPropostas: Proposta[],
    propostaAttribute: string
  ) => {
    if (clickedAttribute[propostaAttribute]) {
      onFilterChange?.(filterName, allPropostas.data.data)
    } else {
      onFilterChange?.(filterName, filteredPropostas)
    }
    const attributeArray = Object.entries(clickedAttribute)
    const updatedClickedState = clickedAttribute
    for (const obj of attributeArray) {
      console.log(`obj[0]: ${obj[0]} propostaAttribute: ${propostaAttribute}`)
      if (obj[0] === propostaAttribute) {
        console.log("entered truthy block")
        console.log(
          "I'll update this state " + JSON.stringify(updatedClickedState)
        )
        updatedClickedState[propostaAttribute] =
          !clickedAttribute[propostaAttribute]

        console.log("updated state: " + JSON.stringify(updatedClickedState))
      } else {
        updatedClickedState[propostaAttribute] = false
      }
    }

    setClickedAttribute(updatedClickedState)
  }

  const handleRefresh = () => {
    setLastUpdated(new Date())
  }

  const allPropostas = usePropostaQuery(1, 100)

  const propostasAtivas = usePropostaQuery(1, 100, {
    situacao: "Ativo",
    tipoDocumento: "Proposta",
  })

  const propostasVigentes =
    propostasAtivas?.data?.data?.filter(
      (p) =>
        new Date(p.inicioVigencia) <= new Date() &&
        new Date(p.fimVigencia) >= new Date()
    ) || []

  const propostasPendentes =
    propostasAtivas.data?.data?.filter(
      (p) => !propostasVigentes.some((v) => v.id === p.id)
    ) || []

  const apolicesAtivas = usePropostaQuery(1, 100, {
    situacao: "Ativo",
    tipoDocumento: "Apólice",
  })

  const apolicesVigentes =
    apolicesAtivas?.data?.data?.filter(
      (p) =>
        new Date(p.inicioVigencia) <= new Date() &&
        new Date(p.fimVigencia) >= new Date()
    ) || []

  const apolicesPendentes =
    apolicesAtivas.data?.data?.filter(
      (p) => !apolicesVigentes.some((v) => v.id === p.id)
    ) || []

  const renovacoesHoje =
    apolicesAtivas?.data?.data?.filter((p) => {
      const fimVigencia = new Date(p.fimVigencia)
      const hoje = new Date()
      return (
        fimVigencia.toDateString() === hoje.toDateString() &&
        !apolicesVigentes.some((v) => v.id === p.id)
      )
    }) || []

  const renovacoesProximos30 =
    apolicesAtivas?.data?.data?.filter((p) => {
      const fimVigencia = new Date(p.fimVigencia)
      const hoje = new Date()
      const dias30 = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)
      return (
        fimVigencia > hoje &&
        fimVigencia <= dias30 &&
        !apolicesVigentes.some((v) => v.id === p.id)
      )
    }) || []

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
              onClick={() =>
                handleAttributeClick(
                  "propostas",
                  propostasVigentes,
                  "propostasVigentes"
                )
              }
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-green-600">
                {propostasVigentes?.length}
              </div>
              <div className="mt-1 text-xs text-gray-600">Vigentes</div>
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() =>
                handleAttributeClick(
                  "propostas",
                  propostasPendentes,
                  "propostasPendentes"
                )
              }
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-red-600">
                {propostasPendentes?.length}
              </div>
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
              onClick={() => onFilterChange?.("apolices", apolicesPendentes)}
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-red-600">
                {apolicesPendentes?.length}
              </div>
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
              onClick={() => onFilterChange?.("renovacoes", renovacoesHoje)}
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-orange-600">
                {renovacoesHoje?.length}
              </div>
              <div className="mt-1 text-xs text-gray-600">Hoje</div>
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() =>
                onFilterChange?.("renovacoes", renovacoesProximos30)
              }
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-orange-600">
                {renovacoesProximos30?.length}
              </div>
              <div className="mt-1 text-xs text-gray-600">Próximos 30 dias</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
