import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  estornarComissoes,
  estornarRepasses,
  reverterEstornoComissoes,
  reverterEstornoRepasses,
} from "../remote"

export function useEstornoComissaoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: estornarComissoes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comissoes"] })
    },
  })
}

export function useReverterEstornoComissaoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reverterEstornoComissoes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comissoes"] })
    },
  })
}

export function useEstornoRepasseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: estornarRepasses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repasses"] })
    },
  })
}

export function useReverterEstornoRepasseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reverterEstornoRepasses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repasses"] })
    },
  })
}
