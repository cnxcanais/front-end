"use client"

import { Icon } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

export type SidebarItemProps = {
  name: string
  href: string
  Icon: Icon
  current: boolean
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export function SidebarItem({ current, href, Icon, name }: SidebarItemProps) {
  const [clientHref, setClientHref] = useState(href)

  useEffect(() => {
    if (name === "Perfil") {
      const userId = sessionStorage?.getItem("userId") ?? "teste"
      setClientHref(`${href}/${userId}`)
    }
  }, [name, href])

  return (
    <li key={name}>
      <a
        href={clientHref}
        className={classNames(
          current ?
            "bg-gray-50 text-blue-500"
          : "text-white hover:bg-gray-50 hover:text-blue-500",
          "group flex gap-x-3 text-nowrap rounded-md p-2 text-sm/6 font-semibold"
        )}>
        <Icon
          aria-hidden="true"
          className={classNames(
            current ? "text-blue-500" : "text-white group-hover:text-blue-500",
            "size-6 shrink-0"
          )}
        />
        {name}
      </a>
    </li>
  )
}
