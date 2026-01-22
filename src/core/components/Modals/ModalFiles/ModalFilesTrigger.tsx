import { EntityType } from "@/@types/enums/entityType"
import { FileModal } from "@/core/components/Modals/ModalFiles/FileModal"
import { Paperclip } from "@phosphor-icons/react"
import { useState } from "react"

type ModalFilesTrigger = {
  entityId: string
  entityType: EntityType
  isAdmin?: boolean
}

export function ModalFilesTrigger({
  entityId,
  entityType,
  isAdmin = true,
}: ModalFilesTrigger) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <FileModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        entityId={entityId}
        entityType={entityType}
        isAdmin={isAdmin}
      />
      <Paperclip
        onClick={() => setIsOpen(true)}
        className="cursor-pointer duration-300 ease-in-out hover:text-blue-500"
        size={24}
        color="#00dfa7"
      />
    </>
  )
}
