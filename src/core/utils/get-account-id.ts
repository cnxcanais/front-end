import { getCookie } from "@/lib/cookies"

export function getAccountId() {
  const accountId = getCookie("accountId")

  if (accountId) return accountId
}
