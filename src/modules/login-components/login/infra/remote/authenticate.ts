import axios from "axios"

type AuthenticateProps = {
  email: string
  password: string
}

export async function authenticate({ email, password }: AuthenticateProps) {
  try {
    const response = await axios.post("http://localhost:3000/api/login", {
      email,
      password,
    })

    console.log(response)
  } catch (error) {
    console.error(error)
  }
}
