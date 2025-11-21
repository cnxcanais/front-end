import { Button } from "../Button"
import { Modal } from "../Modals/Modal"

interface MapModalProps {
  open: boolean
  onClose: () => void
  address: string
}

export function MapModal({ open, onClose, address }: MapModalProps) {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`

  return (
    <Modal title="Localização no Mapa" open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">{address}</p>
        <iframe
          src={mapUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="flex justify-end">
          <Button onClick={onClose} variant="secondary" className="w-auto px-4 py-2">
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
