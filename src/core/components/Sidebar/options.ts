import { Icon } from "@phosphor-icons/react"
import { Suitcase, User } from "@phosphor-icons/react/dist/ssr"

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
    name: "Seguradoras",
    href: "/seguradoras",
    Icon: Suitcase,
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
