export function formatDocumentNumber(document: string) {
  if (!document) return ""

  let formattedDocument = document.replace(/\D/g, "")

  if (document.length <= 14) {
    formattedDocument = formattedDocument.replace(/(\d{3})(\d)/, "$1.$2")
    formattedDocument = formattedDocument.replace(/(\d{3})(\d)/, "$1.$2")
    formattedDocument = formattedDocument.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  } else {
    formattedDocument = formattedDocument.replace(/(\d{2})(\d)/, "$1.$2")
    formattedDocument = formattedDocument.replace(
      /^(\d{2})\.(\d{3})(\d)/,
      "$1.$2.$3"
    )
    formattedDocument = formattedDocument.replace(/\.(\d{3})(\d)/, ".$1/$2")
    formattedDocument = formattedDocument.replace(/(\d{4})(\d)/, "$1-$2")
  }

  return formattedDocument
}

export function formatStaticDocument(document: string) {
  if (!document) return ""

  let formattedDocument = document.replace(/\D/g, "")
  if (document.length === 14) {
    formattedDocument = formattedDocument.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    )
  } else {
    formattedDocument = formattedDocument.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    )
  }
  return formattedDocument
}
