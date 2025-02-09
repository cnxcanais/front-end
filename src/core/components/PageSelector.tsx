import { ArrowCircleLeft, ArrowCircleRight } from "@phosphor-icons/react"

type PageSelectorProps = {
  page: number
  setPage: (page: number) => void
  totalPages: number
}

export function PageSelector({ page, setPage, totalPages }: PageSelectorProps) {
  const handleAdvance = () => {
    if (page < totalPages) setPage(page + 1)
  }
  const handleBack = () => {
    if (page > 1) setPage(page - 1)
  }

  return (
    <div className="mb-3 flex justify-end">
      <div className="flex items-center gap-3 rounded border bg-gray-100">
        <button
          onClick={handleBack}
          className="cursor-pointer rounded-md p-2 text-blue-500 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page <= 1}>
          <ArrowCircleLeft size={26} />
        </button>
        <p className="text-sm font-bold text-blue-500">{`${page < 10 ? "0" + page : page} de ${totalPages < 10 ? "0" + totalPages : totalPages}`}</p>
        <button
          onClick={handleAdvance}
          className="cursor-pointer rounded-md p-2 text-blue-500 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page === totalPages}>
          <ArrowCircleRight size={26} />
        </button>
      </div>
    </div>
  )
}
