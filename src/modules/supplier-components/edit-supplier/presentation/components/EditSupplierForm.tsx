"use client"

import { Supplier } from "@/@types/suppliers"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { getCookie } from "@/lib/cookies"
import {
  editSupplier,
  getSupplierById,
} from "@/modules/supplier-components/edit-supplier/infra/remote"
import {
  EditSupplierSchema,
  editSupplierFormSchema,
} from "@/modules/supplier-components/edit-supplier/presentation/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditSupplierForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: supplier, isLoading } = useQuery({
    queryKey: ["supplier", id],
    queryFn: () => getSupplierById(id),
    enabled: id !== "",
    refetchOnWindowFocus: false,
  })

  const {
    supplier_input_fields_name,
    supplier_input_fields_email,
    supplier_input_fields_cpf_cnpj,
    supplier_input_fields_phone,
    supplier_input_fields_contact_name,
    supplier_input_fields_address_1,
    supplier_input_fields_address_2,
    supplier_input_fields_address_3,
    supplier_input_fields_state,
    supplier_input_fields_cep,
    supplier_input_fields_city,
  } = JSON.parse(getCookie("permissions")).componentAccess

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditSupplierSchema>({
    resolver: zodResolver(editSupplierFormSchema),
    values: {
      account_id: supplier?.account_id || "",
      name: supplier?.name || "",
      address_1: supplier?.address_1 || "",
      address_2: supplier?.address_2 || "",
      address_3: supplier?.address_3 || "",
      cpf_cnpj: supplier?.cpf_cnpj || "",
      cep: supplier?.cep || "",
      city: supplier?.city || "",
      contact_name: supplier?.contact_name || "",
      state: supplier?.state || "",
      phone: supplier?.phone || "",
      email: supplier?.email || "",
    },
  })

  async function onSubmit(data: Supplier.UpdateRequest) {
    try {
      await editSupplier({ supplier_id: id, ...data })
      toast.success("Fornecedor editado com sucesso!")
      setTimeout(() => push("/suppliers"), 2000)
    } catch (error) {
      toast.error("Erro ao editar fornecedor: " + error)
    }
  }

  if (!supplier || isLoading) return <LoadingScreen />

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

          <div className="flex max-w-24 flex-col gap-2">
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

          <div className="flex max-w-24 flex-col gap-2">
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
