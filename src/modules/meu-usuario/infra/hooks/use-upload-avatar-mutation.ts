import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { uploadAvatar } from "../remote"

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      toast.success("Avatar atualizado com sucesso")
      queryClient.invalidateQueries({ queryKey: ["me"] })
      queryClient.invalidateQueries({ queryKey: ["avatar-url"] })
    },
    onError: () => {
      toast.error("Erro ao atualizar avatar")
    },
  })
}
