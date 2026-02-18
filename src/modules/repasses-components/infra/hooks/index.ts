import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import * as remote from "../remote"

export function useRepassesQuery(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  return useQuery({
    queryKey: ["repasses", page, limit, filters],
    queryFn: () => remote.getRepasses(page, limit, filters),
  })
}

export function useRepassesByApoliceQuery(apoliceId: string) {
  return useQuery({
    queryKey: ["repasses-apolice", apoliceId],
    queryFn: () => remote.getRepassesByApolice(apoliceId),
    enabled: !!apoliceId,
  })
}

export function useUpdateRepasseValorMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, novoValor }: { id: string; novoValor: number }) =>
      remote.updateRepasseValor(id, novoValor),
    onSuccess: () => {
      toast.success("Valor do repasse atualizado")
      queryClient.invalidateQueries({ queryKey: ["repasses"] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Erro ao atualizar valor"
      toast.error(message)
    },
  })
}

export function useMarkRepasseAsPagoMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dataPagamento }: { id: string; dataPagamento: string }) =>
      remote.markRepasseAsPago(id, dataPagamento),
    onSuccess: () => {
      toast.success("Repasse marcado como pago")
      queryClient.invalidateQueries({ queryKey: ["repasses"] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Erro ao marcar como pago"
      toast.error(message)
    },
  })
}

export function useEstornarRepasseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ registros, motivo }: { registros: Array<{ registroOriginalId: string; valorEstorno: number }>; motivo: string }) =>
      remote.estornarRepasse(registros, motivo),
    onSuccess: () => {
      toast.success("Repasse estornado com sucesso")
      queryClient.invalidateQueries({ queryKey: ["repasses"] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Erro ao estornar repasse"
      toast.error(message)
    },
  })
}

export function useReverterEstornoRepasseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ estornoIds, motivo }: { estornoIds: string[]; motivo: string }) =>
      remote.reverterEstornoRepasse(estornoIds, motivo),
    onSuccess: () => {
      toast.success("Estorno revertido com sucesso")
      queryClient.invalidateQueries({ queryKey: ["repasses"] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Erro ao reverter estorno"
      toast.error(message)
    },
  })
}
