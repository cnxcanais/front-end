"use client"

import { IncomeSource } from "@/@types/income-sources"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { fetchCep } from "@/core/utils/findCep"
import {
  formatDocumentNumber,
  formatStaticDocument,
} from "@/core/utils/formatDocumentNumber"
import {
  formatPhoneNumber,
  formatStaticPhoneNumber,
} from "@/core/utils/formatPhoneNumber"
import {
  editIncomeSource,
  getIncomeSourceById,
} from "@/modules/income-components/income-source-components/edit-income-source/infra/remote"
import {
  EditIncomeSourceSchema,
  editIncomeSourceFormSchema,
} from "@/modules/income-components/income-source-components/edit-income-source/presentation/validation/schema"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditIncomeSourceForm({
  income_source_id,
}: {
  income_source_id: string
}) {
  const { push } = useRouter()

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const { data: incomeSource, isLoading } = useQuery({
    queryKey: ["income-source", income_source_id],
    queryFn: () => getIncomeSourceById({ income_source_id }),
    enabled: income_source_id !== "",
  })

  const income_source_input_fields_name =
    permissions?.["income_source_input_fields_name"]
  const income_source_input_fields_email =
    permissions?.["income_source_input_fields_email"]
  const income_source_input_fields_cpf_cnpj =
    permissions?.["income_source_input_fields_cpf_cnpj"]
  const income_source_input_fields_phone =
    permissions?.["income_source_input_fields_phone"]
  const income_source_input_fields_contact_name =
    permissions?.["income_source_input_fields_contact_name"]
  const income_source_input_fields_address_2 =
    permissions?.["income_source_input_fields_address_2"]
  const income_source_input_fields_address_3 =
    permissions?.["income_source_input_fields_address_3"]
  const income_source_input_fields_cep =
    permissions?.["income_source_input_fields_cep"]

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<EditIncomeSourceSchema>({
    resolver: zodResolver(editIncomeSourceFormSchema),
    values: {
      account_id: incomeSource?.account_id || "",
      name: incomeSource?.name || "",
      address_1: incomeSource?.address_1 || "",
      address_2: incomeSource?.address_2 || "",
      address_3: incomeSource?.address_3 || "",
      cpf_cnpj: formatStaticDocument(incomeSource?.cpf_cnpj) || "",
      cep: incomeSource?.cep || "",
      city: incomeSource?.city || "",
      contact_name: incomeSource?.contact_name || "",
      state: incomeSource?.state || "",
      phone: formatStaticPhoneNumber(incomeSource?.phone) || "",
      email: incomeSource?.email || "",
    },
  })

  async function onSubmit(data: IncomeSource.UpdateRequest) {
    try {
      const formattedData = {
        ...data,
        cpf_cnpj: data.cpf_cnpj.replace(/\D/g, ""),
        phone: data.phone.replace(/\D/g, ""),
      }
      await editIncomeSource({ income_source_id, ...formattedData })
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
            <label htmlFor="name">Nome</label>
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
            <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
            <Input.Root variant={errors.cpf_cnpj ? "error" : "primary"}>
              <Input.Control
                disabled={!income_source_input_fields_cpf_cnpj}
                {...register("cpf_cnpj", {
                  onChange: (e) => {
                    const formatted = formatDocumentNumber(e.target.value)
                    e.target.value = formatted
                  },
                })}
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
            <label htmlFor="address_1">Contato</label>
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
            <label htmlFor="phone">Telefone</label>
            <Input.Root variant={errors.phone ? "error" : "primary"}>
              <Input.Control
                disabled={!income_source_input_fields_phone}
                {...register("phone", {
                  onChange: (e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    e.target.value = formatted
                  },
                })}
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
            <label htmlFor="email">Email</label>
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
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="cep">CEP</label>
              <Input.Root variant={errors.cep ? "error" : "primary"}>
                <Input.Icon>
                  <MagnifyingGlass className="mr-2 h-5 w-5" />
                </Input.Icon>
                <Input.Control
                  disabled={!income_source_input_fields_cep}
                  {...register("cep")}
                  type="text"
                  onBlur={(e) => fetchCep(e.target.value, setValue)}
                />
              </Input.Root>
              {errors.cep && (
                <span className="text-xs text-red-500">
                  {errors.cep.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="city">Cidade</label>
              <Input.Root variant={errors.city ? "error" : "disabled"}>
                <Input.Control disabled {...register("city")} type="text" />
              </Input.Root>
              {errors.city && (
                <span className="text-xs text-red-500">
                  {errors.city.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="state">Estado</label>
              <Input.Root variant={errors.state ? "error" : "disabled"}>
                <Input.Control disabled {...register("state")} type="state" />
              </Input.Root>
              {errors.state && (
                <span className="text-xs text-red-500">
                  {errors.state.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="address_1">Endereço</label>
              <Input.Root variant={errors.address_1 ? "error" : "disabled"}>
                <Input.Control
                  disabled
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
              <label htmlFor="address_2">Número</label>
              <Input.Root variant="primary">
                <Input.Control
                  disabled={!income_source_input_fields_address_2}
                  {...register("address_2")}
                  type="address_2"
                />
              </Input.Root>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="address_3">Complemento</label>
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
      </div>

      <div className="my-2 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          Editar
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
