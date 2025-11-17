import { z } from "zod"

export const editProdutorFormSchema = z.object({
  nome: z.string().nonempty({ message: "Obrigatório" }).max(255),
  situacao: z.string().nonempty({ message: "Obrigatório" }).max(20),
  homePage: z.string().max(255).optional(),
  telefoneComercial: z.string().optional(),
  contaContabil: z.string().max(50).optional(),
  repasseSobre: z.string().max(50).optional(),
  excluirRepasse: z.boolean(),
  telefoneFixo: z.string().optional(),
  telefoneCelular: z.string().nonempty({ message: "Obrigatório" }),
  email: z.string().email({ message: "Email inválido" }).max(255),
  cep: z.string().nonempty({ message: "Obrigatório" }),
  logradouro: z.string().nonempty({ message: "Obrigatório" }).max(255),
  numero: z.string().nonempty({ message: "Obrigatório" }).max(10),
  complemento: z.string().max(100).optional(),
  bairro: z.string().nonempty({ message: "Obrigatório" }).max(100),
  cidade: z.string().nonempty({ message: "Obrigatório" }).max(100),
  uf: z.string().nonempty({ message: "Obrigatório" }).max(2),
  banco: z.string().max(100).optional(),
  agencia: z.string().max(10).optional(),
  conta: z.string().max(20).optional(),
  tipoConta: z.string().max(20).optional(),
  digitoConta: z.string().max(2).optional(),
  pix: z.string().max(100).optional(),
  tipoRepasse: z.string().max(20).optional(),
  formaRepasse: z.string().max(20).optional(),
  percentualImposto: z
    .string()
    .transform((val) => val.replace(",", "."))
    .pipe(z.coerce.number().min(0).max(100).optional()),
  primeiraRepasse: z
    .string()
    .transform((val) => val.replace(",", "."))
    .pipe(z.coerce.number().min(0).max(100).optional()),
  grupos: z.string().max(255).optional(),
  lgpdConsentimento: z.boolean(),
  observacoes: z.string().optional(),
})

export type EditProdutorSchema = z.infer<typeof editProdutorFormSchema>
