import { z } from "zod"

export const createUserFormSchema = z.object({
  name: z.string({ required_error: "Obrigatório" }),
  password: z.string().min(8, { message: "Mínimo de 8 caracteres" }),
  email: z.string().email({ message: "E-mail deve ser válido" }),
  account_id: z.string({ required_error: "Obrigatório" }),
  profile_id: z.string({ required_error: "Obrigatório" }),
})

export type CreateUserSchema = z.infer<typeof createUserFormSchema>
