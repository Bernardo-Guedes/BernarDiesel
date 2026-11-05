import type { ReactNode } from 'react'
import { ChevronUp } from 'lucide-react'
import { TIPO_PROPRIEDADE_LABEL } from '../utils/format'
import type { TipoPropriedade } from '../types'
import { FAIXAS, FILTROS_VAZIOS, type Filtros } from '../utils/filtros'

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
}

function Check({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: () => void
  children: ReactNode
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-ink-300 hover:text-white">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="flex h-4 w-4 items-center justify-center rounded border border-ink-500 transition peer-checked:border-white peer-checked:bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-white/50">
        {checked && (
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-black">
            <path d="M2 6.5 5 9l5-6" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </span>
      {children}
    </label>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="group border-b border-ink-800 px-5 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-bold uppercase tracking-widest">
        {title}
        <ChevronUp className="h-3.5 w-3.5 transition group-not-open:rotate-180" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  )
}

interface Props {
  filtros: Filtros
  marcasDisponiveis: string[]
  onChange: (f: Filtros) => void
}

export function FilterSidebar({ filtros, marcasDisponiveis, onChange }: Props) {
  const ativos =
    filtros.faixas.length + filtros.marcas.length + filtros.propriedades.length > 0

  return (
    <aside className="overflow-hidden rounded-xl border border-ink-800 bg-ink-900">
      <div className="flex items-baseline justify-between border-b border-ink-800 px-5 py-4">
        <h2 className="text-xl font-bold">Filtro</h2>
        <button
          onClick={() => onChange(FILTROS_VAZIOS)}
          disabled={!ativos}
          className="cursor-pointer text-[10px] font-semibold uppercase tracking-widest text-ink-500 hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:text-ink-500"
        >
          Limpar filtros
        </button>
      </div>

      <Group title="Diária">
        {FAIXAS.map((f) => (
          <Check
            key={f.key}
            checked={filtros.faixas.includes(f.key)}
            onChange={() => onChange({ ...filtros, faixas: toggle(filtros.faixas, f.key) })}
          >
            {f.label}
          </Check>
        ))}
      </Group>

      <Group title="Marca">
        {marcasDisponiveis.map((m) => (
          <Check
            key={m}
            checked={filtros.marcas.includes(m)}
            onChange={() => onChange({ ...filtros, marcas: toggle(filtros.marcas, m) })}
          >
            {m}
          </Check>
        ))}
      </Group>

      <Group title="Proprietário">
        {(Object.keys(TIPO_PROPRIEDADE_LABEL) as TipoPropriedade[]).map((t) => (
          <Check
            key={t}
            checked={filtros.propriedades.includes(t)}
            onChange={() =>
              onChange({ ...filtros, propriedades: toggle(filtros.propriedades, t) })
            }
          >
            {TIPO_PROPRIEDADE_LABEL[t]}
          </Check>
        ))}
      </Group>
    </aside>
  )
}
