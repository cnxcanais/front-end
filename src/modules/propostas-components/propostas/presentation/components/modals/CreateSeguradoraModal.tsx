import { Modal } from "@/core/components/Modals/Modal"
import { CreateSeguradoraForm } from "@/modules/seguradoras-components/create-seguradora/presentation/components/CreateSeguradoraForm"

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: (id: string) => void
}

export function CreateSeguradoraModal({ open, onClose, onSuccess }: Props) {
  return (
    <Modal
      title="Criar Nova Seguradora"
      open={open}
      onClose={onClose}
      size="xlarge">
      <CreateSeguradoraForm onSuccess={onSuccess} isModal />
    </Modal>
  )
}
