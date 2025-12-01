"use client"

import { Button } from "@/core/components/Button"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalFilesTrigger } from "@/core/components/Modals/ModalFiles/ModalFilesTrigger"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { formatStaticDocument } from "@/core/utils/formatDocumentNumber"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { useSeguradoQuery } from "@/modules/segurados-components/segurado/infra/hooks/use-segurado-query"
import {
  exportSegurados,
  removeSegurado,
} from "@/modules/segurados-components/segurado/infra/remote"
import { FileCsv, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { ImportSeguradosModal } from "./ImportSeguradosModal"

export function SeguradosTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = useSeguradoQuery(page, limit, filters)
  const { data: corretoras, isLoading: isLoadingCorretoras } =
    useCorretoraQuery()
  const { data: produtores, isLoading: isLoadingProdutores } =
    useProdutorQuery()
  const { push } = useRouter()
  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [openImportModal, setOpenImportModal] = useState(false)

  const [filteredResults, setFilteredResults] = useState([])

  const corretorasOptions = useMemo(() => {
    if (isLoadingCorretoras || !corretoras) return []
    return corretoras.data.map((corretora) => ({
      label: corretora.razaoSocial,
      value: corretora.id,
    }))
  }, [corretoras, isLoadingCorretoras])

  const segurados = data?.data || []
  const totalPages = data?.totalPages || 1

  const handleEdit = (id: string) => {
    push(`/segurados/edit/${id}`)
  }

  const handleDownloadCsv = () => {
    exportSegurados(filters)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute(
          "download",
          `segurados-${new Date().toLocaleDateString("pt-br")}.csv`
        )
        document.body.appendChild(link)
        link.click()
      })
      .catch((error) => {
        console.error("Erro ao exportar segurados:", error)
      })
  }

  const handleConfirmDelete = async () => {
    try {
      await removeSegurado(id)
      toast.success("Segurado removido com sucesso!")
      refetch()
    } catch (error) {
      const err: any = error
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao remover segurado"
      toast.error(message)
    } finally {
      setOpen(false)
    }
  }

  const columns = [
    { header: "Nome/Razão Social", accessor: "nomeRazaoSocial" },
    {
      header: "CPF/CNPJ",
      accessor: "cnpjCpf",
      render: (value: string) => {
        return formatStaticDocument(value)
      },
    },
    { header: "Tipo", accessor: "tipoPessoa" },
    { header: "Status", accessor: "status" },
    {
      header: "Corretora",
      accessor: "corretoraId",
      render: (value: string) => {
        const corretora = corretoras?.data?.find((c) => c.id === value)
        return corretora?.razaoSocial || value
      },
    },
    {
      header: "Produtor",
      accessor: "produtorId",
      render: (value: string) => {
        const produtor = produtores?.data?.find((p) => p.id === value)
        return produtor?.nome || value
      },
    },
    { header: "Cidade", accessor: "cidade" },
    { header: "UF", accessor: "uf" },
    {
      header: "Arquivos",
      accessor: "id",
      render: (value: string) => (
        <ModalFilesTrigger entityId={value} entityType={"segurado"} />
      ),
    },
    {
      header: "Ações",
      accessor: "id",
      render: (value: string) => (
        <div className="flex space-x-4">
          <Pencil
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
            size={24}
            onClick={() => handleEdit(value)}
          />
          <Trash
            className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
            size={24}
            onClick={() => {
              setId(value)
              setOpen(true)
            }}
          />
        </div>
      ),
    },
  ]

  const filterFields: FilterField[] = [
    {
      name: "nomeRazaoSocial",
      label: "Nome/Razão Social",
      placeholder: "Buscar por Nome",
    },
    {
      name: "cnpjCpf",
      label: "CPF/CNPJ",
      placeholder: "Buscar por CPF ou CNPJ",
    },
    {
      name: "corretoraId",
      label: "Corretora",
      placeholder: "Buscar por Corretora",
      type: "select",
      options: corretorasOptions,
    },
    {
      name: "tipoPessoa",
      label: "Tipo Pessoa",
      placeholder: "Buscar por Tipo de Pessoa",
      type: "select",
      options: [
        { label: "Pessoa Física", value: "FISICA" },
        { label: "Pessoa Jurídica", value: "JURIDICA" },
      ],
    },
    {
      name: "status",
      label: "Status",
      placeholder: "Buscar por Status",
      type: "select",
      options: [
        { label: "Ativo", value: "ATIVO" },
        { label: "Inativo", value: "INATIVO" },
      ],
    },
  ]

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  useEffect(() => {
    if (segurados.length > 0) setFilteredResults(segurados)
  }, [segurados])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Segurado"
        content="Você tem certeza de que deseja remover este segurado?"
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

      <FilterForm
        fields={filterFields}
        onFilter={handleFilter}
        appliedFilters={filters}
      />

      <div className="mt-8 flex items-center justify-between">
        <div className="flex h-full gap-4">
          <Button onClick={() => push("/segurados/create")} variant="secondary">
            Cadastrar
          </Button>
        </div>
        {segurados.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={() => setOpenImportModal(true)}>
              <FileCsv size={22} />
              Importar Segurados
            </Button>
            <Button
              className="flex items-center gap-1"
              variant="secondary"
              onClick={() => handleDownloadCsv()}>
              <FileCsv size={22} />
              Exportar Segurados
            </Button>
          </div>
        )}
      </div>

      {segurados.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum segurado cadastrado.
        </h2>
      : <>
          <Table columns={columns} data={filteredResults} />
          <Pagination
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1)
            }}
          />
          <ImportSeguradosModal
            open={openImportModal}
            onClose={() => setOpenImportModal(false)}
            onSuccess={refetch}
          />
        </>
      }
    </>
  )
}
