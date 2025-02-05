import { SearchArray } from "@/@types/search-array"

export interface ArrayConfig<T> {
  fetchFn: (account_id: string) => Promise<T[]>
  mapFn: (item: T) => { label: string; value: string }
  setState: (value: SearchArray) => void
}

export const populateArrays = async <T extends Record<string, any>>(
  configs: ArrayConfig<T>[],
  account_id: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  try {
    const responses = await Promise.all(
      configs.map(({ fetchFn }) => fetchFn(account_id))
    )

    responses.forEach((response, index) => {
      const { mapFn, setState } = configs[index]
      const mappedArray = response.map(mapFn)
      setState(mappedArray)
    })

    onSuccess?.()
  } catch (error) {
    onError?.(error as Error)
  }
}
