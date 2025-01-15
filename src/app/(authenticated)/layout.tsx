import SideBar from "@/app/core/components/side-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex flex-col flex-1 h-screen">
        {children}
      </div>
    </div>
  );
}