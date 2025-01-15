import { api } from '@/lib/axios'

type AuthProps = {
  email: string
  password: string
}

export const authenticate = async ({ email, password }: AuthProps) => {
  const responseBody = await api.post('/auth/login', {
    email,
    password,
  })

  return responseBody.data
}
