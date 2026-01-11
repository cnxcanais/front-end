"use client"

import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { Dispatch, SetStateAction } from "react"

type Props = {
  numParcelasInput: string
  dataPrimeiroVencimento: string
  diaVencimentoDemaisParcelas: string
  percentualComissaoInput: string
  numParcelasComComissao: string
  numParcelasAgenciadas: string
  percentualAgenciamento: string
  setNumParcelasInput: Dispatch<SetStateAction<string>>
  setDataPrimeiroVencimento: Dispatch<SetStateAction<string>>
  setDiaVencimentoDemaisParcelas: Dispatch<SetStateAction<string>>
  setPercentualComissaoInput: Dispatch<SetStateAction<string>>
  setNumParcelasComComissao: Dispatch<SetStateAction<string>>
  setNumParcelasAgenciadas: Dispatch<SetStateAction<string>>
  setPercentualAgenciamento: Dispatch<SetStateAction<string>>
  setShowParcelasModal: Dispatch<SetStateAction<boolean>>
  handleGenerateParcelas: () => void
}

export function ParcelasModal({
  numParcelasInput,
  setNumParcelasInput,
  setShowParcelasModal,
  handleGenerateParcelas,
  dataPrimeiroVencimento,
  setDataPrimeiroVencimento,
  diaVencimentoDemaisParcelas,
  setDiaVencimentoDemaisParcelas,
  percentualComissaoInput,
  setPercentualComissaoInput,
  numParcelasComComissao,
  setNumParcelasComComissao,
  numParcelasAgenciadas,
  setNumParcelasAgenciadas,
  percentualAgenciamento,
  setPercentualAgenciamento,
}: Props) {
  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold">Gerar Parcelas</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Quantidade de parcelas
            </label>
            <Input.Root className="mt-2">
              <Input.Control
                type="number"
                min="1"
                value={numParcelasInput}
                onChange={(e) => setNumParcelasInput(e.target.value)}
                placeholder="Digite o número de parcelas"
                autoFocus
              />
            </Input.Root>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Vencimento da primeira parcela
            </label>
            <Input.Root className="mt-2">
              <Input.Control
                type="date"
                value={dataPrimeiroVencimento}
                onChange={(e) => setDataPrimeiroVencimento(e.target.value)}
              />
            </Input.Root>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Dia de vencimento das demais parcelas
            </label>
            <Input.Root className="mt-2">
              <Input.Control
                type="number"
                min="1"
                max="31"
                value={diaVencimentoDemaisParcelas}
                onChange={(e) => setDiaVencimentoDemaisParcelas(e.target.value)}
                placeholder="Digite o dia (1-31)"
              />
            </Input.Root>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              % Comissão (opcional)
            </label>
            <Input.Root className="mt-2">
              <Input.Control
                type="number"
                step="0.01"
                value={percentualComissaoInput}
                onChange={(e) => setPercentualComissaoInput(e.target.value)}
                placeholder="Digite o percentual"
              />
            </Input.Root>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Qtd. parcelas com comissão (opcional)
            </label>
            <Input.Root className="mt-2">
              <Input.Control
                type="number"
                min="1"
                value={numParcelasComComissao}
                onChange={(e) => setNumParcelasComComissao(e.target.value)}
                placeholder="Deixe em branco para todas"
              />
            </Input.Root>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Qtd. parcelas agenciadas (opcional)
            </label>
            <Input.Root className="mt-2">
              <Input.Control
                type="number"
                min="1"
                value={numParcelasAgenciadas}
                onChange={(e) => setNumParcelasAgenciadas(e.target.value)}
                placeholder="Parcelas com agenciamento"
              />
            </Input.Root>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              % Agenciamento total (opcional)
            </label>
            <Input.Root className="mt-2">
              <Input.Control
                type="number"
                step="0.01"
                value={percentualAgenciamento}
                onChange={(e) => setPercentualAgenciamento(e.target.value)}
                placeholder="Total de agenciamento"
              />
            </Input.Root>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setShowParcelasModal(false)
              setNumParcelasInput("")
            }}>
            Cancelar
          </Button>
          <Button onClick={handleGenerateParcelas}>Gerar</Button>
        </div>
      </div>
    </div>
  )
}
