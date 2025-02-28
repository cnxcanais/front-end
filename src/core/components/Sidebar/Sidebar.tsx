"use client"

import { List, X } from "@phosphor-icons/react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Fragment, useState } from "react"
import { sidebarGroupedByGroups } from "./options"
import { SidebarItem } from "./SidebarItem"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const { push } = useRouter()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
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
          src="/images/light-logo-new.png"
          className={`h-20 w-auto cursor-pointer transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => push("/dashboard")}
        />
        <button onClick={toggleSidebar} className="text-white">
          {isOpen ?
            <X size={24} />
          : <List size={24} />}
        </button>
      </div>
      {isOpen && (
        <nav className="flex flex-1 flex-col px-6">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <ul role="list" className="-mx-2 space-y-1">
              {Object.keys(sidebarGroupedByGroups).map((group) => (
                <Fragment key={group}>
                  <h3 className="!my-3 border-b-2 pb-0.5 text-lg font-semibold text-white">
                    {group}
                  </h3>
                  <div className="space-y-1">
                    {sidebarGroupedByGroups[group].map((item) => (
                      <SidebarItem
                        key={item.name}
                        href={item.href}
                        Icon={item.Icon}
                        name={item.name}
                        current={pathname === item.href}
                      />
                    ))}
                  </div>
                </Fragment>
              ))}
            </ul>
          </ul>
        </nav>
      )}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-2 top-4 animate-bounce rounded-full bg-blue-500 p-2 text-white shadow-lg">
          <List size={28} />
        </button>
      )}
    </aside>
  )
}
