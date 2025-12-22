export type ImportErrors = {
  totalProcessadas: number
  sucesso: number
  atualizadas: number
  ignoradas: number
  erros: number
  detalhesErros: { linha: number; mensagem: string }[]
}
