import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

type Tone = 'error' | 'success' | 'info'

const tones: Record<Tone, { cls: string; Icon: typeof Info }> = {
  error: { cls: 'border-red-500/30 bg-red-500/10 text-red-200', Icon: AlertCircle },
  success: {
    cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    Icon: CheckCircle2,
  },
  info: { cls: 'border-sky-500/30 bg-sky-500/10 text-sky-200', Icon: Info },
}

export function Alert({
  tone = 'info',
  children,
}: {
  tone?: Tone
  children: ReactNode
}) {
  const { cls, Icon } = tones[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${cls}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  )
}
