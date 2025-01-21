"use client"

import { Organization } from "@/@types/organizations"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import {
  editOrganization,
  getOrganizationById,
} from "@/modules/organization-components/edit-organization/infra/remote"
import {
  EditOrganizationSchema,
  editOrganizationFormSchema,
} from "@/modules/organization-components/edit-organization/presentation/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditOrganizationForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: organization, isLoading } = useQuery({
    queryKey: ["organization", id],
    queryFn: () => getOrganizationById({ organizationId: id }),
    enabled: id !== "",
    refetchOnWindowFocus: false,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditOrganizationSchema>({
    resolver: zodResolver(editOrganizationFormSchema),
    values: {
      name: organization?.name || "",
      accountId: organization?.account_id || "",
      address: organization?.address || "",
      cnpj: organization?.cnpj || "",
      phone: organization?.phone || "",
      email: organization?.email || "",
    },
  })

  async function onSubmit(data: Organization.UpdateRequest) {
    try {
      await editOrganization(data)
      toast.success("Conta editada com sucesso!")
      setTimeout(() => push("/accounts"), 2000)
    } catch (error) {
      toast.error("Erro ao editar conta: " + error)
    }
  }

  // TODO: replace Loading with proper component
  if (!organization || isLoading) return <>Loading...</>

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
            <Input.Control {...register("name")} type="text" />
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
            <Input.Control {...register("cnpj")} type="text" />
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
            <Input.Control {...register("address")} type="text" />
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
            <Input.Control {...register("phone")} type="text" />
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
            <Input.Control {...register("email")} type="email" />
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
