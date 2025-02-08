"use client"

import { Income } from "@/@types/income"
import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalObservationTrigger } from "@/core/components/Modals/ModalObservation"
import { PageSelector } from "@/core/components/PageSelector"
import { Table } from "@/core/components/Table"
import { formatLocalDate } from "@/core/utils/dateFunctions"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getAccountId } from "@/core/utils/get-account-id"
import { queryClient } from "@/lib/react-query"
import { IncomeDetailsFilters } from "@/modules/income-components/income-details-components/income-details/presentation/components/incomeDetailsFilters"
import {
  deleteIncomeDetails,
  getIncomeDetails,
} from "@/modules/income-components/income-details-components/remote"
import { editIncomeDetails } from "@/modules/income-components/income-details-components/remote/update-income-details"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { FileXls, Money, Pencil, Trash } from "@phosphor-icons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function IncomeDetailsTable() {
  const { push } = useRouter()

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const create = permissions?.componentAccess["income_details_create"]
  const pay = permissions?.componentAccess["income_details_pay"]
  const edit = permissions?.componentAccess["income_details_edit"]
  const deletePermission = permissions?.componentAccess["income_details_delete"]

  const searchParams = useSearchParams()
  const income_id = searchParams.get("income_id") ?? undefined

  const account_id = getAccountId()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [page, setPage] = useState(1)
  const [payOpen, setPayOpen] = useState(false)
  const [payId, setPayId] = useState("")

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["income-details", income_id],
    queryFn: () =>
      income_id ?
        getIncomeDetails(account_id, { page, income_id })
      : getIncomeDetails(account_id, { page }),
  })

  const fetchIncomeDetails = useMutation({
    mutationFn: getIncomeDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-details"] })
    },
    onError: (error) => {
      toast.error("Erro ao executar ação: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const handlePay = async (income_details_id: string) => {
    await editIncomeDetails({ income_details_id, is_paid: true })
      .then(() => fetchIncomeDetails.mutate(account_id))
      .then(() => setPayOpen(false))
      .then(() => toast.success("Parcela paga com sucesso!"))
  }

  const handleEdit = (id: string) => {
    push(`/income-details/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    await deleteIncomeDetails({ income_details_id: id })
      .then(() => fetchIncomeDetails.mutate(account_id))
      .then(() => toast.success("Parcela removida com sucesso!"))
  }

  useEffect(() => {
    if (page) refetch()
  }, [page])

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
      render: (amount: string) => (
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
      render: (is_paid: boolean) => <p>{is_paid ? "Pago" : "Em Aberto"}</p>,
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
      render: (value: string, row: unknown) => (
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
      ),
    },
    {
      header: "Quitar",
      accessor: "income_details_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {pay && (
            <Money
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => {
                setPayId(value)
                setPayOpen(true)
              }}
            />
          )}
        </div>
      ),
    },
  ]

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
        <div className="flex items-center justify-center gap-4">
          <Button onClick={() => handlePay(payId)} variant="secondary">
            Confirmar
          </Button>
          <Button onClick={() => setPayOpen(false)} variant="tertiary">
            Cancelar
          </Button>
        </div>
      </Modal>

      <IncomeDetailsFilters account_id={account_id} income_id={income_id} />

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
          onClick={exportToExcel}>
          <FileXls size={22} />
          Exportar
        </Button>
      </div>
      {data.incomeDetails.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma parcela cadastrada.
        </h2>
      : <div>
          <Table columns={columns} data={data.incomeDetails} />
          <PageSelector
            page={page}
            setPage={setPage}
            totalPages={data.totalPages}
          />
        </div>
      }
    </>
  )
}
