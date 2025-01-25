"use client"

import { Button } from "@/core/components/Button"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { SearchInput } from "@/core/components/SearchInput"
import { Table } from "@/core/components/Table"
import { exportToExcel } from "@/core/utils/exportToExcel"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { getCookie } from "@/lib/cookies"
import { queryClient } from "@/lib/react-query"
import {
  getOrganizations,
  removeOrganization,
} from "@/modules/organization-components/organizations/infra/remote"
import { FileXls, Pencil, Trash } from "@phosphor-icons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function OrganizationsTable() {
  const accountId = getCookie("accountId")

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => getOrganizations({ account_id: accountId }),
    enabled: !!accountId,
  })

  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])

  const refetchOrganizationsFn = useMutation({
    mutationFn: getOrganizations,
    onSuccess: () => {
      toast.success("Organização removida com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["organizations"] })
    },
    onError: (error) => {
      toast.error("Erro ao remover organização: " + error)
    },
    onSettled: () => {
      setOpen(false)
    },
  })

  const organizations_create = getPermissionByEntity("organizations_create")
  const organizations_edit = getPermissionByEntity("organizations_edit")
  const organizations_delete = getPermissionByEntity("organizations_delete")

  const handleEdit = (id: string) => {
    push(`/organizations/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    await removeOrganization({ organization_id: id }).then(() =>
      refetchOrganizationsFn.mutate({ account_id: accountId })
    )
  }

  const columns = [
    { header: "Nome", accessor: "name" },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Telefone",
      accessor: "phone",
    },
    {
      header: "Endereço",
      accessor: "address",
    },
    {
      header: "CNPJ",
      accessor: "cnpj",
    },
    {
      header: "Ações",
      accessor: "organization_id",
      render: (value: string, row: unknown) => (
        <div className="flex space-x-4">
          {organizations_edit && (
            <Pencil
              className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
              size={24}
              onClick={() => handleEdit(value)}
            />
          )}
          {organizations_delete && (
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
    if (organizations) setFilteredResults(organizations)
  }, [organizations, isLoading])

  if (!organizations || isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Organização"
        content="Você tem certeza de que deseja remover esta organização?"
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
            data={organizations}
            searchParam="name"
            onSearchResult={(results) => setFilteredResults(results)}
          />
          {organizations_create && (
            <Button
              onClick={() => push("/organizations/create")}
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
      {organizations.length === 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma organização cadastrada.
        </h2>
      : <Table columns={columns} data={filteredResults} />}
    </>
  )
}
