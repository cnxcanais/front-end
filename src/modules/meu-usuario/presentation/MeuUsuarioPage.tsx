"use client"

import { useCorretoraByIdQuery } from "@/modules/corretoras-components/edit-corretora/infra/hooks/use-corretora-by-id-query"
import { User } from "@phosphor-icons/react"
import { useRef } from "react"
import { toast } from "sonner"
import { useAvatarUrlQuery } from "../infra/hooks/use-avatar-url-query"
import { useMeQuery } from "../infra/hooks/use-me-query"
import { useUploadAvatarMutation } from "../infra/hooks/use-upload-avatar-mutation"

export function MeuUsuarioPage() {
  const { data: userData, isLoading } = useMeQuery()
  const { data: avatarData } = useAvatarUrlQuery()
  const { data: corretoraData } = useCorretoraByIdQuery(
    userData?.corretoraId || ""
  )
  const uploadAvatarMutation = useUploadAvatarMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 500 * 1024) {
      toast.error("O arquivo não pode ter mais de 500KB")
      return
    }

    uploadAvatarMutation.mutate(file)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-500">
              {avatarData?.url ?
                <img
                  src={avatarData.url}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              : <User size={64} weight="light" />}
            </div>
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
              disabled={uploadAvatarMutation.isPending}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900">
                {userData?.nome}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900">
                {userData?.email}
              </div>
            </div>

            {userData?.corretoraId && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Corretora
                </label>
                <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900">
                  {corretoraData?.razaoSocial || "Carregando..."}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Usuário
              </label>
              <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900">
                {userData?.isMaster ? "Administrador" : "Usuário"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
