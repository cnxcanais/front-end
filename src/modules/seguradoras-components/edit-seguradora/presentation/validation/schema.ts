import { z } from "zod"

export const editSeguradoraFormSchema = z.object({
  id: z.string().nonempty({ message: "Obrigatório" }),
  razaoSocial: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(200, { message: "Campo deve ter no máximo 200 caracteres" }),
  codigoSusep: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(50, { message: "Campo deve ter no máximo 50 caracteres" }),
  fantasia: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .or(z.literal("")),
  grupoEconomicoId: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .or(z.literal("")),
  impostoRetido: z
    .string()
    .transform((val) => val.replace(",", "."))
    .pipe(
      z.coerce
        .number()
        .min(0)
        .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    )
    .or(z.literal(0)),
  habilitarJuros: z.boolean(),
  calculoDesconto: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .or(z.literal("")),
  calculoDescontoPadrao: z.boolean(),
  diretor: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .or(z.literal("")),
  gerente: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .or(z.literal("")),
  website: z
    .string()
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .refine(
      (val) => {
        if (val === "") return true
        try {
          const url = new URL(val)
          return /\.[a-z]{2,}$/i.test(url.hostname)
        } catch {
          return false
        }
      },
      { message: "Url inválida" }
    )
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Email inválido" })
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
    .or(z.literal("")),
  telefone: z
    .string()
    .max(20, { message: "Campo deve ter no máximo 20 caracteres" })
    .or(z.literal("")),
  telefoneSecundario: z
    .string()
    .max(20, { message: "Campo deve ter no máximo 20 caracteres" })
    .or(z.literal("")),
  telefoneAssistencia24h: z
    .string()
    .max(20, { message: "Campo deve ter no máximo 20 caracteres" })
    .or(z.literal("")),
  observacoes: z
    .string()
    .max(500, { message: "Campo deve ter no máximo 500 caracteres" })
    .or(z.literal("")),
  cep: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .transform((val) => val.replace(/\D/g, ""))
    .pipe(z.string().max(9)),
  endereco: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(200, { message: "Campo deve ter no máximo 200 caracteres" }),
  numero: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(10, { message: "Campo deve ter no máximo 10 caracteres" }),
  bairro: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" }),
  cidade: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(100, { message: "Campo deve ter no máximo 100 caracteres" }),
  uf: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .max(2, { message: "Campo deve ter no máximo 2 caracteres" }),
})

export type EditSeguradoraSchema = z.infer<typeof editSeguradoraFormSchema>
