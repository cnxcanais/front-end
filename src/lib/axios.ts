import axios from "axios"
import { getCookie } from "./cookies"

function getUpdatedToken() {
  return getCookie("token")
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${getUpdatedToken()}`,
  },
})

api.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${getUpdatedToken()}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const cepApi = axios.create({
  baseURL: "https://viacep.com.br/ws",
})

export { api, cepApi }
