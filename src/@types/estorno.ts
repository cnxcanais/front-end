export namespace Estorno {
  export type RegistroEstorno = {
    registroOriginalId: string
    valorEstorno: number
  }

  export type EstornoComissaoRequest = {
    registros: RegistroEstorno[]
    motivo: string
  }

  export type EstornoRepasseRequest = {
    registros: RegistroEstorno[]
    motivo: string
  }

  export type ReverterEstornoRequest = {
    estornoIds: string[]
    motivo: string
  }
}
