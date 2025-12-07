import { Icon } from "@phosphor-icons/react"
import {
  BuildingOffice,
  Buildings,
  IdentificationBadge,
  Suitcase,
  Tag,
  User,
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
