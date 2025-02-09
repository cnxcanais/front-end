import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"

export type ModalProps = {
  children: React.ReactNode
  title: string
  content?: string
  open: boolean
  onClose: (open: boolean) => void
}

export function Modal({ children, content, title, onClose, open }: ModalProps) {
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
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  className="text-lg font-semibold text-gray-900">
                  {title}
                </DialogTitle>
                {content && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{content}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 sm:grid sm:grid-flow-row-dense">
              {children}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
