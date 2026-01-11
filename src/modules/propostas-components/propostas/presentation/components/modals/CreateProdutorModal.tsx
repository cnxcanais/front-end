import { Modal } from "@/core/components/Modals/Modal"
import { CreateProdutorForm } from "@/modules/produtores-components/create-produtor/presentation/components/CreateProdutorForm"

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: (id: string) => void
}

export function CreateProdutorModal({ open, onClose, onSuccess }: Props) {
  return (
    <Modal
      title="Criar Novo Produtor"
      open={open}
      onClose={onClose}
      size="xlarge">
      <CreateProdutorForm onSuccess={onSuccess} isModal />
    </Modal>
  )
}
