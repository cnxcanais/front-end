"use client"

import { Button } from "@/core/components/Button"
import { UltimoEndossoResponse } from "@/@types/proposta"
import { useRouter } from "next/navigation"

type Props = {
  open: boolean
  onClose: () => void
  data: UltimoEndossoResponse | null
}

export function CadeiaPropostaModal({ open, onClose, data }: Props) {
  const router = useRouter()

  if (!open || !data) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold">Cadeia de Documentos</h3>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b">
                <th className="pb-2 text-left">Nº Proposta</th>
                <th className="pb-2 text-left">Nº Apólice</th>
                <th className="pb-2 text-left">Tipo Documento</th>
                <th className="pb-2 text-left">Situação</th>
              </tr>
            </thead>
            <tbody>
              {data.cadeia.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer border-b hover:bg-gray-100"
                  onClick={() => {
                    router.push(`/propostas/view/${item.id}`)
                    onClose()
                  }}>
                  <td className="py-2">{item.numeroProposta}</td>
                  <td className="py-2">{item.numeroApolice || "-"}</td>
                  <td className="py-2">{item.tipoDocumento}</td>
                  <td className="py-2">{item.situacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}
