import { z } from "zod"

const parcelaSchema = z.object({
  numeroParcela: z.number().min(1, "Número da parcela é obrigatório"),
  dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  valor: z.number().min(0, "Valor deve ser maior ou igual a 0"),
  valorLiquido: z.number().min(0, "Valor líquido deve ser maior ou igual a 0"),
  percentualCorretora: z
    .number()
    .min(0, "Percentual deve ser maior ou igual a 0")
    .max(100, "Percentual deve ser menor ou igual a 100"),
  previsaoRecebimento: z.string().min(1, "Previsão de recebimento é obrigatória"),
  situacao: z.string().min(1, "Situação é obrigatória"),
})

const repasseSchema = z.object({
  produtorId: z.string().min(1, "Produtor é obrigatório"),
  percentualRepasse: z
    .number()
    .min(0, "Percentual deve ser maior ou igual a 0")
    .max(100, "Percentual deve ser menor ou igual a 100"),
  repasseSobre: z.enum(["Premio Liquido", "Comissão da Corretora", "Valor Fixo"]),
  formaRepasse: z.enum([
    "No recebimento",
    "Antecipado 1a parcela",
    "Antecipado parcela",
    "Antecipado emissão",
  ]),
})

export const propostaFormSchema = z.object({
  numeroProposta: z.string().min(1, "Número da proposta é obrigatório").max(20),
  seguradoId: z.string().min(1, "Segurado é obrigatório"),
  corretoraId: z.string().min(1, "Corretora é obrigatória"),
  produtorId: z.string().min(1, "Produtor é obrigatório"),
  seguradoraId: z.string().min(1, "Seguradora é obrigatória"),
  ramoId: z.string().min(1, "Ramo é obrigatório"),
  produtoId: z.string().optional(),
  placaVeiculo: z.string().optional(),
  chassiVeiculo: z.string().optional(),
  modeloVeiculo: z.string().optional(),
  marcaVeiculo: z.string().optional(),
  anoFabricacaoVeiculo: z.number().optional(),
  anoModeloVeiculo: z.number().optional(),
  complementoItem: z.string().optional(),
  tipoDocumento: z.enum(["Proposta", "Apólice", "Renovação", "Endosso"], {
    errorMap: () => ({ message: "Tipo de documento é obrigatório" }),
  }),
  origem: z.enum(["Manual", "Importação", "Integração"], {
    errorMap: () => ({ message: "Origem é obrigatória" }),
  }),
  situacao: z.enum(["Ativo", "Inativo"]),
  inicioVigencia: z.string().min(1, "Início da vigência é obrigatório"),
  fimVigencia: z.string().min(1, "Fim da vigência é obrigatório"),
  dataEmissao: z.string().optional(),
  numeroApolice: z.string().optional(),
  numeroEndosso: z.string().optional(),
  renovacao: z.enum(["Renovável", "Não Renovável"]).optional(),
  motivoNaoRenovacao: z.string().optional(),
  percentualComissao: z
    .number()
    .min(0, "Percentual deve ser maior ou igual a 0")
    .max(100, "Percentual deve ser menor ou igual a 100"),
  comissaoSobre: z.enum(["Premio Liquido", "Comissão da Corretora", "Valor Fixo"]),
  formaComissao: z.enum(["Na Parcela", "Antecipado", "Recorrencia"]),
  valorComissao: z.number().min(0, "Valor de comissão deve ser maior ou igual a 0"),
  premioLiquido: z.number().min(0, "Prêmio líquido deve ser maior ou igual a 0"),
  valoresAdicionais: z.number().optional(),
  iof: z.number().optional(),
  parcelas: z.array(parcelaSchema),
  repasses: z.array(repasseSchema),
})

export type PropostaFormSchema = z.infer<typeof propostaFormSchema>
