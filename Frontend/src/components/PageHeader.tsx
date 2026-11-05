import type { ReactNode } from 'react'

export function PageHeader({
  title,
  subtitle,
  count,
  action,
}: {
  title: string
  subtitle?: string
  count?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="flex items-baseline gap-3 text-3xl font-bold tracking-tight">
          {title}
          {count && (
            <span className="text-[10px] font-medium uppercase tracking-widest text-ink-500">
              {count}
            </span>
          )}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
