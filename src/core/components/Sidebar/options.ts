import { getCookie } from "@/lib/cookies"
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

const isAdmin = getCookie("perfilId") === process.env.NEXT_PUBLIC_ADM_ID

const sidebar_options_not_admin: SidebarOptionProps[] = [
  {
    name: "Meu Usuário",
    href: "",
    Icon: User,
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
    group: "Operações",
  },
]

export const sidebar_options: SidebarOptionProps[] = [
  {
    name: "Meu Usuário",
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
]

type SidebarGroups = {
  [key: string]: SidebarOptionProps[]
}

const options = isAdmin ? sidebar_options : sidebar_options_not_admin

export const sidebarGroupedByGroups = options.reduce<SidebarGroups>(
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
