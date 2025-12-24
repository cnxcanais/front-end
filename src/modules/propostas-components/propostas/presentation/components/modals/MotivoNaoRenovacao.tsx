import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import dynamic from "next/dynamic"
import { Dispatch, SetStateAction } from "react"
import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

type Props = {
  setOpenNaoRenovarModal: Dispatch<SetStateAction<boolean>>
  open: boolean
  motivoNaoRenovacao: string
  setMotivoNaoRenovacao: Dispatch<SetStateAction<string>>
  handleConfirmNaoRenovar: () => void
}

export function MotivoNaoRenovacaoModal({
  setOpenNaoRenovarModal,
  open,
  motivoNaoRenovacao,
  setMotivoNaoRenovacao,
  handleConfirmNaoRenovar,
}: Props) {
  return (
    <Modal
      title="Não Renovar Apólice"
      content="Tem certeza de que deseja marcar esta apólice como não renovada?"
      onClose={() => setOpenNaoRenovarModal(false)}
      open={open}>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Motivo da não renovação
          </h3>

          <div className="bg-white" style={{ minHeight: "300px" }}>
            <ReactQuill
              theme="snow"
              value={motivoNaoRenovacao}
              onChange={(value) => setMotivoNaoRenovacao(value)}
              style={{ height: "257px", width: "400px" }}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleConfirmNaoRenovar} variant="secondary">
            Confirmar
          </Button>
          <Button
            onClick={() => setOpenNaoRenovarModal(false)}
            variant="tertiary">
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
