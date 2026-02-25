"use client"

import { Button } from "@/core/components/Button"
import { ExportTableToPDFButton } from "@/core/components/ExportPDFButton"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { exportNoPagination } from "@/core/utils/exportToExcel/exportNoPagination"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { usePerfilQuery } from "@/modules/perfis-components/perfis/infra/hooks/use-perfil-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { FileXls, LockKey, Pencil, Trash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useUsuarioQuery } from "../../infra/hooks/use-usuario-query"
import { blockUsuario, removeUsuario, unblockUsuario } from "../../infra/remote"

export function UsuariosTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data, isLoading, refetch } = useUsuarioQuery(page, limit, filters)
  const { data: corretoras } = useCorretoraQuery(1, -1)
  const { data: perfis } = usePerfilQuery()
  const { data: produtores } = useProdutorQuery(
    1,
    -1,
    filters.corretoraId ? { corretoraId: filters.corretoraId } : undefined
  )
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [openBlockModal, setOpenBlockModal] = useState(false)
  const [id, setId] = useState("")
  const [userStatus, setUserStatus] = useState("")

  const usuarios = data?.data?.map((item) => item.props) || []
  const totalPages = data?.totalPages || 1

  const corretorasOptions = useMemo(() => {
    if (!corretoras?.data) return []
    return corretoras.data.map((c) => ({
      label: c.razaoSocial,
      value: c.id,
    }))
  }, [corretoras])

  const perfisOptions = useMemo(() => {
    if (!perfis) return []
    return perfis?.data.map((p) => ({
      label: p.nome,
      value: p.id,
    }))
  }, [perfis])

  const produtoresOptions = useMemo(() => {
    if (!produtores?.data) return []
    return produtores?.data.map((p) => ({
      label: p.nome,
      value: p.id,
    }))
  }, [produtores])

  const handleEdit = (id: string) => {
    push(`/usuarios/edit/${id}`)
  }

  const handleConfirmDelete = async () => {
    try {
      await removeUsuario(id)
      toast.success("Usuário removido com sucesso!")
      refetch()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      const message =
        error?.response?.data?.message || "Erro ao remover usuário"
      toast.error(message)
    } finally {
      setOpen(false)
    }
  }

  const handleConfirmBlock = async () => {
    try {
      if (userStatus === "ATIVO") {
        await blockUsuario(id)
        toast.success("Usuário bloqueado com sucesso!")
      } else {
        await unblockUsuario(id)
        toast.success("Usuário desbloqueado com sucesso!")
      }
      refetch()
    } catch {
      toast.error(
        `Erro ao ${userStatus === "ATIVO" ? "bloquear" : "desbloquear"} usuário`
      )
    } finally {
      setOpenBlockModal(false)
    }
  }

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Email", accessor: "email" },
    {
      header: "Status",
      accessor: "status",
      render: (value: string) => (
        <span className={value === "ATIVO" ? "text-green-600" : "text-red-600"}>
          {value}
        </span>
      ),
    },
    {
      header: "Perfil",
      accessor: "perfilId",
      render: (value: string) =>
        perfis?.data.find((p) => p.id === value)?.nome || "",
    },
    {
      header: "Corretora",
      accessor: "corretoraId",
      render: (value: string) =>
        value ?
          corretoras?.data?.find((c) => c.id === value)?.razaoSocial || ""
        : "-",
    },
    {
      header: "Master",
      accessor: "isMaster",
      render: (value: boolean) => (value ? "Sim" : "Não"),
    },
    {
      header: "Ações",
      accessor: "id",
      render: (value: string, row: { status: string }) => (
        <div className="flex space-x-4">
          <Pencil
            className="cursor-pointer hover:text-blue-500"
            size={24}
            onClick={() => handleEdit(value)}
            color="#00dfa7"
          />
          <LockKey
            className={`cursor-pointer ${row.status === "ATIVO" ? "hover:text-yellow-500" : "text-red-500 hover:text-red-600"}`}
            size={24}
            onClick={() => {
              setId(value)
              setUserStatus(row.status)
              setOpenBlockModal(true)
            }}
            color="#00dfa7"
          />
          <Trash
            className="cursor-pointer hover:text-red-500"
            size={24}
            onClick={() => {
              setId(value)
              setOpen(true)
            }}
            color="#00dfa7"
          />
        </div>
      ),
    },
  ]

  const filterFields: FilterField[] = [
    { name: "search", label: "Busca", placeholder: "Buscar por nome ou email" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Ativo", value: "ATIVO" },
        { label: "Inativo", value: "INATIVO" },
        { label: "Pendente", value: "PENDENTE" },
        { label: "Bloqueado", value: "BLOQUEADO" },
      ],
      placeholder: "Selecione",
    },
    {
      name: "corretoraId",
      label: "Corretora",
      type: "select",
      options: corretorasOptions,
      placeholder: "Selecione",
    },
    {
      name: "perfilId",
      label: "Perfil",
      type: "select",
      options: perfisOptions,
      placeholder: "Selecione",
    },
    {
      name: "produtorId",
      label: "Produtor",
      type: "select",
      options: produtoresOptions,
      placeholder: "Selecione",
    },
  ]

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    setPage(1)
  }

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Usuário"
        content="Você tem certeza de que deseja remover este usuário?"
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
        title={
          userStatus === "ATIVO" ? "Bloquear Usuário" : "Desbloquear Usuário"
        }
        content={`Você tem certeza de que deseja ${userStatus === "ATIVO" ? "bloquear" : "desbloquear"} este usuário?`}
        onClose={() => setOpenBlockModal(false)}
        open={openBlockModal}>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={handleConfirmBlock} variant="secondary">
            Confirmar
          </Button>
          <Button onClick={() => setOpenBlockModal(false)} variant="tertiary">
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
        <Button onClick={() => push("/usuarios/create")} variant="secondary">
          Cadastrar
        </Button>
        <div className="flex items-center gap-2">
          <ExportTableToPDFButton
            filename={`usuario.${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}`}
            options={{ orientation: "portrait" }}
            title="Perfis"
            className="bg-red-500">
            Exportar PDF
          </ExportTableToPDFButton>
          <Button
            className="flex items-center gap-1"
            variant="secondary"
            onClick={() => exportNoPagination("usuario")}>
            <FileXls size={22} />
            Exportar
          </Button>
        </div>
      </div>

      {usuarios.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhum usuário cadastrado.
        </h2>
      : <>
          <Table columns={columns} data={usuarios} />
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
        </>
      }
    </>
  )
}
