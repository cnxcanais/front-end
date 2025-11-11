import { Seguradora } from "@/@types/seguradora"
import { http, HttpResponse } from "msw"

const BFF_API = process.env.NEXT_PUBLIC_BFF_API_URL

console.log("BFF_API URL:", BFF_API)

const mockSeguradoras: Seguradora.GetResponse = {
  data: [
    {
      id: "cad75056-cc8a-4b22-8b6b-62c8ccb01028",
      razaoSocial: "Nova Seguradora Mesmo CNPJ",
      cnpj: "11222333000181",
      cnpjFormatado: "11.222.333/0001-81",
      codigoSusep: "DEL002",
      cep: "01310100",
      cepFormatado: "01310-100",
      endereco: "Rua Nova",
      numero: "200",
      bairro: "Bairro",
      cidade: "Cidade",
      uf: "SP",
      enderecoCompleto: "Rua Nova, 200, Bairro, Cidade, SP, 01310-100",
      createdAt: "2025-11-07T01:29:45.591Z",
      updatedAt: "2025-11-07T01:29:45.591Z",
    },
  ],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
}

export const seguradorasHandlers = [
  http.get(`${BFF_API}/seguradoras`, ({ request }) => {
    console.log("MSW intercepted request to:", request.url)
    return HttpResponse.json(mockSeguradoras)
  }),

  http.get(`${BFF_API}/seguradoras/:id`, ({ request }) => {
    console.log(`MSW intercepted GET request for seguradora by id`)
    return HttpResponse.json(mockSeguradoras.data[0])
  }),

  http.delete(`${BFF_API}/seguradoras/:id`, ({ request }) => {
    console.log(`MSW intercepted DELETE request for seguradora ID`)
    return HttpResponse.json({ message: `Seguradora deletada.` })
  }),

  http.post(`${BFF_API}/seguradoras`, ({ request }) => {
    console.log(`MSW intercepted POST request to create seguradora`)
    return HttpResponse.json({ message: `Seguradora criada com sucesso.` })
  }),

  http.put(`${BFF_API}/seguradoras/:id`, ({ request }) => {
    return HttpResponse.json({ message: `Seguradora atualizada com sucesso.` })
  }),
]
