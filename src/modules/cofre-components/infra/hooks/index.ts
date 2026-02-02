import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import * as remote from "../remote"

export function useCredentialsBySeguradoraQuery(seguradoraId: string) {
  return useQuery({
    queryKey: ["credentials", seguradoraId],
    queryFn: () => remote.getCredentialsBySeguradora(seguradoraId),
    enabled: !!seguradoraId,
  })
}

export function useCreateCredentialMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: remote.createCredential,
    onSuccess: () => {
      toast.success("Credencial criada com sucesso")
      queryClient.invalidateQueries({ queryKey: ["credentials"] })
    },
    onError: () => toast.error("Erro ao criar credencial"),
  })
}

export function useRequestViewOTPMutation() {
  return useMutation({
    mutationFn: remote.requestViewOTP,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Código enviado para seu e-mail")
      }
    },
    onError: () => toast.error("Erro ao enviar código"),
  })
}

export function useViewCredentialMutation() {
  return useMutation({
    mutationFn: ({ credentialId, otpCode }: { credentialId: string; otpCode: string }) =>
      remote.viewCredential(credentialId, otpCode),
    onError: () => toast.error("Código inválido ou expirado"),
  })
}

export function useRequestEditOTPMutation() {
  return useMutation({
    mutationFn: remote.requestEditOTP,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Código enviado para seu e-mail")
      }
    },
    onError: () => toast.error("Erro ao enviar código"),
  })
}

export function useUpdateCredentialMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ credentialId, data }: { credentialId: string; data: any }) =>
      remote.updateCredential(credentialId, data),
    onSuccess: () => {
      toast.success("Credencial atualizada com sucesso")
      queryClient.invalidateQueries({ queryKey: ["credentials"] })
    },
    onError: () => toast.error("Erro ao atualizar credencial"),
  })
}

export function useRequestDeleteOTPMutation() {
  return useMutation({
    mutationFn: remote.requestDeleteOTP,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Código enviado para seu e-mail")
      }
    },
    onError: () => toast.error("Erro ao enviar código"),
  })
}

export function useDeleteCredentialMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ credentialId, otpCode }: { credentialId: string; otpCode: string }) =>
      remote.deleteCredential(credentialId, otpCode),
    onSuccess: () => {
      toast.success("Credencial excluída com sucesso")
      queryClient.invalidateQueries({ queryKey: ["credentials"] })
    },
    onError: () => toast.error("Erro ao excluir credencial"),
  })
}
