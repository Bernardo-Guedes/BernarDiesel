import { Loader2 } from 'lucide-react'

export function PageLoader({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-ink-400">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
