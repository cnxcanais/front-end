export function formatPhoneNumber(phone: string) {
  if (!phone) return ""
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, "")

  // Check for 0800 numbers (10 digits starting with 0800)
  if (digits.startsWith("0800") && digits.length === 10) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`
  }

  // Limit to 11 digits for regular numbers
  const limitedDigits = digits.slice(0, 11)

  // Format based on digit count
  if (limitedDigits.length <= 2) {
    return limitedDigits.length > 0 ? `(${limitedDigits}` : ""
  }

  if (limitedDigits.length <= 6) {
    return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2)}`
  }

  if (limitedDigits.length <= 10) {
    return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 6)}-${limitedDigits.slice(6)}`
  }

  // 11 digits - mobile
  return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 7)}-${limitedDigits.slice(7)}`
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
