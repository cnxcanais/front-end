import { Icon } from "@phosphor-icons/react"
import {
  Bank,
  CashRegister,
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
  { name: "Perfil", href: "#", Icon: User, group: "Gerenciamento" },
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
    group: "Cadastro",
  },
  {
    name: "Cliente",
    href: "/income-sources",
    Icon: Globe,
    group: "Cadastro",
  },
  {
    name: "Categorias de Receita",
    href: "/income-categories",
    Icon: TipJar,
    group: "Cadastro",
  },
  {
    name: "Grupos de Receita",
    href: "/income-groups",
    Icon: Coins,
    group: "Cadastro",
  },
  {
    name: "Categorias de Despesa",
    href: "/expense-categories",
    Icon: HandCoins,
    group: "Cadastro",
  },
  {
    name: "Grupos de Despesa",
    href: "/expense-groups",
    Icon: Wallet,
    group: "Cadastro",
  },
  {
    name: "Orçamentos",
    href: "/budget",
    Icon: PiggyBank,
    group: "Cadastro",
  },
  {
    name: "Receitas",
    href: "/incomes",
    Icon: Coin,
    group: "Cadastro",
  },
  {
    name: "Despesas",
    href: "/expenses",
    Icon: CreditCard,
    group: "Cadastro",
  },
  {
    name: "Banco",
    href: "/banks",
    Icon: Bank,
    group: "Cadastro",
  },
  {
    name: "Contas de Banco",
    href: "/banks/accounts",
    Icon: MoneyWavy,
    group: "Cadastro",
  },
  {
    name: "DRE",
    href: "#",
    Icon: NotePencil,
    group: "Relatórios",
  },
  {
    name: "Fluxo de Caixa",
    href: "/cash-flow",
    Icon: CashRegister,
    group: "Relatórios",
  },
  {
    name: "Dashboard",
    href: "#",
    Icon: ChartBarHorizontal,
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
