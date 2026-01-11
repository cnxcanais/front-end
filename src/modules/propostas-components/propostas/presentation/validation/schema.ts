import { SituacaoEnum } from "@/modules/propostas-components/types/enums"
import { z } from "zod"

const parcelaSchema = z.object({
  numeroParcela: z.number().min(1, "Número da parcela é obrigatório"),
  dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  valor: z.number(),
  valorLiquido: z.number().nullable(),
  percentualCorretora: z.preprocess(
    (val) =>
      val === "" || val === null || (typeof val === "number" && isNaN(val)) ?
        null
      : val,
    z
      .number()
      .min(0, "Percentual deve ser maior ou igual a 0")
      .max(100, "Percentual deve ser menor ou igual a 100")
      .nullable()
      .optional()
  ),
  previsaoPagamento: z.string().min(1, "Previsão de recebimento é obrigatória"),
  situacao: z.string().min(1, "Situação é obrigatória"),
})

const repasseSchema = z.object({
  produtorId: z.string().min(1, "Produtor é obrigatório"),
  percentualRepasse: z
    .number({
      invalid_type_error: "Percentual de repasse deve ser um número válido",
    })
    .min(0, "Percentual deve ser maior ou igual a 0")
    .max(100, "Percentual deve ser menor ou igual a 100")
    .nullable(),
  repasseSobre: z.enum(
    ["Premio Liquido", "Comissão da Corretora", "Valor Fixo"],
    {
      errorMap: () => ({ message: "Repasse sobre é obrigatório" }),
    }
  ),
  formaRepasse: z.enum(
    [
      "No recebimento",
      "Antecipado 1a parcela",
      "Antecipado parcela",
      "Antecipado emissão",
    ],
    {
      errorMap: () => ({ message: "Forma de repasse é obrigatória" }),
    }
  ),
})

export const propostaFormSchema = z
  .object({
    numeroProposta: z
      .string()
      .min(1, "Número da proposta é obrigatório")
      .max(40, "Máximo de 40 caracteres"),
    seguradoId: z.string().min(1, "Segurado é obrigatório"),
    corretoraId: z.string().min(1, "Corretora é obrigatória"),
    produtorId: z.string().min(1, "Produtor é obrigatório"),
    seguradoraId: z.string().min(1, "Seguradora é obrigatória"),
    ramoId: z.string().min(1, "Ramo é obrigatório"),
    produtoId: z.string().optional(),
    tomadorId: z.string().nullable().optional(),
    placaVeiculo: z.string().nullable().optional(),
    chassiVeiculo: z.string().nullable().optional(),
    modeloVeiculo: z.string().nullable().optional(),
    marcaVeiculo: z.string().nullable().optional(),
    anoFabricacaoVeiculo: z.number().nullable().optional(),
    anoModeloVeiculo: z.number().nullable().optional(),
    complementoItem: z.string().nullable().optional(),
    propostaOriginalId: z.string().nullable().optional(),
    tipoDocumento: z.enum(["Proposta", "Apólice", "Renovação", "Endosso"], {
      errorMap: () => ({ message: "Tipo de documento é obrigatório" }),
    }),
    origem: z.enum(["Manual", "Importação", "Integração"], {
      errorMap: () => ({ message: "Origem é obrigatória" }),
    }),
    situacao: z.nativeEnum(SituacaoEnum),
    observacoes: z.string().nullable().optional(),
    inicioVigencia: z.string().min(1, "Início da vigência é obrigatório"),
    fimVigencia: z.string().min(1, "Fim da vigência é obrigatório"),
    dataEmissao: z.string().optional(),
    dataCancelamento: z.string().optional(),
    motivoCancelamento: z.string().optional(),
    numeroApolice: z.string().nullable().optional(),
    motivoNaoRenovacao: z.string().nullable().optional(),
    percentualComissao: z
      .number({
        invalid_type_error: "Percentual de comissão deve ser um número válido",
      })
      .min(-100, "Percentual deve ser maior ou igual a -100")
      .max(100, "Percentual deve ser menor ou igual a 100")
      .nullable(),
    comissaoSobre: z.enum(
      ["Premio Liquido", "Premio Comercial", "Premio Total"],
      {
        errorMap: () => ({ message: "Comissão sobre é obrigatória" }),
      }
    ),
    formaComissao: z.enum(["Na Parcela", "Antecipado", "Recorrencia"], {
      errorMap: () => ({ message: "Forma de comissão é obrigatória" }),
    }),
    valorComissao: z
      .number({
        invalid_type_error: "Valor de comissão deve ser um número válido",
      })
      .nullable(),
    premioLiquido: z
      .number({
        invalid_type_error: "Prêmio líquido deve ser um número válido",
      })
      .nullable(),
    valoresAdicionais: z.number().nullable().optional(),
    iof: z.number().nullable().optional(),
    parcelas: z.array(parcelaSchema),
    repasses: z.array(repasseSchema),
  })
  .refine(
    (data) => {
      return data.tomadorId !== data.produtorId
    },
    {
      message: "Tomador não pode ser o mesmo que o produtor",
      path: ["tomadorId"],
    }
  )
  .refine(
    (data) => {
      if (data.parcelas.length === 0) return true
      const premioTotal =
        (data.premioLiquido || 0) +
        (data.valoresAdicionais || 0) +
        (data.iof || 0)
      const totalParcelas = data.parcelas.reduce(
        (acc, parcela) => acc + (parcela.valor || 0),
        0
      )
      return Math.abs(premioTotal - totalParcelas) < 0.01
    },
    {
      message: "A soma dos valores das parcelas deve ser igual ao prêmio total",
    }
  )

export type PropostaFormSchema = z.infer<typeof propostaFormSchema>
