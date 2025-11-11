import { Corretora } from "@/@types/corretora"
import { http, HttpResponse } from "msw"

const BFF_API = process.env.NEXT_PUBLIC_BFF_API_URL

const mockCorretoras: Corretora.GetResponse = {
  data: [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      razaoSocial: "Corretora XYZ Ltda",
      nomeFantasia: "Corretora XYZ",
      cnpjCpf: "12345678000190",
      cnpjCpfFormatado: "12.345.678/0001-90",
      codigoSusep: "COR12345",
      cep: "01310100",
      cepFormatado: "01310-100",
      endereco: "Avenida Paulista",
      numero: "1000",
      complemento: "Sala 10",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
      enderecoCompleto: "Avenida Paulista, 1000, Sala 10, Bela Vista, São Paulo/SP, CEP 01310-100",
      email: "contato@corretoraxyz.com.br",
      telefone: "(11) 1234-5678",
      telefoneSecundario: "(11) 1234-5679",
      website: "https://www.corretoraxyz.com.br",
      percentualComissao: 10.5,
      observacoes: "Corretora especializada em seguros de vida",
      consentimentoLgpd: true,
      dataConsentimentoLgpd: "2024-01-15T10:30:00.000Z",
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-01-20T15:45:00.000Z",
      deletedAt: null,
    },
  ],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
}

export const corretorasHandlers = [
  http.get("https://provisory-url.com/corretoras", ({ request }) => {
    console.log("🎯 MSW intercepted corretoras request:", request.url)
    return HttpResponse.json(mockCorretoras)
  }),
  http.get("*/corretoras", ({ request }) => {
    console.log("🎯 MSW intercepted wildcard corretoras:", request.url)
    return HttpResponse.json(mockCorretoras)
  }),
  http.delete("https://provisory-url.com/corretoras/:id", ({ request, params }) => {
    console.log("🎯 MSW intercepted DELETE corretoras:", request.url, params.id)
    return HttpResponse.json({ message: "Corretora removida com sucesso" })
  }),
  http.delete("*/corretoras/:id", ({ request, params }) => {
    console.log("🎯 MSW intercepted wildcard DELETE corretoras:", request.url, params.id)
    return HttpResponse.json({ message: "Corretora removida com sucesso" })
  }),
]
