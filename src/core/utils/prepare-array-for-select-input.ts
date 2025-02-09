export const prepareArrayForSelect = (
  array: Array<any>,
  label: string,
  value: string
) => {
  return [{ label: "", value: "" }].concat(
    array.map((item) => {
      return {
        label: item[label],
        value: item[value],
      }
    })
  )
}
