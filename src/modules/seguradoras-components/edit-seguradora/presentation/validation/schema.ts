import { z } from "zod"

export const editSeguradoraFormSchema = z.object({
  id: z.string().nonempty({ message: "Obrigatório" }),
  razaoSocial: z.string().nonempty({ message: "Obrigatório" }).max(200),
  codigoSusep: z.string().nonempty({ message: "Obrigatório" }).max(50),
  fantasia: z.string().max(100).or(z.literal("")),
  grupoEconomicoId: z.string().max(100).or(z.literal("")),
  impostoRetido: z
    .string()
    .transform((val) => val.replace(",", "."))
    .pipe(z.coerce.number().min(0).max(100))
    .or(z.literal(0)),
  habilitarJuros: z.boolean(),
  calculoDesconto: z.string().max(100).or(z.literal("")),
  calculoDescontoPadrao: z.boolean(),
  diretor: z.string().max(100).or(z.literal("")),
  gerente: z.string().max(100).or(z.literal("")),
  website: z.string().max(255).or(z.literal("")),
  email: z
    .string()
    .email({ message: "Email inválido" })
    .max(100)
    .or(z.literal("")),
  telefone: z.string().max(20).or(z.literal("")),
  telefoneSecundario: z.string().max(20).or(z.literal("")),
  telefoneAssistencia24h: z.string().max(20).or(z.literal("")),
  observacoes: z.string().or(z.literal("")),
  cep: z
    .string()
    .nonempty({ message: "Obrigatório" })
    .transform((val) => val.replace(/\D/g, ""))
    .pipe(z.string().max(9)),
  endereco: z.string().nonempty({ message: "Obrigatório" }).max(200),
  numero: z.string().nonempty({ message: "Obrigatório" }).max(10),
  bairro: z.string().nonempty({ message: "Obrigatório" }).max(100),
  cidade: z.string().nonempty({ message: "Obrigatório" }).max(100),
  uf: z.string().nonempty({ message: "Obrigatório" }).max(2),
})

export type EditSeguradoraSchema = z.infer<typeof editSeguradoraFormSchema>
