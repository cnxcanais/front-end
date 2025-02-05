import { ArrowCircleLeft, ArrowCircleRight } from "@phosphor-icons/react"

type Props = {
  page: number
  setPage: any
  totalPages: number
}

export function PageSelector({ page, setPage, totalPages }: Props) {
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
          <ArrowCircleLeft size={20} />
        </button>
        <p className="font-bold text-blue-500">{`${page < 10 ? "0" + page : page} de ${totalPages < 10 ? "0" + totalPages : totalPages}`}</p>
        <button
          onClick={handleAdvance}
          className="cursor-pointer rounded-md p-2 text-blue-500 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page === totalPages}>
          <ArrowCircleRight size={20} />
        </button>
      </div>
    </div>
  )
}
