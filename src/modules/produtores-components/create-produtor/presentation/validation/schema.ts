import { validateCNPJ, validateCPF } from "@/core/utils/validadeDocuments"
import { z } from "zod"

export const createProdutorFormSchema = z
  .object({
    nome: z.string().nonempty({ message: "Obrigatório" }).max(255),
    situacao: z.string().nonempty({ message: "Obrigatório" }).max(20),
    pessoa: z.string().nonempty({ message: "Obrigatório" }).max(10),
    cnpjCpf: z
      .string()
      .nonempty({ message: "Obrigatório" })
      .refine(
        (value) => {
          const cleanValue = value.replace(/\D/g, "")
          if (cleanValue.length === 11) return validateCPF(cleanValue)
          if (cleanValue.length === 14) return validateCNPJ(cleanValue)
          return false
        },
        { message: "CPF/CNPJ inválido" }
      ),
    homePage: z.string().max(255).optional(),
    telefoneComercial: z.string().optional(),
    contaContabil: z.string().max(50).optional(),
    repasseSobre: z.string().max(50).optional(),
    excluirRepasse: z.boolean(),
    corretoraId: z.string().nonempty({ message: "Obrigatório" }),
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

export type CreateProdutorSchema = z.infer<typeof createProdutorFormSchema>
