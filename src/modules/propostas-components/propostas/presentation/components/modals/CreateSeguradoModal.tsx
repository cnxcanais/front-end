import { Modal } from "@/core/components/Modals/Modal"
import { CreateSeguradoForm } from "@/modules/segurados-components/create-segurado/presentation/components/CreateSeguradoForm"

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: (id: string) => void
}

export function CreateSeguradoModal({ open, onClose, onSuccess }: Props) {
  return (
    <Modal
      title="Criar Novo Segurado"
      open={open}
      onClose={onClose}
      size="xlarge">
      <CreateSeguradoForm onSuccess={onSuccess} isModal />
    </Modal>
  )
}
