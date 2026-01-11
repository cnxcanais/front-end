import { Modal } from "@/core/components/Modals/Modal"
import { CreateRamoForm } from "@/modules/ramos-components/create-ramos/presentation/components/CreateRamoForm"

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: (id: string) => void
}

export function CreateRamoModal({ open, onClose, onSuccess }: Props) {
  return (
    <Modal
      title="Criar Novo Ramo"
      open={open}
      onClose={onClose}
      size="xlarge">
      <CreateRamoForm onSuccess={onSuccess} isModal />
    </Modal>
  )
}
