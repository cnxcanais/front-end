import { ChatCenteredText } from "@phosphor-icons/react"
import { ReactNode, useState } from "react"
import { Button } from "../Button"
import { Modal } from "./Modal"

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
        Cancelar
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
