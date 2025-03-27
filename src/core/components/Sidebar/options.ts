import { Icon } from "@phosphor-icons/react"
import {
  Bank,
  BookOpenText,
  CashRegister,
  ChartBar,
  ChartBarHorizontal,
  Coin,
  Coins,
  CreditCard,
  Globe,
  HandCoins,
  Key,
  MoneyWavy,
  NotePencil,
  PiggyBank,
  Suitcase,
  TipJar,
  Umbrella,
  User,
  UserCircleGear,
  Users,
  Wallet,
} from "@phosphor-icons/react/dist/ssr"

type SidebarOptionProps = {
  name: string
  href: string
  Icon: Icon
  group: string
}

export const sidebar_options: SidebarOptionProps[] = [
  {
    name: "Perfil",
    href: "/users/profile",
    Icon: User,
    group: "Gerenciamento",
  },
  {
    name: "Contas",
    href: "/accounts",
    Icon: UserCircleGear,
    group: "Gerenciamento",
  },
  {
    name: "Organizações",
    href: "/organizations",
    Icon: Umbrella,
    group: "Gerenciamento",
  },
  {
    name: "Usuários",
    href: "/users",
    Icon: Users,
    group: "Gerenciamento",
  },
  {
    name: "Permissões",
    href: "/permissions",
    Icon: Key,
    group: "Gerenciamento",
  },
  {
    name: "Fornecedor",
    href: "/suppliers",
    Icon: Suitcase,
    group: "Cadastros",
  },
  {
    name: "Cliente",
    href: "/income-sources",
    Icon: Globe,
    group: "Cadastros",
  },
  {
    name: "Grupos de Receita",
    href: "/income-categories",
    Icon: TipJar,
    group: "Cadastros",
  },
  {
    name: "Itens de Receita",
    href: "/income-groups",
    Icon: Coins,
    group: "Cadastros",
  },
  {
    name: "Grupos de Despesa",
    href: "/expense-categories",
    Icon: HandCoins,
    group: "Cadastros",
  },
  {
    name: "Itens de Despesa",
    href: "/expense-groups",
    Icon: Wallet,
    group: "Cadastros",
  },
  {
    name: "Previsões Orçamentárias",
    href: "/budget",
    Icon: PiggyBank,
    group: "Cadastros",
  },
  {
    name: "Receitas",
    href: "/incomes",
    Icon: Coin,
    group: "Cadastros",
  },
  {
    name: "Despesas",
    href: "/expenses",
    Icon: CreditCard,
    group: "Cadastros",
  },
  {
    name: "Banco",
    href: "/banks",
    Icon: Bank,
    group: "Cadastros",
  },
  {
    name: "Contas de Banco",
    href: "/banks/accounts",
    Icon: MoneyWavy,
    group: "Cadastros",
  },
  {
    name: "Resumo de Contas Realizado",
    href: "/reports/summary-details",
    Icon: BookOpenText,
    group: "Relatórios",
  },
  {
    name: "DRE",
    href: "/reports/dre",
    Icon: NotePencil,
    group: "Relatórios",
  },
  {
    name: "Fluxo de Caixa",
    href: "/reports/cash-flow",
    Icon: CashRegister,
    group: "Relatórios",
  },
  {
    name: "Comparativo",
    href: "/reports/comparison",
    Icon: ChartBarHorizontal,
    group: "Relatórios",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    Icon: ChartBar,
    group: "Relatórios",
  },
]

type SidebarGroups = {
  [key: string]: SidebarOptionProps[]
}

export const sidebarGroupedByGroups = sidebar_options.reduce<SidebarGroups>(
  (groups, option) => {
    const group = option.group
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(option)
    return groups
  },
  {}
)
