import { z } from "zod"

export const editCorretoraFormSchema = z.object({
  razaoSocial: z.string().nonempty({ message: "Obrigatório" }).max(255),
  fantasia: z.string().nonempty({ message: "Obrigatório" }).max(255),
  codigoSusep: z.string().nonempty({ message: "Obrigatório" }).max(20),
  grupoEconomicoId: z.string().max(100).optional(),
  gerente: z.string().max(100).optional(),
  contato: z.string().max(100).optional(),
  celular: z.string().max(20).optional(),
  cepFormatado: z.string().nonempty({ message: "Obrigatório" }).max(9),
  endereco: z.string().nonempty({ message: "Obrigatório" }).max(255),
  numero: z.string().nonempty({ message: "Obrigatório" }).max(10),
  complemento: z.string().max(100).optional(),
  bairro: z.string().nonempty({ message: "Obrigatório" }).max(100),
  cidade: z.string().nonempty({ message: "Obrigatório" }).max(100),
  uf: z.string().nonempty({ message: "Obrigatório" }).max(2),
  email: z
    .string()
    .email({ message: "Email inválido" })
    .max(255)
    .or(z.literal("")),
  telefone: z.string().nonempty({ message: "Obrigatório" }).max(20),
  telefoneSecundario: z.string().max(20).optional(),
  website: z
    .string()
    .url({ message: "Url inválida" })
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
  percentualImposto: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .transform((val) => val.replace(",", "."))
    .pipe(z.coerce.number().min(0).max(100)),
  observacoes: z.string().optional(),
  consentimentoLgpd: z.boolean(),
})

export type EditCorretoraSchema = z.infer<typeof editCorretoraFormSchema>
