export namespace IncomeDetails {
  export type GetResponse = {
    incomeDetails:
      | {
          income_details_id: string
          observation: string
          amount: string
          part: number
          due_date: Date
          is_paid: boolean
          bank_account_id: string
          income_id: string
          account_id: string
        }[]
      | []
  }
}
