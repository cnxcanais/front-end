"use client"

import { useProfileQuery } from "@/modules/login-components/login/infra/hooks/use-profile-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useProfileAccess(allowedProfileId: string) {
  const router = useRouter()
  const { data: profileId } = useProfileQuery()

  useEffect(() => {
    if (profileId && profileId === allowedProfileId) {
      router.push("/unauthorized")
    }
  }, [profileId, allowedProfileId, router])
}
