"use client"

import { Income } from "@/@types/income"
import { IncomeDetails } from "@/@types/income-details"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalObservationTrigger } from "@/core/components/Modals/ModalObservation"
import { PageSelector } from "@/core/components/PageSelector"
import { Table } from "@/core/components/Table"
import { formatLocalDate } from "@/core/utils/dateFunctions"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getAccountId } from "@/core/utils/get-account-id"
import { IncomeDetailsFilters } from "@/modules/income-components/income-details-components/income-details/presentation/components/incomeDetailsFilters"
import {
  deleteIncomeDetails,
  getIncomeDetails,
} from "@/modules/income-components/income-details-components/remote"
import { payIcomeDetailsPartially } from "@/modules/income-components/income-details-components/remote/pay-details-partially"
import { editIncomeDetails } from "@/modules/income-components/income-details-components/remote/update-income-details"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { FileXls, Money, Pencil, Trash } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

export function IncomeDetailsTable({ income_id }: { income_id?: string }) {
  const { push } = useRouter()

  const account_id = getAccountId()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [page, setPage] = useState(1)
  const [payOpen, setPayOpen] = useState(false)
  const [payInfo, setPayInfo] = useState<{
    id: string
    paid_amount: number
    original_amount: number
  }>(null)
  const [paginatedData, setPaginatedData] = useState<
    IncomeDetails.IncomeDetailsType[] | undefined
  >([])

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const create = permissions?.["income_details_create"]
  const pay = permissions?.["income_details_pay"]
  const edit = permissions?.["income_details_edit"]
  const deletePermission = permissions?.["income_details_delete"]

  const [filters, setFilters] = useState<IncomeDetails.QueryParams>({
    income_id,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["income-details", { filters }],
    queryFn: () => getIncomeDetails(account_id, { ...filters }),
  })

  useEffect(() => {
    if (data) {
      const slicedData = data.incomeDetails.slice((page - 1) * 20, page * 20)
      setPaginatedData(slicedData)
    }
  }, [page, data])

  const methods = useForm<IncomeDetails.QueryParams>({
    values: {
      income_id,
    },
  })

  // HANDLERS
  const handleFilterChange = (newFilters: IncomeDetails.QueryParams) => {
    setFilters(newFilters)
  }

  const handlePay = async () => {
    try {
      if (payInfo.paid_amount == payInfo.original_amount) {
        await editIncomeDetails({
          income_details_id: payInfo.id,
          is_paid: true,
        })
      } else {
        await payIcomeDetailsPartially({
          paid_amount: payInfo.paid_amount,
          income_details_id: payInfo.id,
        })
      }
      refetch()
      toast.success("Parcela paga com sucesso!")
    } catch (error) {
      toast.error("Erro ao executar ação: " + error)
    } finally {
      setPayOpen(false)
    }
  }

  const handleEdit = (id: string) => {
    push(`/income-details/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteIncomeDetails(id)
      toast.success("Parcela removida com sucesso!")
      refetch()
    } catch (error) {
      toast.error("Erro ao remover parcela: " + error)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    {
      header: "Documento",
      accessor: "income",
      render: (income: Income.IncomeType) => <p>{income.document}</p>,
    },
    {
      header: "Cliente",
      accessor: "income",
      render: (income: Income.IncomeType) => <p>{income.income_source.name}</p>,
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
      header: "Pgto",
      accessor: "is_paid",
      render: (is_paid: boolean) => {
        if (is_paid === null) return ""
        else return <p>{is_paid ? "Pago" : "Em Aberto"}</p>
      },
    },
    {
      header: "Vencimento",
      accessor: "due_date",
      render: (due_date: Date) => <p>{formatLocalDate(new Date(due_date))}</p>,
    },
    {
      header: "Obs.",
      accessor: "observation",
      render: (value: string) => {
        if (value) return <ModalObservationTrigger content={value} />
      },
    },
    {
      header: "Ações",
      accessor: "income_details_id",
      render: (value: string, row: unknown) => {
        if (value === "total") return ""
        return (
          <div className="flex space-x-4">
            {edit && (
              <Pencil
                className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
                size={24}
                onClick={() => handleEdit(value)}
              />
            )}

            {deletePermission && (
              <Trash
                className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
                size={24}
                onClick={() => {
                  setId(value)
                  setOpen(true)
                }}
              />
            )}
          </div>
        )
      },
    },
    {
      header: "Quitar",
      accessor: "income_details_id",
      render: (value: string, row: unknown) => {
        if (value === "total") return ""

        return (
          <div className="flex space-x-4">
            {pay && (
              <Money
                className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
                size={24}
                onClick={() => {
                  setPayInfo({
                    id: value,
                    paid_amount: row["amount"],
                    original_amount: row["amount"],
                  })
                  setPayOpen(true)
                }}
              />
            )}
          </div>
        )
      },
    },
  ]

  const tableData = useMemo(() => {
    if (!data || !data.incomeDetails || !paginatedData) return []

    const totalAmount = data.incomeDetails.reduce(
      (acc, item) => acc + Number(item.amount || 0),
      0
    )

    const totalRow = {
      income_details_id: "total",
      income: { document: "TOTAL", income_source: { name: "" } },
      amount: totalAmount,
      part: "",
      is_paid: null,
      due_date: "",
      observation: "",
    }

    return [...paginatedData, totalRow]
  }, [data, paginatedData])

  const exportTableData = useMemo(() => {
    if (!data || !data.incomeDetails) return []

    const totalAmount = data.incomeDetails.reduce(
      (acc, item) => acc + Number(item.amount || 0),
      0
    )

    const totalRow = {
      income_details_id: "total",
      income: { document: "TOTAL", income_source: { name: "" } },
      amount: totalAmount,
      part: "",
      is_paid: null,
      due_date: "",
      observation: "",
    }

    return [...data.incomeDetails, totalRow]
  }, [data])

  if (!data || isLoading || permissionLoading || !permissions)
    return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Parcela"
        content="Você tem certeza de que deseja remover esta parcela?"
        onClose={() => setOpen(false)}
        open={open}>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={handleConfirmDelete} variant="secondary">
            Confirmar
          </Button>
          <Button onClick={() => setOpen(false)} variant="tertiary">
            Cancelar
          </Button>
        </div>
      </Modal>

      <Modal
        title="Quitar Parcela"
        content="Você tem certeza de que deseja quitar esta parcela?"
        onClose={() => setOpen(false)}
        open={payOpen}>
        <div className="mb-4 flex items-center justify-center gap-1">
          <p className="text-sm text-blue-300">Valor pago:</p>
          <Input.Root className="max-w-40 text-sm">
            <Input.Currency
              type="text"
              value={payInfo?.paid_amount}
              onChange={(value: number) => {
                setPayInfo({ ...payInfo, paid_amount: value })
              }}
            />
          </Input.Root>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={() => handlePay()} variant="secondary">
            Confirmar
          </Button>
          <Button onClick={() => setPayOpen(false)} variant="tertiary">
            Cancelar
          </Button>
        </div>
      </Modal>

      <FormProvider {...methods}>
        <IncomeDetailsFilters onFilterChange={handleFilterChange} />

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-4">
            <Button onClick={() => push("/incomes")} variant="secondary">
              Voltar
            </Button>

            {income_id && (
              <Button
                variant="secondary"
                onClick={() => push(`/income-details/create/${income_id}`)}
                disabled={!create}>
                Adicionar Parcela
              </Button>
            )}
          </div>

          <Button
            className="flex items-center gap-1"
            variant="secondary"
            onClick={() => exportToExcel(exportTableData, columns)}>
            <FileXls size={22} />
            Exportar
          </Button>
        </div>
        {data.incomeDetails.length == 0 ?
          <h2 className="mt-6 text-xl font-semibold">
            Nenhuma parcela cadastrada.
          </h2>
        : <div>
            <Table columns={columns} data={tableData} />
            <PageSelector
              page={page}
              setPage={setPage}
              totalPages={data.totalPages}
            />
          </div>
        }
      </FormProvider>
    </>
  )
}
