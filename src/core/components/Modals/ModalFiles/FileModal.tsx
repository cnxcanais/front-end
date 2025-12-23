import { EntityType } from "@/@types/enums/entityType"
import { FileList } from "@/core/components/Modals/ModalFiles/FileList"
import { FileUploadQueue } from "@/core/components/Modals/ModalFiles/FileUploadQueue"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import { X } from "@phosphor-icons/react"

type FileModalProps = {
  open: boolean
  onClose: (open: boolean) => void
  entityId: string
  entityType: EntityType
  isAdmin?: boolean
}

export function FileModal({
  open,
  onClose,
  entityId,
  entityType,
  isAdmin,
}: FileModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all">
            <div className="absolute right-4 top-4">
              <button
                onClick={() => onClose(false)}
                className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <DialogTitle
              as="h3"
              className="mb-4 text-center text-lg font-semibold text-gray-900">
              Gerenciar Arquivos
            </DialogTitle>

            {isAdmin && (
              <FileUploadQueue entityId={entityId} entityType={entityType} />
            )}

            <FileList entityId={entityId} entityType={entityType} />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
