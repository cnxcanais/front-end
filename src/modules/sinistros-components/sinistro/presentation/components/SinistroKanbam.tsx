"use client"

import { Button } from "@/core/components/Button"
import { useState } from "react"
import { CreateSinistroModal } from "./modals/CreateSinistroModal"

export function SinistroKanbam() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div>
      <div className="mb-4">
        <Button onClick={() => setShowCreateModal(true)}>
          Criar Sinistro +
        </Button>
      </div>

      <CreateSinistroModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          // Refresh data here
        }}
      />
    </div>
  )
}
