"use client"

import { Segurado } from "@/@types/segurado"
import {
  ArrowClockwise,
  Cake,
  IdentificationCard,
  User,
  Users,
} from "@phosphor-icons/react"
import { useState } from "react"
import { useSeguradoQuery } from "../../infra/hooks/use-segurado-query"

interface SeguradosDashboardProps {
  onFilterChange?: (filterType: string, data: Segurado.Type[]) => void
}

export function SeguradosDashboard({
  onFilterChange,
}: SeguradosDashboardProps) {
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [clickedAttribute, setClickedAttribute] = useState({
    pessoaFisica: false,
    pessoaJuridica: false,
    seguradosVigentes: false,
    seguradosInativos: false,
    aniversariantesHoje: false,
    aniversariantesProximos15: false,
    aniversariantesProximos30: false,
    cnhHoje: false,
    cnhProximos30: false,
  })

  const handleAttributeClick = (
    filterName: string,
    filteredSegurados: Segurado.Type[],
    attribute: string
  ) => {
    const isCurrentlyActive = clickedAttribute[attribute]

    if (isCurrentlyActive) {
      onFilterChange?.(filterName, allSegurados.data?.data || [])
      setClickedAttribute({ ...clickedAttribute, [attribute]: false })
    } else {
      onFilterChange?.(filterName, filteredSegurados)
      setClickedAttribute(
        Object.keys(clickedAttribute).reduce(
          (acc, key) => ({ ...acc, [key]: key === attribute }),
          {} as typeof clickedAttribute
        )
      )
    }
  }

  const handleRefresh = () => {
    setLastUpdated(new Date())
  }

  const allSegurados = useSeguradoQuery(1, 100)

  const segurados = allSegurados.data?.data || []

  const pessoaFisica = segurados.filter((s) => s.tipoPessoa === "FISICA")
  const pessoaJuridica = segurados.filter((s) => s.tipoPessoa === "JURIDICA")

  const seguradosVigentes = segurados.filter((s) => s.status === "ATIVO")
  const seguradosInativos = segurados.filter((s) => s.status === "INATIVO")

  const hoje = new Date()
  const aniversariantesHoje = segurados.filter((s) => {
    if (!s.dataNascimento) return false
    const [ano, mes, dia] = s.dataNascimento.split('-').map(Number)
    return dia === hoje.getDate() && mes === hoje.getMonth() + 1
  })

  const aniversariantesProximos15 = segurados.filter((s) => {
    if (!s.dataNascimento) return false
    const [ano, mes, dia] = s.dataNascimento.split('-').map(Number)
    const dias15 = new Date(hoje.getTime() + 15 * 24 * 60 * 60 * 1000)
    const aniversarioEsteAno = new Date(hoje.getFullYear(), mes - 1, dia)
    return aniversarioEsteAno > hoje && aniversarioEsteAno <= dias15
  })

  const aniversariantesProximos30 = segurados.filter((s) => {
    if (!s.dataNascimento) return false
    const [ano, mes, dia] = s.dataNascimento.split('-').map(Number)
    const dias30 = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)
    const aniversarioEsteAno = new Date(hoje.getFullYear(), mes - 1, dia)
    return aniversarioEsteAno > hoje && aniversarioEsteAno <= dias30
  })

  const cnhHoje = segurados.filter((s) => {
    if (!s.vencimentoCnh) return false
    const [ano, mes, dia] = s.vencimentoCnh.split('-').map(Number)
    return dia === hoje.getDate() && mes === hoje.getMonth() + 1 && ano === hoje.getFullYear()
  })

  const cnhProximos30 = segurados.filter((s) => {
    if (!s.vencimentoCnh) return false
    const [ano, mes, dia] = s.vencimentoCnh.split('-').map(Number)
    const vencimento = new Date(ano, mes - 1, dia)
    const dias30 = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)
    return vencimento > hoje && vencimento <= dias30
  })

  const totalSegurados = segurados.length
  const percentualFisica =
    totalSegurados > 0 ?
      ((pessoaFisica.length / totalSegurados) * 100).toFixed(1)
    : "0"
  const percentualJuridica =
    totalSegurados > 0 ?
      ((pessoaJuridica.length / totalSegurados) * 100).toFixed(1)
    : "0"
  const percentualVigentes =
    totalSegurados > 0 ?
      ((seguradosVigentes.length / totalSegurados) * 100).toFixed(1)
    : "0"

  const formatDate = (date: Date) => {
    return (
      date.toLocaleDateString("pt-BR") +
      " " +
      date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    )
  }

  return (
    <div className="mb-8 grid grid-cols-3 gap-4">
      {/* Painel 1 - Segurados */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Segurados</h3>
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
                handleAttributeClick("segurados", pessoaFisica, "pessoaFisica")
              }
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-blue-600">
                {pessoaFisica.length}
              </div>
              <div className="mt-1 text-xs text-gray-600">Pessoa Física</div>
              <div className="text-xs text-gray-500">{percentualFisica}%</div>
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() =>
                handleAttributeClick(
                  "segurados",
                  pessoaJuridica,
                  "pessoaJuridica"
                )
              }
              className="transition hover:opacity-80">
              <div className="text-3xl font-bold text-purple-600">
                {pessoaJuridica.length}
              </div>
              <div className="mt-1 text-xs text-gray-600">Pessoa Jurídica</div>
              <div className="text-xs text-gray-500">{percentualJuridica}%</div>
            </button>
          </div>
        </div>
      </div>

      {/* Painel 2 - Performance */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={20} className="text-green-600" />
            <h3 className="font-semibold text-gray-900">Performance</h3>
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
        <div className="mb-4 flex justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">
              {percentualVigentes}%
            </div>
            <div className="text-xs text-gray-500">Vigentes</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <button
              onClick={() =>
                handleAttributeClick(
                  "segurados",
                  seguradosVigentes,
                  "seguradosVigentes"
                )
              }
              className="transition hover:opacity-80">
              <div className="text-2xl font-bold text-green-600">
                {seguradosVigentes.length}
              </div>
              <div className="mt-1 text-xs text-gray-600">Vigentes</div>
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() =>
                handleAttributeClick(
                  "segurados",
                  seguradosInativos,
                  "seguradosInativos"
                )
              }
              className="transition hover:opacity-80">
              <div className="text-2xl font-bold text-red-600">
                {seguradosInativos.length}
              </div>
              <div className="mt-1 text-xs text-gray-600">Inativos</div>
            </button>
          </div>
        </div>
      </div>

      {/* Painel 3 - Datas e Avisos */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cake size={20} className="text-orange-600" />
            <h3 className="font-semibold text-gray-900">Datas e Avisos</h3>
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
        <div className="space-y-3">
          <div>
            <div className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-700">
              <Cake size={14} />
              Aniversariantes
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() =>
                  handleAttributeClick(
                    "segurados",
                    aniversariantesHoje,
                    "aniversariantesHoje"
                  )
                }
                className="text-center transition hover:opacity-80">
                <div className="text-xl font-bold text-orange-600">
                  {aniversariantesHoje.length}
                </div>
                <div className="text-xs text-gray-600">Hoje</div>
              </button>
              <button
                onClick={() =>
                  handleAttributeClick(
                    "segurados",
                    aniversariantesProximos15,
                    "aniversariantesProximos15"
                  )
                }
                className="text-center transition hover:opacity-80">
                <div className="text-xl font-bold text-orange-600">
                  {aniversariantesProximos15.length}
                </div>
                <div className="text-xs text-gray-600">15 dias</div>
              </button>
              <button
                onClick={() =>
                  handleAttributeClick(
                    "segurados",
                    aniversariantesProximos30,
                    "aniversariantesProximos30"
                  )
                }
                className="text-center transition hover:opacity-80">
                <div className="text-xl font-bold text-orange-600">
                  {aniversariantesProximos30.length}
                </div>
                <div className="text-xs text-gray-600">30 dias</div>
              </button>
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-700">
              <IdentificationCard size={14} />
              Vencimento CNH
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  handleAttributeClick("segurados", cnhHoje, "cnhHoje")
                }
                className="text-center transition hover:opacity-80">
                <div className="text-xl font-bold text-red-600">
                  {cnhHoje.length}
                </div>
                <div className="text-xs text-gray-600">Hoje</div>
              </button>
              <button
                onClick={() =>
                  handleAttributeClick(
                    "segurados",
                    cnhProximos30,
                    "cnhProximos30"
                  )
                }
                className="text-center transition hover:opacity-80">
                <div className="text-xl font-bold text-yellow-600">
                  {cnhProximos30.length}
                </div>
                <div className="text-xs text-gray-600">No mês</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
