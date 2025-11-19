interface PaginationProps {
  page: number
  totalPages: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export function Pagination({ page, totalPages, limit, onPageChange, onLimitChange }: PaginationProps) {
  return (
    <div className="md-2 mb-4 mt-0 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm">Itens por página:</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="w-16 rounded border border-gray-300 px-2 py-1 text-sm">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded px-3 py-1 text-sm enabled:hover:bg-gray-100 disabled:opacity-50">
          Anterior
        </button>
        <span className="text-sm">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded px-3 py-1 text-sm enabled:hover:bg-gray-100 disabled:opacity-50">
          Próxima
        </button>
      </div>
    </div>
  )
}