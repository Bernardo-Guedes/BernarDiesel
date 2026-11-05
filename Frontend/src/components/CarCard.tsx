import { CalendarClock, Hash } from 'lucide-react'
import { CarIllustration } from './CarIllustration'
import { Pill } from './StatusBadge'
import { Button } from './Button'
import { TIPO_PROPRIEDADE_LABEL, brl } from '../utils/format'
import type { Automovel } from '../types'

interface Props {
  carro: Automovel
  dias: number
  onSelect: (carro: Automovel) => void
}

/** Card de veículo no estilo do site de referência (palco escuro + preço grande). */
export function CarCard({ carro, dias, onSelect }: Props) {
  const total = dias > 0 ? carro.valorDiaria * dias : null
  const [inteiro, centavos = '00'] = Number(carro.valorDiaria).toFixed(2).split('.')

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 transition hover:border-ink-600">
      <div className="car-stage relative px-5 pb-2 pt-5">
        <h3 className="text-lg font-semibold">
          {carro.marca} {carro.modelo}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <Pill>{TIPO_PROPRIEDADE_LABEL[carro.tipoPropriedade]}</Pill>
          <Pill>{carro.ano}</Pill>
        </div>
        <CarIllustration
          marca={carro.marca}
          modelo={carro.modelo}
          className="mx-auto mt-3 h-32 w-full transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{inteiro}</span>
            <span className="text-lg font-bold">,{centavos}</span>
            <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
              R$ / dia
            </span>
          </p>
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-ink-500">
            {total !== null
              ? `${brl(total)} total · ${dias} ${dias === 1 ? 'diária' : 'diárias'}`
              : 'defina o período para ver o total'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Pill>
            <Hash className="h-3 w-3" />
            {carro.placa}
          </Pill>
          <Pill>
            <CalendarClock className="h-3 w-3" />
            Mat. {carro.matricula}
          </Pill>
        </div>

        <Button
          className="mt-auto"
          fullWidth
          disabled={dias <= 0}
          onClick={() => onSelect(carro)}
        >
          {dias > 0 ? 'Selecionar' : 'Escolha as datas'}
        </Button>
      </div>
    </article>
  )
}
