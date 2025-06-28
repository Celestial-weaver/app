import type { ReactNode } from "react"

interface ResponsiveGridProps {
  children: ReactNode
  className?: string
}

export function ResponsiveGrid({ children, className = "" }: ResponsiveGridProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Mobile: Horizontal scroll */}
      <div className="sm:hidden">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory px-1">{children}</div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">{children}</div>
    </div>
  )
}
