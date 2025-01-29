"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalObservationTrigger } from "@/core/components/Modals/ModalObservation"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getCookie } from "@/lib/cookies"
import { queryClient } from "@/lib/react-query"
import {
  getBankAccounts,
  removeBankAccount,
} from "@/modules/bank-accounts-components/bank-accounts/infra/remote"
import { Pencil, Trash } from "@phosphor-icons/react"
import { FileXls } from "@phosphor-icons/react/dist/ssr"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function BankAccountsTable() {
  const account_id = getCookie("accountId")

  const { data: bankAccounts, isLoading } = useQuery({
    queryKey: ["bank-accounts"],
    queryFn: () => getBankAccounts(account_id),
  })

  const { accounts_create, accounts_delete, accounts_edit } = JSON.parse(
    getCookie("permissions")
  ).componentAccess

  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const refetchBankAccounts = useMutation({
    mutationFn: getBankAccounts,
    onSuccess: () => {
      toast.success("Conta de banco removida com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover conta de banco: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const handleEdit = (id: string) => {
    push(`/banks/accounts/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    await removeBankAccount(id).then(() =>
      refetchBankAccounts.mutate(account_id)
    )
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
      header: "Obs.",
      accessor: "observation",
      render: (value) => <ModalObservationTrigger content={value} />,
    },
    {
      header: "Ações",
      accessor: "bank_account_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {accounts_edit && (
            <Pencil
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => handleEdit(value)}
            />
          )}
          {accounts_delete && (
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

  if (!bankAccounts || isLoading) return <LoadingScreen />

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
          {accounts_create && (
            <Button
              onClick={() => push("/banks/accounts/create")}
              variant="secondary">
              Cadastrar
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
      {bankAccounts.length === 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma conta de banco cadastrada.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
