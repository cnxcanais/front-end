export const prepareArrayForSelect = (
  array: Array<any>,
  label: string,
  value: string
) => {
  return array.map((item) => {
    return {
      label: item?.[label],
      value: item?.[value],
    }
  })
}
