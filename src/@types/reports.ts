export namespace Report {
  export interface CashflowGroup {
    [group_name: string]: number[]
  }

  export type Cashflow = {
    groups: CashflowGroup
    totals: number[]
    grand_total: number
  }
}
