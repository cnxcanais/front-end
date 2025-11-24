export function formatPhoneNumber(phone: string) {
  if (!phone) return ""
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, "").slice(0, 11)

  // Format based on digit count
  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : ""
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  // 11 digits - mobile
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function formatStaticPhoneNumber(phone: string) {
  if (!phone) return ""

  // Remove any non-digit characters
  let formattedPhone = phone.replace(/\D/g, "").slice(0, 11)

  // Format based on length
  if (formattedPhone.length === 11) {
    // Mobile numbers (11 digits)
    formattedPhone = formattedPhone.replace(
      /^(\d{2})(\d{5})(\d{4})/,
      "($1) $2-$3"
    )
  } else if (formattedPhone.length === 10) {
    // Landline numbers (10 digits)
    formattedPhone = formattedPhone.replace(
      /^(\d{2})(\d{4})(\d{4})/,
      "($1) $2-$3"
    )
  }

  return formattedPhone
}
