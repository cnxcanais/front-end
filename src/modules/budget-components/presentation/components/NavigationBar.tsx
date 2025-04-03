import { classNames } from "@/core/utils/classnames"

export enum TabName {
  RECEITAS = "Receitas",
  DESPESAS = "Despesas",
}

const initialTabs = [{ name: TabName.RECEITAS }, { name: TabName.DESPESAS }]

export type NavigationBarProps = {
  setTab: (tab: TabName) => void
  activeTab: TabName
}

export function NavigationBar({ setTab, activeTab }: NavigationBarProps) {
  return (
    <div className="">
      <nav
        aria-label="Tabs"
        className="isolate flex divide-x divide-gray-200 rounded-lg shadow">
        {initialTabs.map((tab, tabIdx) => {
          const isActive = tab.name === activeTab

          return (
            <div
              key={tab.name}
              onClick={() => setTab(tab.name)}
              aria-current={isActive ? "page" : undefined}
              className={classNames(
                isActive ? "text-gray-900" : (
                  "text-gray-500 hover:text-gray-700"
                ),
                tabIdx === 0 ? "rounded-l-lg" : "",
                tabIdx === initialTabs.length - 1 ? "rounded-r-lg" : "",
                "group relative min-w-0 flex-1 cursor-pointer overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium transition-all duration-300 ease-in-out hover:bg-gray-50 focus:z-10"
              )}>
              <span className="text-lg">{tab.name}</span>
              <span
                aria-hidden="true"
                className={classNames(
                  isActive ? "bg-yellow-100" : "bg-transparent",
                  "absolute inset-x-0 bottom-0 h-0.5"
                )}
              />
            </div>
          )
        })}
      </nav>
    </div>
  )
}
