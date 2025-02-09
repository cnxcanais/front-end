import { getUserById } from "@/modules/user-components/edit-user/infra/remote"
import { useQuery } from "@tanstack/react-query"

export function useGetUserByIdQuery(user_id: string) {
  return useQuery({
    queryKey: ["user", user_id],
    queryFn: () => getUserById(user_id),
    enabled: user_id !== "",
  })
}
