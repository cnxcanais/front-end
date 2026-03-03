"use client"

import { Button } from "@/core/components/Button"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Pagination } from "@/core/components/Pagination"
import { getCookie } from "@/lib/cookies"
import { CalculoContaContabil } from "@/modules/calculos-conta-contabil-components/types"
import { useContaContabilQuery } from "@/modules/contas-contabeis-components/contas-contabeis/infra/hooks/use-conta-contabil-query"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useCalculosContaContabilQuery } from "../../infra/hooks/use-calculos-conta-contabil-query"
import { CalcularModal } from "./CalcularModal"

export function CalculosContaContabilTable() {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({
    ano: currentYear.toString(),
    mes: currentMonth.toString(),
  })
  const [submittedFilters, setSubmittedFilters] =
    useState<CalculoContaContabil.Filters | null>(null)
  const [showCalcularModal, setShowCalcularModal] = useState(false)

  const { data: corretoras } = useCorretoraQuery(1, -1)
  const { data: contasContabeis } = useContaContabilQuery(1, -1)
  const isAdmin = getCookie("perfilId") === process.env.NEXT_PUBLIC_ADM_ID

  const corretorasOptions = useMemo(() => {
    if (!corretoras) return []
    return corretoras.data.map((c) => ({
      label: c.razaoSocial,
      value: c.id,
    }))
  }, [corretoras])

  const contasOptions = useMemo(() => {
    if (!contasContabeis) return []
    return contasContabeis.data.map((c) => ({
      label: `${c.codigo} - ${c.descricao}`,
      value: c.id,
    }))
  }, [contasContabeis])

  const filterFields: FilterField[] = [
    {
      name: "ano",
      label: "Ano *",
      type: "text",
      placeholder: "Ano",
    },
    {
      name: "mes",
      label: "Mês *",
      type: "select",
      options: Array.from({ length: 12 }, (_, i) => ({
        label: (i + 1).toString(),
        value: (i + 1).toString(),
      })),
    },
    {
      name: "corretoraId",
      label: "Corretora",
      type: "select",
      options: corretorasOptions,
    },
    {
      name: "contaContabilId",
      label: "Conta Contábil",
      type: "select",
      options: contasOptions,
    },
    {
      name: "situacao",
      label: "Situação",
      type: "select",
      options: [
        { label: "Todos", value: "" },
        { label: "Pago", value: "PAGO" },
        { label: "Provisionado", value: "PROVISIONADO" },
      ],
    },
  ]

  const apiFilters: CalculoContaContabil.Filters = {
    ano: Number(filters.ano) || currentYear,
    mes: Number(filters.mes) || currentMonth,
    ...(filters.corretoraId && { corretoraId: filters.corretoraId }),
    ...(filters.contaContabilId && {
      contaContabilId: filters.contaContabilId,
    }),
    ...(filters.situacao && {
      situacao: filters.situacao as "PAGO" | "PROVISIONADO",
    }),
    limite: limit,
    pagina: page,
  }

  const { data, isLoading, refetch } = useCalculosContaContabilQuery(
    submittedFilters || apiFilters,
    !!submittedFilters
  )

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)

  const handleFilter = (newFilters: Record<string, string>) => {
    if (!newFilters.ano || !newFilters.mes) {
      toast.warning("Ano e mês são obrigatórios na busca")
      return
    }
    setFilters(newFilters)
    setPage(1)
    const apiFilters: CalculoContaContabil.Filters = {
      ano: Number(newFilters.ano),
      mes: Number(newFilters.mes),
      ...(newFilters.corretoraId && { corretoraId: newFilters.corretoraId }),
      ...(newFilters.contaContabilId && {
        contaContabilId: newFilters.contaContabilId,
      }),
      ...(newFilters.situacao && {
        situacao: newFilters.situacao as "PAGO" | "PROVISIONADO",
      }),
      limite: limit,
      pagina: 1,
    }
    setSubmittedFilters(apiFilters)
    setTimeout(() => refetch(), 0)
  }

  if (isLoading) return <LoadingScreen />

  return (
    <div className="space-y-6">
      <FilterForm
        fields={filterFields}
        onFilter={handleFilter}
        appliedFilters={filters}
      />

      {isAdmin && (
        <div className="flex justify-end">
          <Button
            onClick={() => setShowCalcularModal(true)}
            variant="secondary">
            Calcular
          </Button>
        </div>
      )}

      <CalcularModal
        open={showCalcularModal}
        onClose={() => setShowCalcularModal(false)}
        onSuccess={() => handleFilter(filters)}
      />

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
