import { Proposta } from "@/@types/proposta"
import * as Input from "@/core/components/Input"
import dynamic from "next/dynamic"
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form"
import { PropostaFormSchema } from "../../validation/schema"

interface ApoliceEndossoTabProps {
  register: UseFormRegister<PropostaFormSchema>
  errors: FieldErrors<PropostaFormSchema>
  control: Control<PropostaFormSchema>
  proposta: Proposta
  readOnly?: boolean
  isEndosso: boolean
}

import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

export function ApoliceEndossoTab({
  register,
  errors,
  control,
  proposta,
  readOnly,
  isEndosso,
}: ApoliceEndossoTabProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>Data de Emissão</label>
        <Input.Root className="mt-2">
          <Input.Control
            type="date"
            {...register("dataEmissao")}
            disabled={readOnly}
          />
        </Input.Root>
        {errors.dataEmissao && (
          <span className="text-xs text-red-500">
            {errors.dataEmissao.message}
          </span>
        )}
      </div>
      <div>
        <label>Número da Apólice</label>
        <Input.Root className="mt-2">
          <Input.Control
            {...register("numeroApolice")}
            disabled={readOnly || isEndosso}
          />
        </Input.Root>
        {errors.numeroApolice && (
          <span className="text-xs text-red-500">
            {errors.numeroApolice.message}
          </span>
        )}
      </div>

      {proposta?.produtoRenovavel && (
        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-semibold">Observações</h3>
          <Controller
            name="motivoNaoRenovacao"
            control={control}
            render={({ field }) => (
              <div className="bg-white">
                <ReactQuill
                  theme="snow"
                  value={field.value || ""}
                  onChange={field.onChange}
                  readOnly={readOnly}
                />
              </div>
            )}
          />
        </div>
      )}
    </div>
  )
}
