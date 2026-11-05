import type { ReactNode } from 'react'
import { CarIllustration } from './CarIllustration'

/** Layout das telas públicas (login, cadastro, admin): painel de marca + formulário. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <div className="car-stage relative hidden flex-col justify-between p-12 lg:flex">
        <p className="text-xl font-extrabold tracking-tight">
          Bernar<span className="text-ink-400">Diesel</span>
        </p>
        <div>
          <CarIllustration marca="BernarDiesel" modelo="Hero" className="w-full max-w-xl" />
          <h2 className="mt-10 max-w-md text-4xl font-bold leading-tight tracking-tight">
            Do pedido ao contrato, sem sair do navegador.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-300">
            Escolha o veículo, acompanhe a análise financeira e feche o aluguel — com crédito
            opcional concedido pelos bancos parceiros.
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-ink-500">
          PUC Minas · DIAW · Laboratório 02
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <p className="mb-8 text-xl font-extrabold tracking-tight lg:hidden">
            Bernar<span className="text-ink-400">Diesel</span>
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mb-8 mt-2 text-sm text-ink-400">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
