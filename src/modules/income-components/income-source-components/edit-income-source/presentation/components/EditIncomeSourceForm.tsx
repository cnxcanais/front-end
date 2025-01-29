"use client"

import { IncomeSource } from "@/@types/income-sources"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { getCookie } from "@/lib/cookies"
import {
  editIncomeSource,
  getIncomeSourceById,
} from "@/modules/income-components/income-source-components/edit-income-source/infra/remote"
import {
  EditIncomeSourceSchema,
  editIncomeSourceFormSchema,
} from "@/modules/income-components/income-source-components/edit-income-source/presentation/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditIncomeSourceForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: incomeSource, isLoading } = useQuery({
    queryKey: ["income-source", id],
    queryFn: () => getIncomeSourceById({ income_source_id: id }),
    enabled: id !== "",
    refetchOnWindowFocus: false,
  })

  const {
    income_source_input_fields_name,
    income_source_input_fields_email,
    income_source_input_fields_cpf_cnpj,
    income_source_input_fields_phone,
    income_source_input_fields_contact_name,
    income_source_input_fields_address_1,
    income_source_input_fields_address_2,
    income_source_input_fields_address_3,
    income_source_input_fields_state,
    income_source_input_fields_cep,
    income_source_input_fields_city,
  } = JSON.parse(getCookie("permissions")).componentAccess

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditIncomeSourceSchema>({
    resolver: zodResolver(editIncomeSourceFormSchema),
    values: {
      account_id: incomeSource?.account_id || "",
      name: incomeSource?.name || "",
      address_1: incomeSource?.address_1 || "",
      address_2: incomeSource?.address_2 || "",
      address_3: incomeSource?.address_3 || "",
      cpf_cnpj: incomeSource?.cpf_cnpj || "",
      cep: incomeSource?.cep || "",
      city: incomeSource?.city || "",
      contact_name: incomeSource?.contact_name || "",
      state: incomeSource?.state || "",
      phone: incomeSource?.phone || "",
      email: incomeSource?.email || "",
    },
  })

  async function onSubmit(data: IncomeSource.UpdateRequest) {
    try {
      await editIncomeSource({ income_source_id: id, ...data })
      toast.success("Fonte de receita editada com sucesso!")
      setTimeout(() => push("/income-sources"), 2000)
    } catch (error) {
      toast.error("Erro ao editar fonte de receita: " + error)
    }
  }

  if (!incomeSource || isLoading) return <LoadingScreen />

  return (
    <form
      className="mt-6 flex max-w-[1000px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-lg" htmlFor="name">
              Nome
            </label>
            <Input.Root variant={errors.name ? "error" : "primary"}>
              <Input.Control
                disabled={!income_source_input_fields_name}
                {...register("name")}
                type="text"
              />
            </Input.Root>
            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label className="text-lg" htmlFor="cpf_cnpj">
              Documento
            </label>
            <Input.Root variant={errors.cpf_cnpj ? "error" : "primary"}>
              <Input.Control
                disabled={!income_source_input_fields_cpf_cnpj}
                {...register("cpf_cnpj")}
                type="text"
              />
            </Input.Root>
            {errors.cpf_cnpj && (
              <span className="text-xs text-red-500">
                {errors.cpf_cnpj.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-lg" htmlFor="address_1">
              Contato
            </label>
            <Input.Root variant={errors.contact_name ? "error" : "primary"}>
              <Input.Control
                disabled={!income_source_input_fields_contact_name}
                {...register("contact_name")}
                type="text"
              />
            </Input.Root>
            {errors.contact_name && (
              <span className="text-xs text-red-500">
                {errors.contact_name.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label className="text-lg" htmlFor="phone">
              Telefone
            </label>
            <Input.Root variant={errors.phone ? "error" : "primary"}>
              <Input.Control
                disabled={!income_source_input_fields_phone}
                {...register("phone")}
                type="text"
              />
            </Input.Root>
            {errors.phone && (
              <span className="text-xs text-red-500">
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label className="text-lg" htmlFor="email">
              Email
            </label>
            <Input.Root variant={errors.email ? "error" : "primary"}>
              <Input.Control
                disabled={!income_source_input_fields_email}
                {...register("email")}
                type="email"
              />
            </Input.Root>
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-lg" htmlFor="city">
              Cidade
            </label>
            <Input.Root variant={errors.city ? "error" : "primary"}>
              <Input.Control
                disabled={!income_source_input_fields_city}
                {...register("city")}
                type="text"
              />
            </Input.Root>
            {errors.city && (
              <span className="text-xs text-red-500">
                {errors.city.message}
              </span>
            )}
          </div>

          <div className="flex max-w-24 flex-col gap-2">
            <label className="text-lg" htmlFor="state">
              Estado
            </label>
            <Input.Root variant={errors.state ? "error" : "primary"}>
              <Input.Control
                disabled={!income_source_input_fields_state}
                {...register("state")}
                type="state"
              />
            </Input.Root>
            {errors.state && (
              <span className="text-xs text-red-500">
                {errors.state.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg" htmlFor="cep">
              CEP
            </label>
            <Input.Root variant={errors.cep ? "error" : "primary"}>
              <Input.Control
                disabled={!income_source_input_fields_cep}
                {...register("cep")}
                type="cep"
              />
            </Input.Root>
            {errors.cep && (
              <span className="text-xs text-red-500">{errors.cep.message}</span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-lg" htmlFor="address_1">
              Endereço
            </label>
            <Input.Root variant={errors.address_1 ? "error" : "primary"}>
              <Input.Control
                disabled={!income_source_input_fields_address_1}
                {...register("address_1")}
                type="text"
              />
            </Input.Root>
            {errors.address_1 && (
              <span className="text-xs text-red-500">
                {errors.address_1.message}
              </span>
            )}
          </div>

          <div className="flex max-w-24 flex-col gap-2">
            <label className="text-lg" htmlFor="address_2">
              Número
            </label>
            <Input.Root variant="primary">
              <Input.Control
                disabled={!income_source_input_fields_address_2}
                {...register("address_2")}
                type="address_2"
              />
            </Input.Root>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg" htmlFor="address_3">
              Complemento
            </label>
            <Input.Root variant="primary">
              <Input.Control
                disabled={!income_source_input_fields_address_3}
                {...register("address_3")}
                type="address_3"
              />
            </Input.Root>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/income-sources")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
