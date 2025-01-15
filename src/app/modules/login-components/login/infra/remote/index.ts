import API from "@/app/core/utils/axios";

type Props = {
  email: string;
  password: string;
}

export const fetchLogin = async ({email, password}: Props) => {
  const responseBody = await API.post('/auth/login', {
    email,
    password
  })

  return responseBody.data
}