"use client"

import { EntityType } from "@/@types/enums/entityType"

import { Button } from "@/core/components/Button"
import { FilterField, FilterForm } from "@/core/components/FilterForm"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { Modal } from "@/core/components/Modals/Modal"
import { ModalFilesTrigger } from "@/core/components/Modals/ModalFiles/ModalFilesTrigger"
import { Pagination } from "@/core/components/Pagination"
import { Table } from "@/core/components/Table"
import { getCookie } from "@/lib/cookies"
import { useCorretoraQuery } from "@/modules/corretoras-components/corretora/infra/hooks/use-corretora-query"
import { useProdutorQuery } from "@/modules/produtores-components/produtor/infra/hooks/use-produtor-query"
import { useProdutoQuery } from "@/modules/produtos-components/produtos/infra/hooks/use-produto-query"
import { usePropostaQuery } from "@/modules/propostas-components/propostas/infra/hooks/use-proposta-query"
import {
  cancelarApolice,
  emitirApolice,
  exportPropostas,
  getUltimoEndosso,
  importPropostas,
  naoRenovarApolice,
  refuseProposta,
  removeProposta,
} from "@/modules/propostas-components/propostas/infra/remote"
import {
  SituacaoEnum,
  TipoDocumentoEnum,
} from "@/modules/propostas-components/types/enums"
import { ImportErrors } from "@/modules/propostas-components/types/importErrors"
import { useRamoQuery } from "@/modules/ramos-components/ramos/infra/hooks/use-ramo-query"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { useSeguradoQuery } from "@/modules/segurados-components/segurado/infra/hooks/use-segurado-query"
import {
  Copy,
  Eye,
  FileXls,
  MoneyWavy,
  Note,
  Pencil,
  ProhibitInset,
  Recycle,
  Trash,
  X,
  XCircle,
} from "@phosphor-icons/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { DashboardIndicators } from "./DashboardIndicators"
import { CancelarApoliceModal } from "./modals/CancelarApoliceModal"
import { EmitirApoliceModal } from "./modals/EmitirApoliceModal"
import { EndossarApoliceModal } from "./modals/EndossarApoliceModal"
import { ExportPropostasModal } from "./modals/ExportPropostasModal"
import { ImportErrorsModal } from "./modals/ImportErrorsModal"
import { ImportPropostasModal } from "./modals/ImportPropostasModal"
import { RenovarApoliceModal } from "./modals/RenovarApoliceModal"

