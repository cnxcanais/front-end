"use client"

import { Proposta } from "@/@types/proposta"
import { getCookie } from "@/lib/cookies"
import {
  ArrowClockwise,
  CheckCircle,
  Clock,
  FileText,
} from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { usePropostaQuery } from "../../infra/hooks/use-proposta-query"

interface DashboardIndicatorsProps {
  onFilterChange?: (filterType: string, data: any[]) => void
  redirectOnClick?: boolean
}

export function DashboardIndicators({
  onFilterChange,
  redirectOnClick = false,
}: DashboardIndicatorsProps) {
  const router = useRouter()
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
    if (redirectOnClick) {
      const ids = filteredPropostas.map((p) => p.id).join(",")
      router.push(`/propostas?filter=${propostaAttribute}&ids=${ids}`)
      return
    }

    const isCurrentlyActive = clickedAttribute[propostaAttribute]

    if (isCurrentlyActive) {
      onFilterChange?.(filterName, allPropostas.data.data)
      setClickedAttribute({ ...clickedAttribute, [propostaAttribute]: false })
    } else {
      onFilterChange?.(filterName, filteredPropostas)
      setClickedAttribute(
        Object.keys(clickedAttribute).reduce(
          (acc, key) => ({ ...acc, [key]: key === propostaAttribute }),
          {} as typeof clickedAttribute
        )
      )
    }
  }

  const handleRefresh = () => {
    setLastUpdated(new Date())
  }

  const isAdmin = getCookie("perfilId") === process.env.NEXT_PUBLIC_ADM_ID
  const corretoraId = getCookie("corretoraId")
  const ativasParams =
    isAdmin ?
      { situacao: "Ativo", tipoDocumento: "Proposta" }
    : { situacao: "Ativo", tipoDocumento: "Proposta", corretoraId }

  const allPropostaParams = isAdmin ? {} : { corretoraId }

  const apolicesAtivasParams =
    isAdmin ?
      { situacao: "Ativo", tipoDocumento: "Apólice" }
    : { situacao: "Ativo", tipoDocumento: "Apólice", corretoraId }

  const allPropostas = usePropostaQuery(1, -1, allPropostaParams)

  const propostasAtivas = usePropostaQuery(1, -1, ativasParams)

  const apolicesAtivas = usePropostaQuery(1, -1, apolicesAtivasParams)

  const propostasVigentes =
    propostasAtivas?.data?.data?.filter((p) => {
      const [anoInicio, mesInicio, diaInicio] = p.inicioVigencia
        .split("-")
        .map(Number)
      const [anoFim, mesFim, diaFim] = p.fimVigencia.split("-").map(Number)
      const inicioVigencia = new Date(anoInicio, mesInicio - 1, diaInicio)
      const fimVigencia = new Date(anoFim, mesFim - 1, diaFim)
      const hoje = new Date()
      return inicioVigencia <= hoje && fimVigencia >= hoje
    }) || []

  const propostasPendentes =
    propostasAtivas.data?.data?.filter(
      (p) => !propostasVigentes.some((v) => v.id === p.id)
    ) || []

  const apolicesVigentes =
    apolicesAtivas?.data?.data?.filter((p) => {
      const [anoInicio, mesInicio, diaInicio] = p.inicioVigencia
        .split("-")
        .map(Number)
      const [anoFim, mesFim, diaFim] = p.fimVigencia.split("-").map(Number)
      const inicioVigencia = new Date(anoInicio, mesInicio - 1, diaInicio)
      const fimVigencia = new Date(anoFim, mesFim - 1, diaFim)
      const hoje = new Date()
      return inicioVigencia <= hoje && fimVigencia >= hoje
    }) || []

  const apolicesPendentes =
    apolicesAtivas.data?.data?.filter(
      (p) => !apolicesVigentes.some((v) => v.id === p.id)
    ) || []

  const renovacoesHoje =
    apolicesAtivas?.data?.data?.filter((p) => {
      const [ano, mes, dia] = p.fimVigencia.split("-").map(Number)
      const hoje = new Date()
      return (
        dia === hoje.getDate() &&
        mes === hoje.getMonth() + 1 &&
        ano === hoje.getFullYear() &&
        !apolicesVigentes.some((v) => v.id === p.id)
      )
    }) || []

  const renovacoesProximos30 =
    apolicesAtivas?.data?.data?.filter((p) => {
      const [ano, mes, dia] = p.fimVigencia.split("-").map(Number)
      const fimVigencia = new Date(ano, mes - 1, dia)
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
              onClick={() =>
                handleAttributeClick(
                  "apolices",
                  apolicesVigentes,
                  "apolicesVigentes"
                )
              }
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-green-600">
                {apolicesVigentes?.length}
              </div>
              <div className="mt-1 text-xs text-gray-600">Vigentes</div>
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() =>
                handleAttributeClick(
                  "apolices",
                  apolicesPendentes,
                  "apolicesPendentes"
                )
              }
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
              onClick={() =>
                handleAttributeClick(
                  "renovacoes",
                  renovacoesHoje,
                  "renovacoesHoje"
                )
              }
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
                handleAttributeClick(
                  "renovacoes",
                  renovacoesProximos30,
                  "renovacoesProximos30"
                )
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
