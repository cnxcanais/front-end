import axios from 'axios'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const API = axios.create({
  baseURL: `${apiUrl}`,
  
})

export default API