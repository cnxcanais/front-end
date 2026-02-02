"use client"

import { Sidebar } from "@/core/components/Sidebar"
import { useAvatarUrlQuery } from "@/modules/meu-usuario/infra/hooks/use-avatar-url-query"
import { User } from "@phosphor-icons/react"
import Link from "next/link"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: avatarData } = useAvatarUrlQuery()

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="mb-4 flex h-screen flex-1 flex-col overflow-y-auto px-8 pt-4">
        <div className="mb-4 flex justify-end">
          <Link href="/meu-usuario">
            <div className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200 hover:ring-2 hover:ring-blue-500">
              {avatarData?.url ? (
                <img src={avatarData.url} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User size={24} weight="light" className="text-gray-500" />
              )}
            </div>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
