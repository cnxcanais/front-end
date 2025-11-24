import { z } from "zod"

export const editProdutorFormSchema = z
  .object({
    nome: z
      .string()
      .nonempty({ message: "Obrigatório" })
      .max(255, { message: "Campo deve ter no máximo 100 caracteres" }),
    situacao: z
      .string()
      .nonempty({ message: "Obrigatório" })
      .max(20, { message: "Campo deve ter no máximo 20 caracteres" }),
    homePage: z
      .string()
      .max(255, { message: "Campo deve ter no máximo 255 caracteres" })
      .optional(),
    telefoneComercial: z.string().optional(),
    contaContabil: z
      .string()
      .max(50, { message: "Campo deve ter no máximo 50 caracteres" })
      .optional(),
    repasseSobre: z
      .string()
      .max(50, { message: "Campo deve ter no máximo 50 caracteres" })
      .optional(),
    excluirRepasse: z.boolean(),
    telefoneFixo: z.string().optional(),
    telefoneCelular: z.string().nonempty({ message: "Obrigatório" }),
    email: z
      .string()
      .email({ message: "Email inválido" })
      .max(100, { message: "Campo deve ter no máximo 100 caracteres" }),
    cep: z.string().nonempty({ message: "Obrigatório" }),
    logradouro: z
      .string()
      .nonempty({ message: "Obrigatório" })
      .max(255, { message: "Campo deve ter no máximo 255 caracteres" }),
    numero: z
      .string()
      .nonempty({ message: "Obrigatório" })
      .max(10, { message: "Campo deve ter no máximo 10 caracteres" }),
    complemento: z
      .string()
      .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
      .optional(),
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
    banco: z
      .string()
      .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
      .optional(),
    agencia: z
      .string()
      .max(10, { message: "Campo deve ter no máximo 100 caracteres" })
      .optional(),
    conta: z
      .string()
      .max(20, { message: "Campo deve ter no máximo 20 caracteres" })
      .optional(),
    tipoConta: z
      .string()
      .max(20, { message: "Campo deve ter no máximo 20 caracteres" })
      .optional(),
    digitoConta: z
      .string()
      .max(2, { message: "Campo deve ter no máximo 2 caracteres" })
      .optional(),
    pix: z
      .string()
      .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
      .optional(),
    tipoRepasse: z
      .string()
      .max(20, { message: "Campo deve ter no máximo 20 caracteres" })
      .optional(),
    formaRepasse: z
      .string()
      .max(20, { message: "Campo deve ter no máximo 20 caracteres" })
      .optional(),
    percentualImposto: z
      .string()
      .transform((val) => val.replace(",", "."))
      .pipe(
        z.coerce
          .number()
          .min(0)
          .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
          .optional()
      ),
    primeiraRepasse: z
      .string()
      .transform((val) => val.replace(",", "."))
      .pipe(
        z.coerce
          .number()
          .min(0)
          .max(100, { message: "Campo deve ter no máximo 100 caracteres" })
          .optional()
      ),
    grupos: z
      .string()
      .max(255, { message: "Campo deve ter no máximo 255 caracteres" })
      .optional(),
    lgpdConsentimento: z.boolean(),
    observacoes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.banco || data.banco.trim() === "") {
        return true
      }
      const hasAgenciaAndConta =
        (data.agencia?.trim() || "") !== "" && (data.conta?.trim() || "") !== ""
      const hasPix = (data.pix?.trim() || "") !== ""
      return hasAgenciaAndConta || hasPix
    },
    {
      message: "Obrigatório junto a banco",
      path: ["agencia", "conta", "pix"],
    }
  )
  .refine(
    (data) => {
      const hasAgenciaAndConta =
        (data.agencia?.trim() || "") !== "" && (data.conta?.trim() || "") !== ""
      if (hasAgenciaAndConta) {
        return data.banco || data.banco.trim() !== ""
      }
      return true
    },
    {
      message: "Obrigatório junto a agência e conta",
      path: ["banco"],
    }
  )

  .refine(
    (data) => {
      const hasConta = (data.conta?.trim() || "") !== ""
      if (hasConta) return data.agencia || data.agencia.trim() !== ""
      return true
    },
    {
      message: "Obrigatório junto a conta",
      path: ["agencia"],
    }
  )
  .refine(
    (data) => {
      const hasAgencia = (data.agencia?.trim() || "") !== ""
      if (hasAgencia) return data.conta || data.conta.trim() !== ""
      return true
    },
    {
      message: "Obrigatório junto a agência",
      path: ["conta"],
    }
  )
  .refine(
    (data) => {
      const hasDigito = (data.digitoConta?.trim() || "") !== ""
      if (hasDigito) return data.conta || data.conta.trim() !== ""
      return true
    },
    {
      message: "Obrigatório junto a conta",
      path: ["conta"],
    }
  )
  .refine(
    (data) => {
      const hasBankData =
        (data.digitoConta?.trim() || "") !== "" ||
        (data.agencia?.trim() || "") !== "" ||
        (data.conta?.trim() || "") !== "" ||
        (data.banco?.trim() || "") !== ""
      if (hasBankData) return data.tipoConta || data.tipoConta.trim() !== ""
      return true
    },
    {
      message: "Obrigatório junto a dados bancáios",
      path: ["tipoConta"],
    }
  )
export type EditProdutorSchema = z.infer<typeof editProdutorFormSchema>
