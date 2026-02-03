import axios from "axios"
import { getCookie, removeCookie } from "./cookies"

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeCookie("token")
      removeCookie("userId")
      removeCookie("corretoraId")
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  }
)

const cepApi = axios.create({
  baseURL: "https://viacep.com.br/ws",
})

const bffApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BFF_API_URL,
  headers: {
    Authorization: `Bearer ${getUpdatedToken()}`,
  },
})

bffApi.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${getUpdatedToken()}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

bffApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeCookie("token")
      removeCookie("userId")
      removeCookie("corretoraId")
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  }
)

const bancosApi = axios.create({
  baseURL: "https://brasilapi.com.br/api/banks/v1",
})

export { api, bancosApi, bffApi, cepApi }
