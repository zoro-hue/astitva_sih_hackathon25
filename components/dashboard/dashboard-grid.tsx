import type { ReactNode } from "react"

interface DashboardGridProps {
  children: ReactNode
}

export function DashboardGrid({ children }: DashboardGridProps) {
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{children}</div>
}