export function PropostasTable() {
  const searchParams = useSearchParams()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const isAdmin = getCookie("perfilId") === process.env.NEXT_PUBLIC_ADM_ID
  const corretoraId = getCookie("corretoraId")
  const baseFilter = isAdmin ? {} : { corretoraId }
  const [filters, setFilters] = useState<Record<string, string>>({
    ...baseFilter,
  })
  const hasUrlIds = searchParams.get("ids")
  const { data, isLoading, refetch } = usePropostaQuery(
    page,
    hasUrlIds ? -1 : limit,
    filters
  )
  const [ramoId, setRamoId] = useState("")
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  const [filteredResults, setFilteredResults] = useState([])
  const [dashboardFilter, setDashboardFilter] = useState<any[] | null>(null)
  const [produtosOptions, setProdutosOptions] = useState([])
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [openExportModal, setOpenExportModal] = useState(false)
  const [openImportModal, setOpenImportModal] = useState(false)
  const [openEmitirApoliceModal, setOpenEmitirApoliceModal] = useState(false)
  const [selectedPropostaId, setSelectedPropostaId] = useState("")
  const [openEndossarApoliceModal, setOpenEndossarApoliceModal] =
    useState(false)
  const [openRenovarApoliceModal, setOpenRenovarApoliceModal] = useState(false)
  const [openNaoRenovarModal, setOpenNaoRenovarModal] = useState(false)
  const [openCancelarApoliceModal, setOpenCancelarApoliceModal] =
    useState(false)
  const [openErrorsModal, setOpenErrorsModal] = useState(false)
  const [importErrorsData, setImportErrorsData] = useState<ImportErrors>()

  const { data: segurados } = useSeguradoQuery(1, -1)
  const { data: corretoras } = useCorretoraQuery(1, -1)
  const { data: produtores } = useProdutorQuery(1, -1)
  const { data: seguradoras } = useSeguradoraQuery(1, -1)
  const { data: ramos } = useRamoQuery(1, -1)
  const { data: produtos } = useProdutoQuery(1, -1)

  useEffect(() => {
    if (ramoId && produtos?.data) {
      const filteredProdutos = produtos.data.filter((p) => p.ramoId === ramoId)
      const produtosOption = filteredProdutos.map((p) => ({
        label: p.descricao,
        value: p.id,
      }))
      setProdutosOptions(produtosOption)
    }
  }, [ramoId, produtos?.data])

  const seguradosOptions = useMemo(() => {
    if (!segurados?.data) return []
    return segurados.data.map((s) => ({
      label: s.nomeRazaoSocial,
      value: s.id,
    }))
  }, [segurados])

  const corretorasOptions = useMemo(() => {
    if (!corretoras?.data) return []
    return corretoras.data.map((c) => ({
      label: c.razaoSocial,
      value: c.id,
    }))
  }, [corretoras])

  const produtoresOptions = useMemo(() => {
    if (!produtores?.data) return []
    return produtores.data.map((p) => ({
      label: p.nome,
      value: p.id,
    }))
  }, [produtores])

  const seguradoresOptions = useMemo(() => {
    if (!seguradoras?.data) return []
    return seguradoras.data.map((s) => ({
      label: s.razaoSocial,
      value: s.id,
    }))
  }, [seguradoras])

  const ramosOptions = useMemo(() => {
    if (!ramos?.data) return []
    return ramos.data.map((r) => ({
      label: r.descricao,
      value: r.id,
    }))
  }, [ramos])

  const propostas = data?.data || []
  const totalPages =
    dashboardFilter ?
      Math.ceil(filteredResults.length / limit)
    : data?.meta?.totalPages || 1

  const getSeguradoName = (id: string) =>
    segurados?.data?.find((s) => s.id === id)?.nomeRazaoSocial || ""
  const getProdutorName = (id: string) =>
    produtores?.data?.find((p) => p.id === id)?.nome || ""
  const getRamoName = (id: string) =>
    ramos?.data.find((r) => r.id === id)?.descricao || ""
  const getSeguradoraName = (id: string) =>
    seguradoras?.data?.find((s) => s.id === id)?.razaoSocial || ""
  const getSeguradoraLogo = (id: string) =>
    seguradoras?.data?.find((s) => s.id === id)?.logoUrl || ""
  const getCorretoraName = (id: string) =>
    corretoras?.data?.find((c) => c.id === id)?.razaoSocial || ""

  const handleEdit = (id: string) => {
    const propostaSelecionada = propostas.find((p) => p.id === id)
    if (
      propostaSelecionada.tipoDocumento !== TipoDocumentoEnum.PROPOSTA &&
      propostaSelecionada.situacao !== SituacaoEnum.ATIVO
    ) {
      toast.info("Apenas propostas ativas podem ser editadas.")
      return
    }
    push(`/propostas/edit/${id}`)
  }

  const handleDuplicate = (id: string) => {
    const propostaSelecionada = propostas.find((p) => p.id === id)
    if (propostaSelecionada?.tipoDocumento !== TipoDocumentoEnum.PROPOSTA) {
      toast.info("Apenas propostas podem ser duplicadas.")
      return
    }
    push(`/propostas/create?duplicateFrom=${id}`)
  }

  const handleRefuseProposta = async (id: string) => {
    const propostaSelecionada = propostas.find((p) => p.id === id)
    if (
      propostaSelecionada.tipoDocumento !== TipoDocumentoEnum.PROPOSTA &&
      propostaSelecionada.situacao !== SituacaoEnum.ATIVO
    ) {
      toast.info("Apenas propostas ativas podem ser recusadas.")
      return
    }
    await refuseProposta(id)
    refetch()
  }

  const handleEmitirApolice = async (data: {
    dataEmissao: string
    numeroApolice: string
    inicioVigencia: string
    fimVigencia: string
  }) => {
    try {
      await emitirApolice(selectedPropostaId, data)
      toast.success("Apólice emitida com sucesso!")
      refetch()
      setOpenEmitirApoliceModal(false)
    } catch (error) {
      toast.error("Erro ao emitir apólice")
    }
  }

  const handleEndossarApolice = (data: {
    dataEmissao: string
    numeroEndosso: string
    inicioVigencia: string
    fimVigencia: string
  }) => {
    const params = new URLSearchParams({
      duplicateFrom: selectedPropostaId,
      endosso: "true",
      dataEmissao: data.dataEmissao,
      numeroEndosso: data.numeroEndosso,
      inicioVigencia: data.inicioVigencia,
      fimVigencia: data.fimVigencia,
    })
    push(`/propostas/create?${params.toString()}`)
    setOpenEndossarApoliceModal(false)
  }

  const handleRenovarApolice = (data: {
    dataEmissao: string
    numeroApolice: string
    inicioVigencia: string
    fimVigencia: string
  }) => {
    const params = new URLSearchParams({
      duplicateFrom: selectedPropostaId,
      renovacao: "true",
      dataEmissao: data.dataEmissao,
      numeroApolice: data.numeroApolice,
      inicioVigencia: data.inicioVigencia,
      fimVigencia: data.fimVigencia,
    })
    push(`/propostas/create?${params.toString()}`)
    setOpenRenovarApoliceModal(false)
  }

  const handleConfirmNaoRenovar = async () => {
    try {
      await naoRenovarApolice(selectedPropostaId)
      toast.success("Apólice marcada como não renovada!")
      refetch()
    } catch (error) {
      toast.error("Erro ao marcar apólice como não renovada")
    } finally {
      setOpenNaoRenovarModal(false)
    }
  }

  const handleCancelarApolice = async (data: {
    dataCancelamento: string
    motivoNaoRenovacao: string
  }) => {
    try {
      await cancelarApolice(selectedPropostaId, data)
      toast.success("Apólice cancelada com sucesso!")
      refetch()
      setOpenCancelarApoliceModal(false)
    } catch (error) {
      toast.error("Erro ao cancelar apólice")
    }
  }

  const handleConfirmDelete = async () => {
    const propostaSelecionada = propostas.find((p) => p.id === id)
    if (
      propostaSelecionada.situacao !== SituacaoEnum.ATIVO &&
      propostaSelecionada.tipoDocumento !== TipoDocumentoEnum.PROPOSTA
    ) {
      toast.info("Apenas propostas ativas podem ser removidas.")
      return
    }

    try {
      await removeProposta(id)
      toast.success("Proposta removida com sucesso!")
      refetch()
    } catch (error) {
      const message =
        error?.response?.data?.message || "Erro ao remover proposta"
      toast.error(message)
    } finally {
      setOpen(false)
    }
  }

  const handleExport = async (exportFilters: Record<string, string>) => {
    try {
      const blob = await exportPropostas(exportFilters)
      const csvBlob = new Blob([blob], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(csvBlob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute(
        "download",
        `propostas-${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}.csv`
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success("Propostas exportadas com sucesso!")
    } catch (error) {
      console.error("Erro ao exportar propostas:", error)
    }
  }

  const handleImport = async (file: File) => {
    try {
      const response = await importPropostas(file)
      console.log(response)
      if (response.erros) {
        setOpenErrorsModal(true)
        setImportErrorsData(response)
      }
      refetch()
    } catch (error) {
      console.error("Erro ao importar propostas:", error)
    }
  }

  const columns = [
    {
      header: "",
      accessor: "id",
      render: (value: string) => (
        <button
          onClick={() =>
            setExpandedIds(
              expandedIds.includes(value) ?
                expandedIds.filter((id) => id !== value)
              : [...expandedIds, value]
            )
          }
          className="font-bold text-blue-600">
          {expandedIds.includes(value) ? "v" : ">"}
        </button>
      ),
    },
    {
      header: "Segurado",
      accessor: "seguradoId",
      render: (value: string) => (
        <span
          className="cursor-pointer text-red-600 hover:underline"
          onClick={() =>
            isAdmin ?
              push(`/segurados/edit/${value}`)
            : push(`/segurados/view/${value}`)
          }>
          {getSeguradoName(value)}
        </span>
      ),
    },
    {
      header: "Ramo",
      accessor: "ramoId",
      render: (value: string, row: any) => (
        <div>
          <div>{getRamoName(value)}</div>
          <div className="text-sm text-gray-600">
            Vigência: {row.inicioVigencia} a {row.fimVigencia}
          </div>
          {row.parcelas[0] && (
            <div className="text-sm text-gray-600">
              1º Parcela:{" "}
              {new Date(row.parcelas[0].dataVencimento).toLocaleDateString(
                "pt-BR"
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "situacao",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              row.situacao === "Cancelada" ? "bg-red-500"
              : row.situacao !== "Ativo" ? "bg-blue-100"
              : new Date(row.fimVigencia) > new Date() ? "bg-green-500"
              : new Date(row.fimVigencia) === new Date() ? "bg-yellow-500"
              : "bg-red-500"
            }`}
          />
          <div>
            <div className="font-medium">{row.tipoDocumento}</div>
            <div className="text-sm text-gray-600">{row.numeroProposta}</div>
            <div>{row.situacao}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Produtor",
      accessor: "produtorId",
      render: (value: string) => getProdutorName(value),
    },
    {
      header: "Seguradora",
      accessor: "seguradoraId",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getSeguradoraLogo(value) ?
            <img
              src={getSeguradoraLogo(value)}
              alt="Logo"
              className="h-8 w-8 object-contain"
            />
          : <div className="h-8 w-8" />}
          <span>{getSeguradoraName(value)}</span>
        </div>
      ),
    },
    {
      header: "Arquivos",
      accessor: "id",
      render: (value: string) => (
        <ModalFilesTrigger
          isAdmin={isAdmin}
          entityId={value}
          entityType={EntityType.PROPOSTA_APOLICE}
        />
      ),
    },
    {
      header: "Ação",
      accessor: "id",
      render: (value: string, row: any) => (
        <div className="flex min-w-[100px] max-w-[150px] flex-wrap gap-2">
          <span title="Visualizar">
            <Eye
              className="cursor-pointer hover:text-gray-500"
              size={24}
              onClick={() => push(`/propostas/view/${value}`)}
            />
          </span>
          {row.tipoDocumento === TipoDocumentoEnum.PROPOSTA &&
            row.situacao === SituacaoEnum.ATIVO &&
            isAdmin && (
              <>
                <span title="Editar">
                  <Pencil
                    className="cursor-pointer hover:text-blue-500"
                    size={24}
                    onClick={() => handleEdit(value)}
                  />
                </span>
                <span title="Clonar Proposta">
                  <Copy
                    className="cursor-pointer hover:text-green-500"
                    size={24}
                    onClick={() => handleDuplicate(value)}
                  />
                </span>

                <span title="Recusar Proposta">
                  <XCircle
                    className="cursor-pointer hover:text-red-500"
                    size={24}
                    onClick={() => handleRefuseProposta(value)}
                  />
                </span>

                <span title="Emitir Apólice">
                  <MoneyWavy
                    className="cursor-pointer hover:text-green-500"
                    size={24}
                    onClick={() => {
                      setSelectedPropostaId(value)
                      setOpenEmitirApoliceModal(true)
                    }}
                  />
                </span>
              </>
            )}

          {(row.tipoDocumento === TipoDocumentoEnum.APOLICE ||
            row.tipoDocumento === TipoDocumentoEnum.ENDOSSO ||
            row.tipoDocumento === TipoDocumentoEnum.RENOVACAO) &&
            row.situacao === SituacaoEnum.ATIVO &&
            isAdmin && (
              <span title="Endossar Apólice">
                <Note
                  className="cursor-pointer hover:text-blue-500"
                  size={24}
                  onClick={async () => {
                    const ultimoEndosso = await getUltimoEndosso(value)
                    setSelectedPropostaId(ultimoEndosso?.ultimaVersao?.id)
                    setOpenEndossarApoliceModal(true)
                  }}
                />
              </span>
            )}

          {row.tipoDocumento === TipoDocumentoEnum.APOLICE &&
            row.situacao === SituacaoEnum.ATIVO &&
            isAdmin && (
              <>
                <span title="Renovar Apólice">
                  <Recycle
                    className="cursor-pointer hover:text-purple-500"
                    size={24}
                    onClick={() => {
                      setSelectedPropostaId(value)
                      setOpenRenovarApoliceModal(true)
                    }}
                  />
                </span>
                <span title="Não Renovar Apólice">
                  <ProhibitInset
                    className="cursor-pointer hover:text-orange-500"
                    size={24}
                    onClick={() => {
                      setSelectedPropostaId(value)
                      setOpenNaoRenovarModal(true)
                    }}
                  />
                </span>
              </>
            )}

          {(row.tipoDocumento === TipoDocumentoEnum.ENDOSSO ||
            row.tipoDocumento === TipoDocumentoEnum.RENOVACAO) &&
            row.situacao === SituacaoEnum.ATIVO &&
            isAdmin && (
              <span title="Não Renovar Apólice">
                <ProhibitInset
                  className="cursor-pointer hover:text-orange-500"
                  size={24}
                  onClick={() => {
                    setSelectedPropostaId(value)
                    setOpenNaoRenovarModal(true)
                  }}
                />
              </span>
            )}

          {(row.tipoDocumento === TipoDocumentoEnum.APOLICE ||
            row.tipoDocumento === TipoDocumentoEnum.ENDOSSO ||
            row.tipoDocumento === TipoDocumentoEnum.RENOVACAO) &&
            row.situacao === SituacaoEnum.ATIVO &&
            isAdmin && (
              <span title="Cancelar Apólice">
                <X
                  className="cursor-pointer hover:text-red-600"
                  size={24}
                  onClick={() => {
                    setSelectedPropostaId(value)
                    setOpenCancelarApoliceModal(true)
                  }}
                />
              </span>
            )}

          {row.tipoDocumento === TipoDocumentoEnum.PROPOSTA &&
            row.situacao === SituacaoEnum.ATIVO &&
            isAdmin && (
              <span title="Deletar">
                <Trash
                  className="cursor-pointer hover:text-red-500"
                  size={24}
                  onClick={() => {
                    setId(value)
                    setOpen(true)
                  }}
                />
              </span>
            )}
        </div>
      ),
    },
  ]

  const quickSearchFields: FilterField[] = useMemo(
    () => [
      {
        name: "numeroProposta",
        label: "Número Proposta",
        placeholder: "Buscar por número",
      },
      {
        name: "seguradoId",
        label: "Segurado",
        placeholder: "Buscar por segurado",
        type: "select",
        options: [{ label: "Todos", value: "" }, ...seguradosOptions],
      },
      {
        name: "placaVeiculo",
        label: "Placa Veículo",
        placeholder: "Buscar por placa",
      },
      {
        name: "chassiVeiculo",
        label: "Chassi Veículo",
        placeholder: "Buscar por chassi",
      },
    ],
    [seguradosOptions]
  )

  const baseAdvancedSearchFields: FilterField[] = useMemo(
    () => [
      {
        name: "produtorId",
        label: "Produtor",
        placeholder: "Buscar por produtor",
        type: "select" as const,
        options: [{ label: "Todos", value: "" }, ...produtoresOptions],
      },
      {
        name: "seguradoraId",
        label: "Seguradora",
        placeholder: "Buscar por seguradora",
        type: "select",
        options: [{ label: "Todos", value: "" }, ...seguradoresOptions],
      },
      {
        name: "ramoId",
        label: "Ramo",
        placeholder: "Buscar por ramo",
        type: "select",
        options: [{ label: "Todos", value: "" }, ...ramosOptions],
      },
      {
        name: "produtoId",
        label: "Produto",
        type: "select",
        options: [{ label: "Todos", value: "" }, ...produtosOptions],
      },
      {
        name: "tipoDocumento",
        label: "Tipo Documento",
        placeholder: "Buscar por tipo",
        type: "select",
        options: [
          { label: "Todos", value: "" },
          { label: "Proposta", value: "Proposta" },
          { label: "Apólice", value: "Apólice" },
          { label: "Renovação", value: "Renovação" },
          { label: "Endosso", value: "Endosso" },
        ],
      },
      {
        name: "origem",
        label: "Origem",
        placeholder: "Buscar por origem",
        type: "select",
        options: [
          { label: "Todos", value: "" },
          { label: "Manual", value: "Manual" },
          { label: "Importação", value: "Importação" },
          { label: "Integração", value: "Integração" },
        ],
      },
      {
        name: "situacao",
        label: "Situação",
        placeholder: "Buscar por situação",
        type: "select",
        options: [
          { label: "Todos", value: "" },
          { label: "Ativo", value: "Ativo" },
          { label: "Inativo", value: "Inativo" },
        ],
      },
      {
        name: "search",
        label: "Complemento",
        placeholder: "Buscar por complemento",
      },
      {
        name: "inicioVigenciaMin",
        label: "Vigência Inicial (De)",
        type: "date",
      },
      {
        name: "inicioVigenciaMax",
        label: "Vigência Inicial (Até)",
        type: "date",
      },
    ],
    [
      corretorasOptions,
      produtoresOptions,
      seguradoresOptions,
      ramosOptions,
      produtosOptions,
    ]
  )

  const adminAdvancedSearchFields: FilterField[] = useMemo(
    () => [
      ...baseAdvancedSearchFields,
      {
        name: "corretoraId",
        label: "Corretora",
        placeholder: "Buscar por corretora",
        type: "select" as const,
        options: [{ label: "Todos", value: "" }, ...corretorasOptions],
      },
    ],
    [
      corretorasOptions,
      produtoresOptions,
      seguradoresOptions,
      ramosOptions,
      produtosOptions,
    ]
  )

  const filterSections = useMemo(
    () => [
      {
        title: "Busca Rápida",
        fields: quickSearchFields,
        defaultOpen: true,
      },
      {
        title: "Busca Avançada",
        fields: isAdmin ? adminAdvancedSearchFields : baseAdvancedSearchFields,
        defaultOpen: false,
      },
    ],
    [quickSearchFields, adminAdvancedSearchFields, baseAdvancedSearchFields]
  )

  const handleFilter = (newFilters: Record<string, string>) => {
    const updatedFilters = { ...newFilters }
    if (!newFilters.ramoId) {
      delete updatedFilters.produtoId
    }
    setFilters({ ...baseFilter, ...updatedFilters })
    setPage(1)
    setDashboardFilter(null)
    if (searchParams.get("ids")) {
      push("/propostas")
    }
  }

  useEffect(() => {
    const ids = searchParams.get("ids")
    if (ids) {
      const idArray = ids.split(",")
      const filtered = propostas.filter((p) => idArray.includes(p.id))
      if (JSON.stringify(filtered) !== JSON.stringify(dashboardFilter)) {
        setDashboardFilter(filtered)
      }
    } else if (dashboardFilter !== null) {
      setDashboardFilter(null)
    }
  }, [searchParams, propostas, dashboardFilter])

  useEffect(() => {
    if (dashboardFilter) {
      setFilteredResults(dashboardFilter)
    } else if (propostas.length > 0) {
      setFilteredResults(propostas)
    }
  }, [propostas, dashboardFilter])

  if (isLoading) return <LoadingScreen />

  return (
    <>
      <Modal
        title="Remover Proposta"
        content="Você tem certeza de que deseja remover esta proposta?"
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
        sections={filterSections}
        onFilter={handleFilter}
        defaultOpen={true}
        title="Filtros"
        onSelectChange={(fieldName, value) => {
          if (fieldName === "ramoId") {
            setRamoId(value)
          }
        }}
        appliedFilters={filters}
      />

      <DashboardIndicators
        onFilterChange={(filterType, data) => {
          setFilteredResults(data)
          setPage(1)
        }}
      />

      {isAdmin && (
        <div className="flex items-center justify-between">
          <div className="flex h-full gap-4">
            <Button
              onClick={() => push("/propostas/create")}
              variant="secondary">
              Cadastrar
            </Button>
          </div>
          {propostas.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                className="flex items-center gap-1"
                variant="secondary"
                onClick={() => setOpenImportModal(true)}>
                <FileXls size={22} />
                Importar
              </Button>
              <Button
                className="flex items-center gap-1"
                variant="secondary"
                onClick={() => setOpenExportModal(true)}>
                <FileXls size={22} />
                Exportar
              </Button>
            </div>
          )}
        </div>
      )}

      <ExportPropostasModal
        open={openExportModal}
        onClose={() => setOpenExportModal(false)}
        onExport={handleExport}
        seguradosOptions={seguradosOptions}
        corretorasOptions={corretorasOptions}
        produtoresOptions={produtoresOptions}
        seguradoresOptions={seguradoresOptions}
        ramosOptions={ramosOptions}
        produtosOptions={produtosOptions}
      />

      <ImportPropostasModal
        open={openImportModal}
        onClose={() => setOpenImportModal(false)}
        onImport={handleImport}
      />

      <ImportErrorsModal
        open={openErrorsModal}
        onClose={() => setOpenErrorsModal(false)}
        detalheErros={importErrorsData}
      />

      <EmitirApoliceModal
        open={openEmitirApoliceModal}
        onClose={() => setOpenEmitirApoliceModal(false)}
        onConfirm={handleEmitirApolice}
      />

      <EndossarApoliceModal
        open={openEndossarApoliceModal}
        onClose={() => setOpenEndossarApoliceModal(false)}
        onConfirm={handleEndossarApolice}
      />

      <RenovarApoliceModal
        open={openRenovarApoliceModal}
        onClose={() => setOpenRenovarApoliceModal(false)}
        onConfirm={handleRenovarApolice}
      />

      <Modal
        title="Não Renovar Apólice"
        content="Tem certeza de que deseja marcar esta apólice como não renovada?"
        onClose={() => setOpenNaoRenovarModal(false)}
        open={openNaoRenovarModal}>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={handleConfirmNaoRenovar} variant="secondary">
            Confirmar
          </Button>
          <Button
            onClick={() => setOpenNaoRenovarModal(false)}
            variant="tertiary">
            Cancelar
          </Button>
        </div>
      </Modal>

      <CancelarApoliceModal
        open={openCancelarApoliceModal}
        onClose={() => setOpenCancelarApoliceModal(false)}
        onConfirm={handleCancelarApolice}
      />

      {propostas.length == 0 ?
        <h2 className="mt-6 text-xl font-semibold">
          Nenhuma proposta cadastrada.
        </h2>
      : <>
          <Table
            columns={columns}
            data={filteredResults}
            expandedRowIds={expandedIds}
            expandedRowContent={(row: any) => (
              <div className="grid grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="mb-1 block font-medium text-gray-600">
                    Corretora
                  </label>
                  <input
                    type="text"
                    value={getCorretoraName(row.corretoraId)}
                    disabled
                    className="w-full rounded border bg-white px-2 py-1"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-600">
                    Prêmio Líquido
                  </label>
                  <input
                    type="text"
                    value={row.premioLiquido || ""}
                    disabled
                    className="w-full rounded border bg-white px-2 py-1"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-600">
                    Comissão
                  </label>
                  <input
                    type="text"
                    value={row.valorComissao || ""}
                    disabled
                    className="w-full rounded border bg-white px-2 py-1"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-600">
                    Origem
                  </label>
                  <input
                    type="text"
                    value={row.origem || ""}
                    disabled
                    className="w-full rounded border bg-white px-2 py-1"
                  />
                </div>
                {row.placaVeiculo && (
                  <div>
                    <label className="mb-1 block font-medium text-gray-600">
                      Placa Veículo
                    </label>
                    <input
                      type="text"
                      value={row.placaVeiculo}
                      disabled
                      className="w-full rounded border bg-white px-2 py-1"
                    />
                  </div>
                )}
                {row.chassiVeiculo && (
                  <div>
                    <label className="mb-1 block font-medium text-gray-600">
                      Chassi Veículo
                    </label>
                    <input
                      type="text"
                      value={row.chassiVeiculo}
                      disabled
                      className="w-full rounded border bg-white px-2 py-1"
                    />
                  </div>
                )}
                {row.marcaVeiculo && (
                  <div>
                    <label className="mb-1 block font-medium text-gray-600">
                      Marca Veículo
                    </label>
                    <input
                      type="text"
                      value={row.marcaVeiculo}
                      disabled
                      className="w-full rounded border bg-white px-2 py-1"
                    />
                  </div>
                )}
                {row.modeloVeiculo && (
                  <div>
                    <label className="mb-1 block font-medium text-gray-600">
                      Modelo Veículo
                    </label>
                    <input
                      type="text"
                      value={row.modeloVeiculo}
                      disabled
                      className="w-full rounded border bg-white px-2 py-1"
                    />
                  </div>
                )}
                {row.anoFabricacaoVeiculo && (
                  <div>
                    <label className="mb-1 block font-medium text-gray-600">
                      Ano Fabricação
                    </label>
                    <input
                      type="text"
                      value={row.anoFabricacaoVeiculo}
                      disabled
                      className="w-full rounded border bg-white px-2 py-1"
                    />
                  </div>
                )}
                {row.anoModeloVeiculo && (
                  <div>
                    <label className="mb-1 block font-medium text-gray-600">
                      Ano Modelo
                    </label>
                    <input
                      type="text"
                      value={row.anoModeloVeiculo}
                      disabled
                      className="w-full rounded border bg-white px-2 py-1"
                    />
                  </div>
                )}
              </div>
            )}
          />
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
