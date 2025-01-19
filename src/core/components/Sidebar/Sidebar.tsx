"use client"

import { SidebarItem } from "@/core/components/Sidebar"
import { List } from "@phosphor-icons/react"
import { X } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { sidebarGroupedByGroups } from "./options"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <aside
      className={`left-0 top-0 h-full transition-all duration-300 ease-in-out ${
        isOpen ? "w-72" : "mr-10 w-0"
      } border-r border-gray-200 bg-blue-500`}>
      <div className="flex items-center justify-between p-4">
        <Image
          width={400}
          height={400}
          alt="Your Company"
          src="/images/light-logo.png"
          className={`h-24 w-auto transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
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
                <div key={group}>
                  <h3 className="my-2 text-lg font-semibold text-white">
                    {group}
                  </h3>
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
