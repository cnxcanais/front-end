export function formatPhoneNumber(phone: string) {
  if (!phone) return ""
  // Remove any non-digit characters
  let formattedPhone = phone.replace(/\D/g, "")

  // Start formatting after 2 digits
  if (formattedPhone.length >= 2) {
    formattedPhone = `(${formattedPhone.slice(0, 2)})${formattedPhone.slice(2)}`
  }

  // Add hyphen after 7 digits for mobile numbers (11 digits total)
  if (formattedPhone.length > 7) {
    if (formattedPhone.length === 11) {
      formattedPhone = formattedPhone.replace(
        /(\(\d{2}\))(\d{5})(\d{4})/,
        "$1 $2-$3"
      )
    } else {
      // For landline numbers (10 digits total)
      formattedPhone = formattedPhone.replace(
        /(\(\d{2}\))(\d{4})(\d{4})/,
        "$1 $2-$3"
      )
    }
  }

  return formattedPhone
}

export function formatStaticPhoneNumber(phone: string) {
  if (!phone) return ""

  // Remove any non-digit characters
  let formattedPhone = phone.replace(/\D/g, "")

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
