export function normalizeDecimals(
  input: HTMLInputElement,
  decimals: number = 2
): void {
  const cursorPos = input.selectionStart
  const oldValue = input.value

  let formatted = oldValue.replace(/[^\d.,]/g, "")

  const separator = formatted.includes(",") ? "," : "."
  const parts = formatted.split(separator)

  if (parts[1] && parts[1].length > decimals) {
    formatted = parts[0] + separator + parts[1].slice(0, decimals)
  }

  input.value = formatted

  if (oldValue.length === formatted.length && cursorPos) {
    input.setSelectionRange(cursorPos, cursorPos)
  }
}
