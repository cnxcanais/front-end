import { Icon } from "@phosphor-icons/react"
import {
  Bank,
  Coin,
  Coins,
  CreditCard,
  Globe,
  Key,
  PiggyBank,
  Suitcase,
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
    href: "#",
    Icon: Key,
    group: "Gerenciamento",
  },
  {
    name: "Fornecedor",
    href: "#",
    Icon: Suitcase,
    group: "Cadastro",
  },
  {
    name: "Franqueado",
    href: "/income-sources",
    Icon: Globe,
    group: "Cadastro",
  },
  {
    name: "Grupo de Receitas",
    href: "/income-groups",
    Icon: Coins,
    group: "Cadastro",
  },
  {
    name: "Grupo de Despesas",
    href: "#",
    Icon: Wallet,
    group: "Cadastro",
  },
  {
    name: "Orçamento",
    href: "#",
    Icon: PiggyBank,
    group: "Cadastro",
  },
  {
    name: "Receitas",
    href: "#",
    Icon: Coin,
    group: "Cadastro",
  },
  {
    name: "Despesas",
    href: "#",
    Icon: CreditCard,
    group: "Cadastro",
  },
  {
    name: "Banco",
    href: "/banks",
    Icon: Bank,
    group: "Cadastro",
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
