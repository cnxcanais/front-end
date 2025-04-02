"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalObservationTrigger } from "@/core/components/Modals/ModalObservation"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getAccountId } from "@/core/utils/get-account-id"
import { useFetchBankAccountsQuery } from "@/modules/bank-accounts-components/bank-accounts/infra/hooks/use-fetch-bank-accounts-query"
import { removeBankAccount } from "@/modules/bank-accounts-components/bank-accounts/infra/remote"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { Pencil, Trash } from "@phosphor-icons/react"
import { FileXls } from "@phosphor-icons/react/dist/ssr"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function BankAccountsTable() {
  const account_id = getAccountId()

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const {
    data: bankAccounts,
    isLoading,
    refetch,
  } = useFetchBankAccountsQuery(account_id)

  const bank_accounts_create = permissions?.["bank_accounts_create"]
  const bank_accounts_edit = permissions?.["bank_accounts_edit"]
  const bank_accounts_delete = permissions?.["bank_accounts_delete"]

  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const handleEdit = (id: string) => {
    push(`/banks/accounts/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeBankAccount(id)
      toast.success("Conta de banco removida com sucesso!")
      refetch()
    } catch (error) {
      toast.error(error)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Agência", accessor: "agency" },
    {
      header: "Número",
      accessor: "account_number",
    },
    {
      header: "Banco",
      accessor: "bank",
      render: (value: any, row: unknown) => value.name,
    },
    {
      header: "Número do Banco",
      accessor: "bank",
      render: (value: any, row: unknown) => value.bank_number,
    },
    {
      header: "Atualizado em",
      accessor: "updated_at",
      render: (value: string) =>
        new Date(value).toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "2-digit",
          year: "numeric",
          timeZone: "Europe/Paris",
        }),
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
      accessor: "bank_account_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {bank_accounts_edit && (
            <Pencil
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => handleEdit(value)}
            />
          )}
          {bank_accounts_delete && (
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
  ]

  useEffect(() => {
    if (bankAccounts) setFilteredResults(bankAccounts)
  }, [bankAccounts, isLoading])

  if (!bankAccounts || isLoading || permissionLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Conta de Banco"
        content="Você tem certeza de que deseja remover esta conta de banco?"
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
      <div className="mt-8 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <SearchInput
            data={bankAccounts}
            searchParam="name"
            onSearchResult={(results) => setFilteredResults(results)}
          />
          {bank_accounts_create && (
            <Button
              onClick={() => push("/banks/accounts/create")}
              variant="secondary">
              Cadastrar
            </Button>
          )}
        </div>
        {bankAccounts.length > 0 && (
          <Button
            className="flex items-center gap-1"
            variant="secondary"
            onClick={exportToExcel}>
            <FileXls size={22} />
            Exportar
          </Button>
        )}
      </div>
      {bankAccounts.length === 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma conta de banco cadastrada.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
