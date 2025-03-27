"use client"

import { Permission } from "@/@types/permissions"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { getAccountId } from "@/core/utils/get-account-id"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useGetPermissionsQuery } from "../../infra/hooks/use-get-permissions-query"
import { clonePermissions } from "../../infra/remote/clone-permissions"
import { PermissionCard } from "./PermissionCard"

export function ClonePermissions() {
  const [updatedPermissons, setUpdatedPermissions] = useState<Permission.Type>()
  const [cardsDisplay, setCardsDisplay] = useState({
    accounts: false,
    organizations: false,
    users: false,
    permissions: false,
    suppliers: false,
    income_sources: false,
    income_categories: false,
    income_groups: false,
    expense_categories: false,
    expense_groups: false,
    budget_incomes: false,
    incomes: false,
    expenses: false,
    banks: false,
    bank_accounts: false,
    summary_details: false,
  })

  const params = useParams()
  const name = params.name as string
  const account_id = getAccountId()
  const { data, isLoading } = useGetPermissionsQuery(account_id, name)
  const { push } = useRouter()

  const handleSubmit = async () => {
    if (!updatedPermissons.name) {
      toast.error("Nome do perfil não pode ser vazio!")
      setTimeout(() => {
        push("/permissions")
      }, 2000)
      return
    }
    const refinedData = {
      account_id,
      permissions: updatedPermissons,
    }
    const response = await clonePermissions(refinedData)

    if (response) {
      toast.success("Permissões atualizadas com sucesso!")
    } else {
      toast.error("Erro ao atualizar permissões!")
    }

    setTimeout(() => {
      push("/permissions")
    }, 2000)
  }

  useEffect(() => {
    if (data) {
      setUpdatedPermissions({ ...data, name: "" })
    }
  }, [data])
  if (!data || isLoading) return <LoadingScreen />

  return (
    <section className="mb-2">
      <div>
        <label htmlFor="profileName">Nome do Perfil de Permissões</label>
        <Input.Control
          name="profileName"
          onChange={(e) =>
            setUpdatedPermissions({
              ...updatedPermissons,
              name: e.target.value,
            })
          }
        />
      </div>
      <div className="flex w-[1000px] justify-between p-0">
        <div>
          <h2>Permissão</h2>
        </div>
        <div className="mr-[35px] flex w-[100px] justify-between">
          <h2>Tipo</h2>
          <h2>Ativo</h2>
        </div>
      </div>

      <div className="flex w-[1000px] flex-col">
        <PermissionCard
          name="Contas"
          type="Página"
          length={10}
          associatedURL="/accounts"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="accounts"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.accounts && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="accounts_create"
              associatedURL="/accounts/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="accounts_edit"
              associatedURL="/accounts/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="accounts_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Organizações"
          type="Página"
          length={10}
          associatedURL="/organizations"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="organizations"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.organizations && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="organizations_create"
              associatedURL="/organizations/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="organizations_edit"
              associatedURL="/organizations/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="organizations_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Usuários"
          type="Página"
          length={10}
          associatedURL="/users"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="users"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.users && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="users_create"
              associatedURL="/users/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="users_edit"
              associatedURL="/users/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="users_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Permissões"
          type="Página"
          length={10}
          associatedURL="/permissions"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="permissions"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.permissions && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="permissions_create"
              associatedURL="/permissions/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="permissions_edit"
              associatedURL="/permissions/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="permissions_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Fornecedor"
          type="Página"
          length={10}
          associatedURL="/suppliers"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="suppliers"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.suppliers && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="suppliers_create"
              associatedURL="/suppliers/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="suppliers_edit"
              associatedURL="/suppliers/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="suppliers_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Clientes"
          type="Página"
          length={10}
          associatedURL="/income-sources"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="income_sources"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.income_sources && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="income_sources_create"
              associatedURL="/income_sources/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="income_sources_edit"
              associatedURL="/income_sources/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="income_sources_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Grupo de Receitas"
          type="Página"
          length={10}
          associatedURL="/income-categories"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="income_categories"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.income_categories && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="income_categories_create"
              associatedURL="/income_categories/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="income_categories_edit"
              associatedURL="/income_categories/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="income_categories_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Itens de Receita"
          type="Página"
          length={10}
          associatedURL="/income-groups"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="income_groups"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.income_groups && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="income_groups_create"
              associatedURL="/income_groups/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="income_groups_edit"
              associatedURL="/income_groups/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="income_groups_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Grupos de Despesa"
          type="Página"
          length={10}
          associatedURL="/expense-categories"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="expense_categories"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.expense_categories && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="expense_categories_create"
              associatedURL="/expense_categories/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="expense_categories_edit"
              associatedURL="/expense_categories/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="expense_categories_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Itens de Despesa"
          type="Página"
          length={10}
          associatedURL="/expense-groups"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="expense_groups"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.expense_groups && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="expense_groups_create"
              associatedURL="/expense_groups/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="expense_groups_edit"
              associatedURL="/expense_groups/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="expense_groups_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Previsões Orçamentárias Receitas"
          type="Página"
          length={10}
          associatedURL="/budget/incomes"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="budget_incomes"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.budget_incomes && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="budget_incomes_create"
              associatedURL="/budget/incomes/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="budget_incomes_edit"
              associatedURL="/budget/incomes/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="budget_incomes_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Receitas"
          type="Página"
          length={10}
          associatedURL="/incomes"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="incomes"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.incomes && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="income_create"
              associatedURL="/incomes/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="income_edit"
              associatedURL="/incomes/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="income_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Despesas"
          type="Página"
          length={10}
          associatedURL="/expenses"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="expenses"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.expenses && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="expense_create"
              associatedURL="/expenses/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="expense_edit"
              associatedURL="/expenses/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="expense_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Bancos"
          type="Página"
          length={10}
          associatedURL="/banks"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="banks"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.banks && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="banks_create"
              associatedURL="/banks/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="banks_edit"
              associatedURL="/banks/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="banks_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Contas Bancárias"
          type="Página"
          length={10}
          associatedURL="/banks/accounts"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
          childCardsName="bank_accounts"
          setCardsDisplay={setCardsDisplay}
          cardsDisplay={cardsDisplay}
        />

        {cardsDisplay.bank_accounts && (
          <div className="flex flex-col items-end">
            <PermissionCard
              name="Cadastrar"
              type="Botão"
              length={9}
              componentAccess="bank_accounts_create"
              associatedURL="/bank_accounts/create"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Editar"
              type="Botão"
              length={9}
              componentAccess="bank_accounts_edit"
              associatedURL="/bank_accounts/edit"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />

            <PermissionCard
              name="Deletar"
              type="Botão"
              length={9}
              componentAccess="bank_accounts_delete"
              setUpdatedPermissions={setUpdatedPermissions}
              updatedPermissions={updatedPermissons}
            />
          </div>
        )}

        <PermissionCard
          name="Resumo de Contas Realizado"
          type="Página"
          length={10}
          associatedURL="/reports/summary-details"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
        />

        <PermissionCard
          name="DRE"
          type="Página"
          length={10}
          associatedURL="/reports/dre"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
        />

        <PermissionCard
          name="Fluxo de Caixa"
          type="Página"
          length={10}
          associatedURL="/reports/cash-flow"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
        />

        <PermissionCard
          name="Comparativo"
          type="Página"
          length={10}
          associatedURL="/reports/comparison"
          setUpdatedPermissions={setUpdatedPermissions}
          updatedPermissions={updatedPermissons}
        />
      </div>

      <div className="mt-2 flex w-[1000px] justify-end">
        <Button onClick={handleSubmit}>Editar</Button>
      </div>
    </section>
  )
}
