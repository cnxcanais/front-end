import { getCookie } from "@/lib/cookies"
import { useQuery } from "@tanstack/react-query"

const setProfile = async () => {
  const profileId = getCookie("perfilId")

  if (!profileId) {
    throw new Error("Required cookies not found")
  }

  return profileId || null
}

export function useProfileQuery() {
  return useQuery({
    queryKey: ["profileId"],
    queryFn: setProfile,
    staleTime: Infinity,
    enabled: !!getCookie("perfilId"),
  })
}
