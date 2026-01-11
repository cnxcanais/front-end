import { Modal } from "@/core/components/Modals/Modal"
import { CreateProdutoForm } from "@/modules/produtos-components/create-produtos/presentation/components/CreateProdutoForm"

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: (id: string) => void
}

export function CreateProdutoModal({ open, onClose, onSuccess }: Props) {
  return (
    <Modal
      title="Criar Novo Produto"
      open={open}
      onClose={onClose}
      size="xlarge">
      <CreateProdutoForm onSuccess={onSuccess} isModal />
    </Modal>
  )
}
