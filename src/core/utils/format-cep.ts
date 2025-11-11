export function formatCep(cep: string): string {
  const cleaned = cep.replace(/\D/g, "")
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2-$3")
}
