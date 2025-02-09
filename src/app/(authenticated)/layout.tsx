import { Sidebar } from "@/core/components/Sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="mb-4 flex h-screen flex-1 flex-col overflow-y-auto px-8 pt-4">
        {children}
      </div>
    </div>
  )
}
