import type { ReactNode } from 'react'
import { CarFront } from 'lucide-react'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-700 px-6 py-16 text-center">
      <CarFront className="h-9 w-9 text-ink-600" />
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
