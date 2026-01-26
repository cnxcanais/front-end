import cubejs from "@cubejs-client/core"

const apiUrl = process.env.NEXT_PUBLIC_CUBEJS_API_URL || ""
const formattedApiUrl = apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`

const cubeApi = cubejs(process.env.NEXT_PUBLIC_CUBEJS_TOKEN || "", {
  apiUrl: formattedApiUrl,
})

export default cubeApi
