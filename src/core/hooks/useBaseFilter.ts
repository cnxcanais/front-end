import { getCookie } from "@/lib/cookies"
import { useMemo } from "react"

export function useBaseFilter() {
  const isAdmin = getCookie("perfilId") === process.env.NEXT_PUBLIC_ADM_ID
  const produtorId = getCookie("produtorId")
  const corretoraId = getCookie("corretoraId")

  return useMemo(() => {
    if (isAdmin) return {}
    if (produtorId) return { produtorId, corretoraId }
    return { corretoraId }
  }, [isAdmin, produtorId, corretoraId])
}
