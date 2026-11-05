export type Perfil = 'CLIENTE' | 'EMPRESA' | 'BANCO'
export type TipoAgente = 'EMPRESA' | 'BANCO'
export type TipoPropriedade = 'CLIENTE' | 'EMPRESA' | 'BANCO'
export type ResultadoParecer = 'POSITIVO' | 'NEGATIVO'
export type StatusPedido =
  | 'EM_ANALISE'
  | 'APROVADO'
  | 'REPROVADO'
  | 'CONTRATADO'
  | 'CANCELADO'

/* ---------- Auth ---------- */
export interface LoginRequest {
  email: string
  senha: string
}

export interface CadastroRequest {
  nome: string
  cpf: string
  rg: string
  endereco: string
  profissao: string
  email: string
  senha: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  id: string
  nome: string
  email: string
  perfil: Perfil
}

export interface SessionUser {
  id: string
  nome: string
  email: string
  perfil: Perfil
}

/* ---------- Cliente ---------- */
export interface Cliente {
  id: string
  nome: string
  cpf: string
  rg: string
  endereco: string
  profissao: string
  email: string
  perfil: Perfil
}

export interface AtualizarClienteRequest {
  nome: string
  rg: string
  endereco: string
  profissao: string
  email: string
}

export interface Rendimento {
  id: string
  entidadeEmpregadora: string
  valor: number
}

export interface RendimentoRequest {
  entidadeEmpregadora: string
  valor: number
}

/* ---------- Automóvel ---------- */
export interface Automovel {
  id: string
  matricula: string
  ano: number
  marca: string
  modelo: string
  placa: string
  valorDiaria: number
  tipoPropriedade: TipoPropriedade
}

/* ---------- Pedido ---------- */
export interface Pedido {
  id: string
  dataInicio: string
  dataFim: string
  valorTotal: number
  status: StatusPedido
  automovelId: string
  marcaAutomovel: string
  modeloAutomovel: string
  placaAutomovel: string
}

export interface CriarPedidoRequest {
  automovelId: string
  dataInicio: string
  dataFim: string
}

export interface AtualizarPedidoRequest {
  dataInicio: string
  dataFim: string
}

export interface ParecerDetalhe {
  id: string
  resultado: ResultadoParecer
  justificativa: string
  dataAvaliacao: string
  agenteId: string
  emailAgente: string
}

export interface ContratoCreditoDetalhe {
  id: string
  valorFinanciado: number
  taxaJuros: number
  prazoMeses: number
  bancoId: string
  nomeBanco: string
}

export interface ContratoAluguelDetalhe {
  id: string
  dataContratacao: string
  agenteId: string
  emailAgente: string
  contratoCredito: ContratoCreditoDetalhe | null
}

export interface PedidoDetalhe {
  id: string
  dataInicio: string
  dataFim: string
  valorTotal: number
  status: StatusPedido
  automovelId: string
  matriculaAutomovel: string
  anoAutomovel: number
  marcaAutomovel: string
  modeloAutomovel: string
  placaAutomovel: string
  clienteId: string
  nomeCliente: string
  parecer: ParecerDetalhe | null
  contratoAluguel: ContratoAluguelDetalhe | null
}

/* ---------- Agente ---------- */
export interface ParecerRequest {
  resultado: ResultadoParecer
  justificativa: string
}

export interface PedidoAprovado {
  pedidoId: string
  dataInicio: string
  dataFim: string
  valorTotal: number
  clienteId: string
  nomeCliente: string
  automovelId: string
  marcaAutomovel: string
  modeloAutomovel: string
  placaAutomovel: string
}

export interface ContratoAluguel {
  id: string
  dataContratacao: string
  pedidoId: string
  dataInicio: string
  dataFim: string
  valorTotal: number
  statusPedido: StatusPedido
  clienteId: string
  nomeCliente: string
  automovelId: string
  marcaAutomovel: string
  modeloAutomovel: string
  placaAutomovel: string
  agenteId: string
  emailAgente: string
}

/* ---------- Crédito ---------- */
export interface ContratoCredito {
  id: string | null
  contratoAluguelId: string
  dataContratacao: string
  pedidoId: string
  dataInicio: string
  dataFim: string
  valorAluguel: number
  clienteId: string
  nomeCliente: string
  automovelId: string
  marcaAutomovel: string
  modeloAutomovel: string
  placaAutomovel: string
  valorFinanciado: number | null
  taxaJuros: number | null
  prazoMeses: number | null
  bancoId: string | null
  nomeBanco: string | null
}

export interface CriarCreditoRequest {
  valorFinanciado: number
  taxaJuros: number
  prazoMeses: number
}

/* ---------- Admin ---------- */
export interface CriarAgenteRequest {
  tipo: TipoAgente
  nome: string
  cnpj: string
  email: string
  senha: string
}

export interface AgenteResponse {
  id: string
  nome: string
  email: string
  cnpj: string
  perfil: Perfil
}

/* ---------- Erro da API ---------- */
export interface ApiError {
  timestamp?: string
  status: number
  error?: string
  message?: string
  details?: Record<string, string> | null
}
