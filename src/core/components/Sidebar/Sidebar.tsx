"use client"

import { getCookie, removeCookie } from "@/lib/cookies"
import { CaretDown, CaretRight, List, X } from "@phosphor-icons/react"
import { SignOut } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Fragment, useMemo, useState } from "react"
import { Button } from "../Button"
import { getSidebarGroupedByGroups } from "./options"
import { SidebarItem } from "./SidebarItem"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({})
  const pathname = usePathname()
  const { push } = useRouter()

  const sidebarGroupedByGroups = useMemo(() => {
    const isAdmin = getCookie("perfilId") === process.env.NEXT_PUBLIC_ADM_ID
    return getSidebarGroupedByGroups(isAdmin)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  function handleLogout() {
    removeCookie("profile_name")
    removeCookie("accountId")
    removeCookie("userId")
    removeCookie("token")
    removeCookie("path_permissions")

    push("/")
  }

  return (
    <aside
      className={`left-0 top-0 h-full overflow-y-auto transition-all duration-300 ease-in-out ${
        isOpen ? "w-72" : "mr-10 w-0"
      } border-r border-gray-200 bg-blue-500`}>
      <div className="flex items-center justify-between p-4">
        <Image
          width={400}
          height={400}
          alt="Your Company"
          src="/images/cnx-logo.png"
          className={`h-20 w-auto cursor-pointer transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => push("/dashboard")}
        />
        <button onClick={toggleSidebar} className="text-black">
          {isOpen ?
            <X size={24} />
          : <List size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="flex flex-col">
          <Button
            onClick={handleLogout}
            className="mx-auto mt-2 flex w-[90%] items-center justify-center gap-2">
            Logout <SignOut className="h-4 w-4" />
          </Button>
          <nav className="flex flex-1 flex-col px-6">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <ul role="list" className="-mx-2 space-y-1">
                {Object.keys(sidebarGroupedByGroups).map((group) => (
                  <Fragment key={group}>
                    <h3
                      className="text-black !my-3 flex cursor-pointer items-center gap-2 border-b-2 pb-0.5 text-lg font-semibold hover:opacity-80"
                      onClick={() =>
                        setCollapsedGroups((prev) => ({
                          ...prev,
                          [group]: !prev[group],
                        }))
                      }>
                      {collapsedGroups[group] ?
                        <CaretRight size={16} />
                      : <CaretDown size={16} />}
                      {group}
                    </h3>
                    {!collapsedGroups[group] && (
                      <ul className="space-y-1">
                        {sidebarGroupedByGroups[group].map((item) => (
                          <SidebarItem
                            key={item.name}
                            href={item.href}
                            Icon={item.Icon}
                            name={item.name}
                            current={pathname === item.href}
                          />
                        ))}
                      </ul>
                    )}
                  </Fragment>
                ))}
              </ul>
            </ul>
          </nav>
        </div>
      )}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="text-black fixed left-2 top-4 animate-bounce rounded-full bg-blue-500 p-2 shadow-lg">
          <List size={28} />
        </button>
      )}
    </aside>
  )
}
