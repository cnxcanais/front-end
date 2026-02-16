import cubejs from "@cubejs-client/core"
import { getCookie } from "./cookies"

const apiUrl = process.env.NEXT_PUBLIC_CUBEJS_API_URL

function getUpdatedToken() {
  return getCookie("token")
}

const cubeApi = cubejs(process.env.NEXT_PUBLIC_CUBEJS_TOKEN || "", {
  apiUrl: apiUrl,
  headers: {
    Authorization: `Bearer ${getUpdatedToken()}`,
  },
})

export default cubeApi
