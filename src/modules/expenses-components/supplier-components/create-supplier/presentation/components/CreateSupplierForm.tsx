"use client"

import { Supplier } from "@/@types/suppliers"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { getAccountId } from "@/core/utils/get-account-id"
import { getPermissionByEntity } from "@/core/utils/getPermissionByEntity"
import { createSupplier } from "@/modules/expenses-components/supplier-components/create-supplier/infra/remote/create-supplier"
import {
  CreateSupplierSchema,
  createSupplierFormSchema,
} from "@/modules/expenses-components/supplier-components/create-supplier/presentation/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateSupplierForm() {
  const { push } = useRouter()

  const account_id = getAccountId()

  const supplier_input_fields_name = getPermissionByEntity(
    "supplier_input_fields_name"
  )
  const supplier_input_fields_email = getPermissionByEntity(
    "supplier_input_fields_email"
  )
  const supplier_input_fields_cpf_cnpj = getPermissionByEntity(
    "supplier_input_fields_cpf_cnpj"
  )
  const supplier_input_fields_phone = getPermissionByEntity(
    "supplier_input_fields_phone"
  )
  const supplier_input_fields_contact_name = getPermissionByEntity(
    "supplier_input_fields_contact_name"
  )
  const supplier_input_fields_address_1 = getPermissionByEntity(
    "supplier_input_fields_address_1"
  )
  const supplier_input_fields_address_2 = getPermissionByEntity(
    "supplier_input_fields_address_2"
  )
  const supplier_input_fields_address_3 = getPermissionByEntity(
    "supplier_input_fields_address_3"
  )
  const supplier_input_fields_state = getPermissionByEntity(
    "supplier_input_fields_state"
  )
  const supplier_input_fields_cep = getPermissionByEntity(
    "supplier_input_fields_cep"
  )
  const supplier_input_fields_city = getPermissionByEntity(
    "supplier_input_fields_city"
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateSupplierSchema>({
    resolver: zodResolver(createSupplierFormSchema),
    values: {
      account_id,
    },
  })

  async function onSubmit(data: Supplier.CreateRequest) {
    try {
      const response = await createSupplier(data)
      toast.success(response)
      setTimeout(() => push("/suppliers"), 2000)
    } catch (error) {
      toast.error("Erro ao criar fonte de receita: " + error)
    }
  }

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
                disabled={!supplier_input_fields_name}
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
                disabled={!supplier_input_fields_cpf_cnpj}
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
                disabled={!supplier_input_fields_contact_name}
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
                disabled={!supplier_input_fields_phone}
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
                disabled={!supplier_input_fields_email}
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
                disabled={!supplier_input_fields_city}
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

          <div className="flex flex-col gap-2">
            <label className="text-lg" htmlFor="state">
              Estado
            </label>
            <Input.Root variant={errors.state ? "error" : "primary"}>
              <Input.Control
                disabled={!supplier_input_fields_state}
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
                disabled={!supplier_input_fields_cep}
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
                disabled={!supplier_input_fields_address_1}
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

          <div className="flex flex-col gap-2">
            <label className="text-lg" htmlFor="address_2">
              Número
            </label>
            <Input.Root variant="primary">
              <Input.Control
                disabled={!supplier_input_fields_address_2}
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
                disabled={!supplier_input_fields_address_3}
                {...register("address_3")}
                type="address_3"
              />
            </Input.Root>
          </div>
        </div>
      </div>

      <div className="my-2 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/suppliers")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
