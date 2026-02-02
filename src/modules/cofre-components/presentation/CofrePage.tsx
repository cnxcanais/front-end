"use client"

import { Seguradora } from "@/@types/seguradora"
import { Button } from "@/core/components/Button"
import { SelectInput } from "@/core/components/SelectInput"
import { useSeguradoraQuery } from "@/modules/seguradoras-components/seguradora/infra/hooks/use-seguradora-query"
import { Copy, Eye, Pencil, Trash } from "@phosphor-icons/react"
import { useState } from "react"
import { toast } from "sonner"
import {
  useCreateCredentialMutation,
  useCredentialsBySeguradoraQuery,
  useDeleteCredentialMutation,
  useRequestDeleteOTPMutation,
  useRequestEditOTPMutation,
  useRequestViewOTPMutation,
  useUpdateCredentialMutation,
  useViewCredentialMutation,
} from "../infra/hooks"
import { CredentialModal } from "./components/CredentialModal"
import { OTPModal } from "./components/OTPModal"

export function CofrePage() {
  const [selectedSeguradora, setSelectedSeguradora] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [modalState, setModalState] = useState({
    credential: { open: false, data: null as any },
    otp: { open: false, action: "", credentialId: "" },
    viewPassword: { open: false, password: "" },
  })

  const { data: seguradoras } = useSeguradoraQuery(1, -1, {})
  const { data: credentials, refetch } =
    useCredentialsBySeguradoraQuery(selectedSeguradora)

  const createMutation = useCreateCredentialMutation()
  const requestViewOTPMutation = useRequestViewOTPMutation()
  const viewCredentialMutation = useViewCredentialMutation()
  const requestEditOTPMutation = useRequestEditOTPMutation()
  const updateMutation = useUpdateCredentialMutation()
  const requestDeleteOTPMutation = useRequestDeleteOTPMutation()
  const deleteMutation = useDeleteCredentialMutation()

  const filteredCredentials =
    credentials?.credentials?.filter(
      (c: any) =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.host?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  const handleCreateCredential = (data: any) => {
    createMutation.mutate(
      { ...data, seguradoraId: selectedSeguradora },
      {
        onSuccess: () => {
          setModalState({
            ...modalState,
            credential: { open: false, data: null },
          })
          refetch()
        },
      }
    )
  }

  const handleRequestView = (credentialId: string) => {
    requestViewOTPMutation.mutate(credentialId, {
      onSuccess: () => {
        setModalState({
          ...modalState,
          otp: { open: true, action: "view", credentialId },
        })
      },
    })
  }

  const handleVerifyViewOTP = (otpCode: string) => {
    viewCredentialMutation.mutate(
      { credentialId: modalState.otp.credentialId, otpCode },
      {
        onSuccess: (data) => {
          setModalState({
            ...modalState,
            otp: { open: false, action: "", credentialId: "" },
            viewPassword: { open: true, password: data.credential.senha },
          })
        },
      }
    )
  }

  const handleCopyPassword = (credentialId: string) => {
    requestViewOTPMutation.mutate(credentialId, {
      onSuccess: () => {
        setModalState({
          ...modalState,
          otp: { open: true, action: "copy", credentialId },
        })
      },
    })
  }

  const handleVerifyCopyOTP = (otpCode: string) => {
    viewCredentialMutation.mutate(
      { credentialId: modalState.otp.credentialId, otpCode },
      {
        onSuccess: (data) => {
          navigator.clipboard.writeText(data.credential.senha)
          toast.success("Senha copiada para a área de transferência")
          setModalState({
            ...modalState,
            otp: { open: false, action: "", credentialId: "" },
          })
        },
      }
    )
  }

  const handleRequestEdit = (credential: any) => {
    requestEditOTPMutation.mutate(credential.id, {
      onSuccess: () => {
        setModalState({
          ...modalState,
          credential: { open: true, data: credential },
          otp: { open: true, action: "edit", credentialId: credential.id },
        })
      },
    })
  }

  const handleVerifyEditOTP = (otpCode: string) => {
    const data = modalState.credential.data
    updateMutation.mutate(
      {
        credentialId: modalState.otp.credentialId,
        data: { otpCode, ...data },
      },
      {
        onSuccess: () => {
          setModalState({
            ...modalState,
            credential: { open: false, data: null },
            otp: { open: false, action: "", credentialId: "" },
          })
          refetch()
        },
      }
    )
  }

  const handleRequestDelete = (credentialId: string) => {
    requestDeleteOTPMutation.mutate(credentialId, {
      onSuccess: () => {
        setModalState({
          ...modalState,
          otp: { open: true, action: "delete", credentialId },
        })
      },
    })
  }

  const handleVerifyDeleteOTP = (otpCode: string) => {
    deleteMutation.mutate(
      { credentialId: modalState.otp.credentialId, otpCode },
      {
        onSuccess: () => {
          setModalState({
            ...modalState,
            otp: { open: false, action: "", credentialId: "" },
          })
          refetch()
        },
      }
    )
  }

  const handleOTPConfirm = (otpCode: string) => {
    switch (modalState.otp.action) {
      case "view":
        handleVerifyViewOTP(otpCode)
        break
      case "copy":
        handleVerifyCopyOTP(otpCode)
        break
      case "edit":
        handleVerifyEditOTP(otpCode)
        break
      case "delete":
        handleVerifyDeleteOTP(otpCode)
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <SelectInput
              label="Seguradora *"
              value={selectedSeguradora}
              onChange={(e) => setSelectedSeguradora(e.target.value)}
              field_name="seguradoraId"
              options={
                seguradoras?.data.map((s: Seguradora.Type) => ({
                  text: s.razaoSocial,
                  value: s.id,
                })) || []
              }
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() =>
                setModalState({
                  ...modalState,
                  credential: { open: true, data: null },
                })
              }
              disabled={!selectedSeguradora}>
              + Nova Credencial
            </Button>
          </div>
        </div>

        {!selectedSeguradora ?
          <div className="py-12 text-center text-gray-500">
            Selecione uma seguradora para visualizar suas credenciais.
          </div>
        : <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por nome, usuário ou host..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2"
              />
            </div>

            {filteredCredentials.length === 0 ?
              <div className="py-12 text-center text-gray-500">
                Nenhuma credencial encontrada.
              </div>
            : <div className="space-y-3">
                {filteredCredentials.map((credential: any) => (
                  <div
                    key={credential.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {credential.nome}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Usuário: {credential.usuario}
                      </p>
                      {credential.host && (
                        <p className="text-sm text-gray-500">
                          {credential.host}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRequestView(credential.id)}
                        className="rounded p-2 text-blue-600 hover:bg-blue-50"
                        title="Ver senha">
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => handleCopyPassword(credential.id)}
                        className="rounded p-2 text-green-600 hover:bg-green-50"
                        title="Copiar senha">
                        <Copy size={20} />
                      </button>
                      <button
                        onClick={() => handleRequestEdit(credential)}
                        className="rounded p-2 text-orange-600 hover:bg-orange-50"
                        title="Editar">
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleRequestDelete(credential.id)}
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                        title="Excluir">
                        <Trash size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </>
        }
      </div>

      <CredentialModal
        open={modalState.credential.open && !modalState.otp.open}
        onClose={() =>
          setModalState({
            ...modalState,
            credential: { open: false, data: null },
          })
        }
        onSave={handleCreateCredential}
        initialData={modalState.credential.data}
        isLoading={createMutation.isPending}
      />

      <OTPModal
        open={modalState.otp.open}
        onClose={() =>
          setModalState({
            ...modalState,
            otp: { open: false, action: "", credentialId: "" },
          })
        }
        onConfirm={handleOTPConfirm}
        isLoading={
          viewCredentialMutation.isPending ||
          updateMutation.isPending ||
          deleteMutation.isPending
        }
      />

      {modalState.viewPassword.open && (
        <div className="bg-black/50 flex items-center justify-center">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Senha</h3>
            <div className="mb-4 rounded bg-gray-100 p-3 font-mono text-sm">
              {modalState.viewPassword.password}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(
                    modalState.viewPassword.password
                  )
                  toast.success("Senha copiada")
                }}>
                Copiar
              </Button>
              <Button
                onClick={() =>
                  setModalState({
                    ...modalState,
                    viewPassword: { open: false, password: "" },
                  })
                }>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
