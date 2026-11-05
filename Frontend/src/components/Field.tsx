import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

const base =
  'w-full rounded-lg border bg-ink-900 px-3.5 text-sm text-white placeholder:text-ink-500 outline-none transition focus:border-white disabled:cursor-not-allowed disabled:opacity-50'

function Wrapper({
  label,
  error,
  hint,
  children,
}: {
  label?: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-ink-300">
          {label}
        </span>
      )}
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-red-400">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-ink-500">{hint}</span>
      ) : null}
    </label>
  )
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Field({ label, error, hint, className = '', ...rest }: FieldProps) {
  return (
    <Wrapper label={label} error={error} hint={hint}>
      <input
        className={`${base} h-11 ${error ? 'border-red-500/60' : 'border-ink-700'} ${className}`}
        {...rest}
      />
    </Wrapper>
  )
}

interface AreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function TextArea({ label, error, hint, className = '', ...rest }: AreaProps) {
  return (
    <Wrapper label={label} error={error} hint={hint}>
      <textarea
        className={`${base} min-h-28 resize-y py-3 ${error ? 'border-red-500/60' : 'border-ink-700'} ${className}`}
        {...rest}
      />
    </Wrapper>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export function Select({ label, error, className = '', children, ...rest }: SelectProps) {
  return (
    <Wrapper label={label} error={error}>
      <select
        className={`${base} h-11 ${error ? 'border-red-500/60' : 'border-ink-700'} ${className}`}
        {...rest}
      >
        {children}
      </select>
    </Wrapper>
  )
}
