import { z } from "zod"

export const editUserFormSchema = z.object({
  name: z.string().optional(),
  password: z.string().optional(),
  email: z.string().optional(),
})

export type EditUserSchema = z.infer<typeof editUserFormSchema>
