import SideBar from '@/core/components/side-bar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex h-screen flex-1 flex-col">{children}</div>
    </div>
  )
}
