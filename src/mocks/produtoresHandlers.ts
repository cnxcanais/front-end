import { Produtor } from "@/@types/produtor"
import { http, HttpResponse } from "msw"

const BFF_API = process.env.NEXT_PUBLIC_BFF_API_URL

const mockProdutores: Produtor.GetResponse = {
  data: [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      nome: "João da Silva",
      situacao: "ATIVO",
      pessoa: "FISICA",
      cnpjCpf: "111.444.777-35",
      corretoraId: "123e4567-e89b-12d3-a456-426614174000",
      inscricaoEstadual: "123.456.789.012",
      inscricaoMunicipal: "123456",
      telefoneFixo: "(11) 3333-4444",
      telefoneCelular: "(11) 98765-4321",
      email: "joao@email.com",
      cep: "01310-100",
      logradouro: "Avenida Paulista",
      numero: "1000",
      complemento: "Apto 101",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
      observacoes: "Produtor especializado em seguros de vida",
      banco: "Banco do Brasil",
      agencia: "1234",
      conta: "12345-6",
      tipoConta: "CORRENTE",
      pix: "joao@email.com",
      tipoRepasse: "DIRETO",
      formaRepasse: "DEPOSITO",
      percentualImposto: 15,
      primeiraRepasse: 50,
      demaisRepasse: 30,
      grupos: "Grupo A, Grupo B",
      grupoProdutor: "LIDER",
      liderGrupoId: "123e4567-e89b-12d3-a456-426614174000",
      lgpdConsentimento: true,
      lgpdConsentimentoData: "2025-11-05T00:00:00.000Z",
      createdAt: "2025-11-05T00:00:00.000Z",
      updatedAt: "2025-11-05T00:00:00.000Z",
    },
  ],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
}

export const produtoresHandlers = [
  http.get("https://provisory-url.com/produtores", ({ request }) => {
    console.log("🎯 MSW intercepted produtores request:", request.url)
    return HttpResponse.json(mockProdutores)
  }),
  http.get("*/produtores", ({ request }) => {
    console.log("🎯 MSW intercepted wildcard produtores:", request.url)
    return HttpResponse.json(mockProdutores)
  }),
  http.post("https://provisory-url.com/produtores", async ({ request }) => {
    console.log("🎯 MSW intercepted POST produtores:", request.url)
    return HttpResponse.json({ message: "Produtor criado com sucesso" })
  }),
  http.post("*/produtores", async ({ request }) => {
    console.log("🎯 MSW intercepted wildcard POST produtores:", request.url)
    return HttpResponse.json({ message: "Produtor criado com sucesso" })
  }),
  http.get("https://provisory-url.com/produtores/:id", ({ request, params }) => {
    console.log("🎯 MSW intercepted GET produtor by ID:", request.url, params.id)
    return HttpResponse.json(mockProdutores.data[0])
  }),
  http.get("*/produtores/:id", ({ request, params }) => {
    console.log("🎯 MSW intercepted wildcard GET produtor by ID:", request.url, params.id)
    return HttpResponse.json(mockProdutores.data[0])
  }),
  http.put("https://provisory-url.com/produtores/:id", async ({ request, params }) => {
    console.log("🎯 MSW intercepted PUT produtores:", request.url, params.id)
    return HttpResponse.json({ message: "Produtor atualizado com sucesso" })
  }),
  http.put("*/produtores/:id", async ({ request, params }) => {
    console.log("🎯 MSW intercepted wildcard PUT produtores:", request.url, params.id)
    return HttpResponse.json({ message: "Produtor atualizado com sucesso" })
  }),
]
