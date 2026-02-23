import { Icon } from "@phosphor-icons/react"
import {
  BuildingOffice,
  Buildings,
  Calculator,
  Car,
  ClockCounterClockwise,
  CurrencyDollar,
  FileText,
  Graph,
  IdentificationBadge,
  LockKey,
  Package,
  ProjectorScreenChart,
  Suitcase,
  Tag,
  User,
  UsersFour,
  Warning,
} from "@phosphor-icons/react/dist/ssr"

type SidebarOptionProps = {
  name: string
  href: string
  Icon: Icon
  group: string
}

const sidebar_options_not_admin: SidebarOptionProps[] = [
  {
    name: "Meu Usuário",
    href: "/meu-usuario",
    Icon: User,
    group: "Gerenciamento",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    Icon: ProjectorScreenChart,
    group: "Gerenciamento",
  },
  {
    name: "Segurados",
    href: "/segurados",
    Icon: IdentificationBadge,
    group: "Cadastros",
  },
  {
    name: "Propostas",
    href: "/propostas",
    Icon: FileText,
    group: "Cadastros",
  },
  {
    name: "Sinistros",
    href: "/sinistros",
    Icon: Car,
    group: "Cadastros",
  },
  {
    name: "Relatórios Apólices",
    href: "/relatorios",
    Icon: Graph,
    group: "Relatórios",
  },
  {
    name: "Relatórios Sinistros",
    href: "/relatorios-sinistros",
    Icon: Graph,
    group: "Relatórios",
  },
  {
    name: "Comissões",
    href: "/comissoes",
    Icon: CurrencyDollar,
    group: "Financeiro",
  },
  {
    name: "Repasses",
    href: "/repasses",
    Icon: CurrencyDollar,
    group: "Financeiro",
  },
  {
    name: "Histórico de Sinistros",
    href: "/sinistros-historico",
    Icon: ClockCounterClockwise,
    group: "Relatórios",
  },
]

const sidebar_options_produtor: SidebarOptionProps[] = [
  {
    name: "Meu Usuário",
    href: "/meu-usuario",
    Icon: User,
    group: "Gerenciamento",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    Icon: ProjectorScreenChart,
    group: "Gerenciamento",
  },
  {
    name: "Segurados",
    href: "/segurados",
    Icon: IdentificationBadge,
    group: "Cadastros",
  },
  {
    name: "Propostas",
    href: "/propostas",
    Icon: FileText,
    group: "Cadastros",
  },
  {
    name: "Sinistros",
    href: "/sinistros",
    Icon: Car,
    group: "Cadastros",
  },
  {
    name: "Relatórios Apólices",
    href: "/relatorios",
    Icon: Graph,
    group: "Relatórios",
  },
  {
    name: "Relatórios Sinistros",
    href: "/relatorios-sinistros",
    Icon: Graph,
    group: "Relatórios",
  },
  {
    name: "Repasses",
    href: "/repasses",
    Icon: CurrencyDollar,
    group: "Financeiro",
  },
  {
    name: "Histórico de Sinistros",
    href: "/sinistros-historico",
    Icon: ClockCounterClockwise,
    group: "Relatórios",
  },
]

const sidebar_options_not_admin_not_master: SidebarOptionProps[] = [
  {
    name: "Meu Usuário",
    href: "/meu-usuario",
    Icon: User,
    group: "Gerenciamento",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    Icon: ProjectorScreenChart,
    group: "Gerenciamento",
  },
  {
    name: "Segurados",
    href: "/segurados",
    Icon: IdentificationBadge,
    group: "Cadastros",
  },
  {
    name: "Propostas",
    href: "/propostas",
    Icon: FileText,
    group: "Cadastros",
  },
  {
    name: "Sinistros",
    href: "/sinistros",
    Icon: Car,
    group: "Cadastros",
  },
  {
    name: "Relatórios Sinistros",
    href: "/relatorios-sinistros",
    Icon: Graph,
    group: "Relatórios",
  },
  {
    name: "Histórico de Sinistros",
    href: "/sinistros-historico",
    Icon: ClockCounterClockwise,
    group: "Relatórios",
  },
]

export const sidebar_options: SidebarOptionProps[] = [
  {
    name: "Meu Usuário",
    href: "/meu-usuario",
    Icon: User,
    group: "Gerenciamento",
  },
  {
    name: "Cofre de Senhas",
    href: "/cofre",
    Icon: LockKey,
    group: "Gerenciamento",
  },
  {
    name: "Seguradoras",
    href: "/seguradoras",
    Icon: Suitcase,
    group: "Cadastros",
  },
  {
    name: "Corretoras",
    href: "/corretoras",
    Icon: BuildingOffice,
    group: "Cadastros",
  },
  {
    name: "Produtores",
    href: "/produtores",
    Icon: User,
    group: "Cadastros",
  },
  {
    name: "Segurados",
    href: "/segurados",
    Icon: IdentificationBadge,
    group: "Cadastros",
  },
  {
    name: "Grupos Econômicos",
    href: "/grupos-economicos",
    Icon: Buildings,
    group: "Cadastros",
  },
  {
    name: "Ramos",
    href: "/ramos",
    Icon: Tag,
    group: "Cadastros",
  },
  {
    name: "Tipos de Sinistros",
    href: "/tipos-sinistros",
    Icon: Warning,
    group: "Cadastros",
  },
  {
    name: "Produtos",
    href: "/produtos",
    Icon: Package,
    group: "Cadastros",
  },
  {
    name: "Contas Contábeis",
    href: "/contas-contabeis",
    Icon: Calculator,
    group: "Cadastros",
  },
  {
    name: "Propostas",
    href: "/propostas",
    Icon: FileText,
    group: "Operações",
  },
  {
    name: "Sinistros",
    href: "/sinistros",
    Icon: Car,
    group: "Operações",
  },
  {
    name: "Histórico de Sinistros",
    href: "/sinistros-historico",
    Icon: ClockCounterClockwise,
    group: "Operações",
  },
  {
    name: "Perfil de Usuários",
    href: "/perfis",
    Icon: UsersFour,
    group: "Gerenciamento",
  },
  {
    name: "Usuários",
    href: "/usuarios",
    Icon: User,
    group: "Gerenciamento",
  },
  {
    name: "Apólices",
    href: "/relatorios",
    Icon: Graph,
    group: "Relatórios",
  },
  {
    name: "Sinistros",
    href: "/relatorios-sinistros",
    Icon: Car,
    group: "Relatórios",
  },
  {
    name: "Comissões",
    href: "/comissoes",
    Icon: CurrencyDollar,
    group: "Financeiro",
  },
  {
    name: "Repasses",
    href: "/repasses",
    Icon: CurrencyDollar,
    group: "Financeiro",
  },
]

type SidebarGroups = {
  [key: string]: SidebarOptionProps[]
}

export function getSidebarGroupedByGroups(
  isAdmin: boolean,
  isMaster: boolean,
  isProdutor: boolean
) {
  let options: SidebarOptionProps[]

  if (isAdmin) {
    options = sidebar_options
  } else if (isMaster) {
    options = sidebar_options_not_admin
  } else if (isProdutor) {
    options = sidebar_options_produtor
  } else {
    options = sidebar_options_not_admin_not_master
  }

  return options.reduce<SidebarGroups>((groups, option) => {
    const group = option.group
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(option)
    return groups
  }, {})
}
