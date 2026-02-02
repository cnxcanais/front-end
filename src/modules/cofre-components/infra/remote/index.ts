import { bffApi } from "@/lib/axios"

export async function createCredential(data: {
  seguradoraId: string
  nome: string
  usuario: string
  senha: string
  host: string
  observacoes?: string
}) {
  const response = await bffApi.post("/vault/credentials", data)
  return response.data
}

export async function getCredentialsBySeguradora(seguradoraId: string) {
  const response = await bffApi.get(`/vault/credentials/seguradora/${seguradoraId}`)
  return response.data
}

export async function requestViewOTP(credentialId: string) {
  const response = await bffApi.post(`/vault/credentials/${credentialId}/otp/view`)
  return response.data
}

export async function viewCredential(credentialId: string, otpCode: string) {
  const response = await bffApi.post(`/vault/credentials/${credentialId}/view`, { otpCode })
  return response.data
}

export async function requestEditOTP(credentialId: string) {
  const response = await bffApi.post(`/vault/credentials/${credentialId}/otp/edit`)
  return response.data
}

export async function updateCredential(credentialId: string, data: {
  otpCode: string
  nome?: string
  usuario?: string
  senha?: string
  host?: string
  observacoes?: string
}) {
  const response = await bffApi.put(`/vault/credentials/${credentialId}`, data)
  return response.data
}

export async function requestDeleteOTP(credentialId: string) {
  const response = await bffApi.post(`/vault/credentials/${credentialId}/otp/delete`)
  return response.data
}

export async function deleteCredential(credentialId: string, otpCode: string) {
  const response = await bffApi.delete(`/vault/credentials/${credentialId}`, {
    data: { otpCode }
  })
  return response.data
}
