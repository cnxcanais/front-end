import { Button } from "@/core/components/Button"
import { Modal } from "@/core/components/Modals/Modal"
import { ChatCenteredText } from "@phosphor-icons/react"
import { ReactNode, useState } from "react"

export type ModalProps = {
  children: ReactNode
  open: boolean
  onClose: () => void
}

function ModalObservation({ children, onClose, open }: ModalProps) {
  return (
    <Modal open={open} title="Observação" onClose={onClose}>
      {children}
      <Button onClick={onClose} variant="tertiary">
        Fechar
      </Button>
    </Modal>
  )
}

export function ModalObservationTrigger({ content }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ModalObservation open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="my-6 max-h-60 overflow-hidden overflow-y-auto rounded-lg bg-gray-100 px-2 py-1.5">
          <p className="break-all text-sm text-gray-500">{content}</p>
        </div>
      </ModalObservation>
      <ChatCenteredText
        onClick={() => setIsOpen(true)}
        className="h-5 w-5 cursor-pointer"
      />
    </>
  )
}
