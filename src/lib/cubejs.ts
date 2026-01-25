import cubejs from "@cubejs-client/core"

const cubeApi = cubejs(process.env.NEXT_PUBLIC_CUBEJS_TOKEN || "", {
  apiUrl: process.env.NEXT_PUBLIC_CUBEJS_API_URL,
})

export default cubeApi
