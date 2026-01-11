import { Modal } from "@/core/components/Modals/Modal"
import { CreateCorretoraForm } from "@/modules/corretoras-components/create-corretora/presentation/components/CreateCorretoraForm"

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: (id: string) => void
}

export function CreateCorretoraModal({ open, onClose, onSuccess }: Props) {
  return (
    <Modal
      title="Criar Nova Corretora"
      open={open}
      onClose={onClose}
      size="xlarge">
      <CreateCorretoraForm onSuccess={onSuccess} isModal />
    </Modal>
  )
}
