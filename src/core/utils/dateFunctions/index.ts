export function addMonthsToDate(inputDate: Date, monthsToAdd: number) {
  if (!inputDate) return null
  if (isNaN(monthsToAdd)) return null
  const dateObject = inputDate instanceof Date ? inputDate : new Date(inputDate)
  if (isNaN(dateObject.getTime())) {
    return null
  }
  const date = new Date(
    dateObject.getFullYear(),
    dateObject.getMonth(),
    dateObject.getDate() + 1 // adjust for GMT-3
  )

  const originalDay = date.getDate()
  date.setMonth(date.getMonth() + monthsToAdd)

  if (date.getDate() !== originalDay) {
    date.setDate(0) // get last day of the month
  }

  return date
}

export function formatDate(date: Date) {
  if (date instanceof Date && !isNaN(date.getTime())) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0") // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }
  return null
}

export function formatLocalDate(date: Date) {
  if (date instanceof Date && !isNaN(date.getTime())) {
    // Create a new date object with the UTC values to prevent timezone offset
    const localDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    )

    const year = localDate.getUTCFullYear()
    const month = String(localDate.getUTCMonth() + 1).padStart(2, "0")
    const day = String(localDate.getUTCDate()).padStart(2, "0")

    return `${day}-${month}-${year}`
  }
  return null
}

export function updateMonths(date: any, monthsToAdd: number) {
  const initialDate = new Date(date)
  const futureDate = new Date(
    initialDate.setMonth(initialDate.getMonth() + Number(monthsToAdd))
  )

  return futureDate
}
