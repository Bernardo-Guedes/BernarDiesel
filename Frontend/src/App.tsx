import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import { Layout } from './components/Layout'
import { HomeRedirect, ProtectedRoute } from './routes/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import CadastroPage from './pages/CadastroPage'
import AdminAgentesPage from './pages/admin/AdminAgentesPage'

import NovoPedidoPage from './pages/cliente/NovoPedidoPage'
import MeusPedidosPage from './pages/cliente/MeusPedidosPage'
import PedidoDetalhePage from './pages/cliente/PedidoDetalhePage'
import CreditosClientePage from './pages/cliente/CreditosClientePage'
import MeusDadosPage from './pages/cliente/MeusDadosPage'

import AvaliacaoPage from './pages/agente/AvaliacaoPage'
import AgentePedidoPage from './pages/agente/AgentePedidoPage'
import ContratacaoPage from './pages/agente/ContratacaoPage'
import ContratosPage from './pages/agente/ContratosPage'

import CreditosDisponiveisPage from './pages/banco/CreditosDisponiveisPage'
import CreditosBancoPage from './pages/banco/CreditosBancoPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/admin/agentes" element={<AdminAgentesPage />} />

          {/* Autenticadas */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomeRedirect />} />

            {/* Cliente */}
            <Route element={<ProtectedRoute roles={['CLIENTE']} />}>
              <Route path="/pedidos" element={<MeusPedidosPage />} />
              <Route path="/pedidos/novo" element={<NovoPedidoPage />} />
              <Route path="/pedidos/:id" element={<PedidoDetalhePage />} />
              <Route path="/creditos" element={<CreditosClientePage />} />
              <Route path="/meus-dados" element={<MeusDadosPage />} />
            </Route>

            {/* Agentes (empresa e banco) */}
            <Route element={<ProtectedRoute roles={['EMPRESA', 'BANCO']} />}>
              <Route path="/agente/avaliacao" element={<AvaliacaoPage />} />
              <Route path="/agente/pedidos/:id" element={<AgentePedidoPage />} />
              <Route path="/agente/contratacao" element={<ContratacaoPage />} />
              <Route path="/agente/contratos" element={<ContratosPage />} />
            </Route>

            {/* Somente banco */}
            <Route element={<ProtectedRoute roles={['BANCO']} />}>
              <Route path="/banco/creditos/disponiveis" element={<CreditosDisponiveisPage />} />
              <Route path="/banco/creditos" element={<CreditosBancoPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}