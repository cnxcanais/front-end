"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Pagination } from "@/core/components/Pagination"
import { SelectInput } from "@/core/components/SelectInput"
import { getCookie } from "@/lib/cookies"
import { CalculoContaContabil } from "@/modules/calculos-conta-contabil-components/types"
import { useContaContabilQuery } from "@/modules/contas-contabeis-components/contas-contabeis/infra/hooks/use-conta-contabil-query"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useMemo, useState } from "react"
import { useCalculosContaContabilQuery } from "../../infra/hooks/use-calculos-conta-contabil-query"

export function CalculosContaContabilTable() {
  const corretoraId = getCookie("corretoraId")
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [ano, setAno] = useState(currentYear)
  const [mes, setMes] = useState(currentMonth)
  const [selectedCorretoraId, setSelectedCorretoraId] = useState(
    corretoraId || ""
  )
  const [contaContabilId, setContaContabilId] = useState("")
  const [situacao, setSituacao] = useState<"PAGO" | "PROVISIONADO" | "">("")
  const [submittedFilters, setSubmittedFilters] =
    useState<CalculoContaContabil.Filters | null>(null)

  const { data: corretoras } = useCorretoraQuery(1, -1)
  const { data: contasContabeis } = useContaContabilQuery(1, 10)

  const filters: CalculoContaContabil.Filters = {
    ano,
    mes,
    ...(selectedCorretoraId && { corretoraId: selectedCorretoraId }),
    ...(contaContabilId && { contaContabilId }),
    ...(situacao && { situacao }),
    limite: limit,
    pagina: page,
  }

  const { data, isLoading, refetch } = useCalculosContaContabilQuery(
    submittedFilters || filters,
    !!submittedFilters
  )

  const corretorasOptions = useMemo(() => {
    if (!corretoras) return []
    return corretoras.data.map((c) => ({
      text: c.razaoSocial,
      value: c.id,
    }))
  }, [corretoras])

  const contasOptions = useMemo(() => {
    if (!contasContabeis) return []
    return contasContabeis.data.map((c) => ({
      text: `${c.codigo} - ${c.descricao}`,
      value: c.id,
    }))
  }, [contasContabeis])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)

  const handleSubmit = () => {
    if (!ano || !mes) {
      return
    }
    setPage(1)
    setSubmittedFilters({ ...filters, pagina: 1 })
    setTimeout(() => refetch(), 0)
  }

  if (isLoading) return <LoadingScreen />

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Filtros</h3>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="mb-4 block text-sm font-medium">Ano *</label>
            <input
              type="number"
              value={ano}
              onChange={(e) => setAno(Number(e.target.value))}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="mb-4 block text-sm font-medium">Mês *</label>
            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              className="w-full rounded border p-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <SelectInput
              label="Corretora"
              field_name="corretoraId"
              options={corretorasOptions}
              value={selectedCorretoraId}
              onChange={(e) => setSelectedCorretoraId(e.target.value)}
            />
          </div>
          <div>
            <SelectInput
              label="Conta Contábil"
              field_name="contaContabilId"
              options={contasOptions}
              value={contaContabilId}
              onChange={(e) => setContaContabilId(e.target.value)}
            />
          </div>
          <div>
            <SelectInput
              label="Situação"
              field_name="situacao"
              options={[
                { text: "Todos", value: "" },
                { text: "Pago", value: "PAGO" },
                { text: "Provisionado", value: "PROVISIONADO" },
              ]}
              value={situacao}
              onChange={(e) => setSituacao(e.target.value as any)}
            />
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Carregando..." : "Buscar"}
          </Button>
        </div>
      </div>

      {data?.contasContabeis.map((conta) => (
        <div
          key={conta.contaContabilId}
          className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">
            {conta.codigo} - {conta.descricao}
          </h3>

          {conta.produtores.map((produtor) => (
            <div key={produtor.produtorId} className="mb-6">
              <h4 className="mb-3 font-medium text-gray-700">
                {produtor.nome}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded border p-4">
                  <h5 className="mb-2 font-medium text-green-600">Pago</h5>
                  <div className="space-y-1 text-sm">
                    <p>
                      Soma Repasses:{" "}
                      {formatCurrency(produtor.pago.somaRepasses)}
                    </p>
                    <p>
                      Valor Conta:{" "}
                      {formatCurrency(produtor.pago.valorContaContabil)}
                    </p>
                    <p>Imposto: {formatCurrency(produtor.pago.valorImposto)}</p>
                    <p>
                      % Repasse:{" "}
                      {produtor.pago.percentualRepasseAplicado || "-"}%
                    </p>
                    <p>
                      % Imposto:{" "}
                      {produtor.pago.percentualImpostoAplicado || "-"}%
                    </p>
                  </div>
                </div>
                <div className="rounded border p-4">
                  <h5 className="mb-2 font-medium text-yellow-600">
                    Provisionado
                  </h5>
                  <div className="space-y-1 text-sm">
                    <p>
                      Soma Repasses:{" "}
                      {formatCurrency(produtor.provisionado.somaRepasses)}
                    </p>
                    <p>
                      Valor Conta:{" "}
                      {formatCurrency(produtor.provisionado.valorContaContabil)}
                    </p>
                    <p>
                      Imposto:{" "}
                      {formatCurrency(produtor.provisionado.valorImposto)}
                    </p>
                    <p>
                      % Repasse:{" "}
                      {produtor.provisionado.percentualRepasseAplicado || "-"}%
                    </p>
                    <p>
                      % Imposto:{" "}
                      {produtor.provisionado.percentualImpostoAplicado || "-"}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 rounded bg-blue-50 p-4">
            <h5 className="mb-2 font-semibold">Total Provisionado</h5>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <p>
                Total Conta:{" "}
                {formatCurrency(conta.totalProvisionado.totalConta)}
              </p>
              <p>
                Imposto Total:{" "}
                {formatCurrency(conta.totalProvisionado.impostoTotal)}
              </p>
              <p className="font-semibold">
                Valor Líquido:{" "}
                {formatCurrency(conta.totalProvisionado.valorLiquido)}
              </p>
            </div>
          </div>
        </div>
      ))}

      {data?.contasContabeis.length === 0 && (
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-500">Nenhum resultado encontrado</p>
        </div>
      )}

      {data && data.contasContabeis.length > 0 && (
        <Pagination
          page={page}
          totalPages={data.totalPaginas}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit)
            setPage(1)
          }}
        />
      )}
    </div>
  )
}
