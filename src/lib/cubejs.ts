import cubejs from "@cubejs-client/core"

const apiUrl = process.env.NEXT_PUBLIC_CUBEJS_API_URL

const cubeApi = cubejs(process.env.NEXT_PUBLIC_CUBEJS_TOKEN || "", {
  apiUrl: apiUrl,
})

export default cubeApi
