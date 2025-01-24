"use client"

import { Organization } from "@/@types/organizations"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { getCookie } from "@/lib/cookies"
import { createOrganization } from "@/modules/organization-components/create-organization/infra/remote/create-organization"
import {
  CreateOrganizationSchema,
  createOrganizationFormSchema,
} from "@/modules/organization-components/create-organization/presentation/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateOrganizationForm() {
  const { push } = useRouter()

  const accountId = getCookie("accountId")

  const {
    organizations_input_fields_name,
    organizations_input_fields_email,
    organizations_input_fields_cnpj,
    organizations_input_fields_address,
    organizations_input_fields_phone,
  } = JSON.parse(getCookie("permissions")).componentAccess

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateOrganizationSchema>({
    resolver: zodResolver(createOrganizationFormSchema),
    values: {
      account_id: accountId,
    },
  })

  async function onSubmit(data: Organization.CreateRequest) {
    try {
      const response = await createOrganization(data)
      toast.success(response)
      setTimeout(() => push("/organizations"), 2000)
    } catch (error) {
      toast.error("Erro ao criar organização: " + error)
    }
  }

  return (
    <form
      className="mt-6 grid w-full max-w-[1000px] grid-flow-row grid-cols-2 gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-lg" htmlFor="name">
            Nome
          </label>
          <Input.Root variant={errors.name ? "error" : "primary"}>
            <Input.Control
              disabled={!organizations_input_fields_name}
              {...register("name")}
              type="text"
            />
          </Input.Root>
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg" htmlFor="cnpj">
            CNPJ
          </label>
          <Input.Root variant={errors.cnpj ? "error" : "primary"}>
            <Input.Control
              disabled={!organizations_input_fields_cnpj}
              {...register("cnpj")}
              type="text"
            />
          </Input.Root>
          {errors.cnpj && (
            <span className="text-xs text-red-500">{errors.cnpj.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg" htmlFor="address">
            Endereço
          </label>
          <Input.Root variant={errors.address ? "error" : "primary"}>
            <Input.Control
              disabled={!organizations_input_fields_address}
              {...register("address")}
              type="text"
            />
          </Input.Root>
          {errors.address && (
            <span className="text-xs text-red-500">
              {errors.address.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-lg" htmlFor="phone">
            Telefone
          </label>
          <Input.Root variant={errors.phone ? "error" : "primary"}>
            <Input.Control
              disabled={!organizations_input_fields_phone}
              {...register("phone")}
              type="text"
            />
          </Input.Root>
          {errors.phone && (
            <span className="text-xs text-red-500">{errors.phone.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg" htmlFor="email">
            Email
          </label>
          <Input.Root variant={errors.email ? "error" : "primary"}>
            <Input.Control
              disabled={!organizations_input_fields_email}
              {...register("email")}
              type="email"
            />
          </Input.Root>
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/organizations")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
