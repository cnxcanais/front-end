import { Icon } from "@phosphor-icons/react"
import {
  BuildingOffice,
  Buildings,
  FileText,
  IdentificationBadge,
  Package,
  Suitcase,
  Tag,
  User,
  UsersFour,
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
    href: "",
    Icon: User,
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
    name: "Produtos",
    href: "/produtos",
    Icon: Package,
    group: "Cadastros",
  },
  {
    name: "Propostas",
    href: "/propostas",
    Icon: FileText,
    group: "Operações",
  },
  {
    name: "Perfil de Usuário",
    href: "/perfis",
    Icon: UsersFour,
    group: "Configurações",
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
