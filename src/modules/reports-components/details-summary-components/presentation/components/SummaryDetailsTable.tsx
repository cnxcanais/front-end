"use client"

import { IncomeDetails } from "@/@types/income-details"
import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Table } from "@/core/components/Table"
import { formatLocalDate } from "@/core/utils/dateFunctions"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getAccountId } from "@/core/utils/get-account-id"
import { FileXls } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { getDetailsData } from "../../infra/remote/get-details-data"
import { SummaryDetailsFilters } from "./SummaryDetailsFilters"

export function SummaryDetailsTable() {
  const account_id = getAccountId()

  const currentYear = new Date().getFullYear()
  const [filters, setFilters] = useState({
    start_date: new Date(currentYear, 0, 1),
    end_date: new Date(currentYear, 11, 31),
  })

  const [total, setTotal] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ["summary-details", { filters }],
    queryFn: () => getDetailsData(account_id, { ...filters }),
  })

  const methods = useForm<IncomeDetails.QueryParams>({
    values: {
      start_date: undefined,
      end_date: undefined,
    },
  })

  // HANDLERS
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const columns = [
    {
      header: "Documento",
      accessor: "data",
      render: (data: any) => <p>{data?.document}</p>,
    },
    {
      header: "Descrição",
      accessor: "data",
      render: (data: any) => <p>{data?.description}</p>,
    },
    {
      header: "Cliente",
      accessor: "source",
      render: (source: any) => {
        return source === "TOTAL" ?
            <strong className="font-bold">TOTAL</strong>
          : <p>{source}</p>
      },
    },

    {
      header: "Valor",
      accessor: "amount",
      render: (amount: number) =>
        amount && (
          <p>
            {Number(amount).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        ),
    },
    {
      header: "Parc.",
      accessor: "part",
      render: (part: number) => <p>{part}</p>,
    },
    {
      header: "Vencimento",
      accessor: "due_date",
      render: (due_date: Date) => <p>{formatLocalDate(new Date(due_date))}</p>,
    },
  ]

  useEffect(() => {
    if (data) {
      const totalAmount = data.reduce((acc, item) => acc + item.amount, 0)
      setTotal(totalAmount)
    }
  }, [data])

  if (!data || isLoading) return <LoadingScreen />

  return (
    <>
      <FormProvider {...methods}>
        <SummaryDetailsFilters onFilterChange={handleFilterChange} />

        <div className="mt-8 flex items-center justify-between">
          <Button
            className="flex items-center gap-1"
            variant="secondary"
            onClick={exportToExcel}>
            <FileXls size={22} />
            Exportar
          </Button>
        </div>
        {data.length == 0 ?
          <h2 className="mt-6 text-xl font-semibold">
            Nenhuma parcela cadastrada.
          </h2>
        : <div>
            <Table
              columns={columns}
              data={[
                ...data,
                {
                  source: "TOTAL",
                  amount: data.reduce(
                    (acc, item) => acc + Number(item.amount),
                    0
                  ),
                  part: "",
                  is_paid: "",
                  due_date: "",
                },
              ]}
            />
          </div>
        }
      </FormProvider>
    </>
  )
}
