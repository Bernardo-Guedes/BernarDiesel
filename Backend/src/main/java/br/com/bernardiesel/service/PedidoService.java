package br.com.bernardiesel.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.bernardiesel.dto.pedido.AtualizarPedidoRequest;
import br.com.bernardiesel.dto.pedido.CriarPedidoRequest;
import br.com.bernardiesel.dto.pedido.PedidoDetalheResponse;
import br.com.bernardiesel.dto.pedido.PedidoResponse;
import br.com.bernardiesel.dto.rendimento.RendimentoResponse;
import br.com.bernardiesel.model.Agente;
import br.com.bernardiesel.model.Automovel;
import br.com.bernardiesel.model.Banco;
import br.com.bernardiesel.model.Cliente;
import br.com.bernardiesel.model.ContratoAluguel;
import br.com.bernardiesel.model.ContratoCredito;
import br.com.bernardiesel.model.ParecerFinanceiro;
import br.com.bernardiesel.model.Pedido;
import br.com.bernardiesel.model.enums.StatusPedido;
import br.com.bernardiesel.repository.AgenteRepository;
import br.com.bernardiesel.repository.AutomovelRepository;
import br.com.bernardiesel.repository.ClienteRepository;
import br.com.bernardiesel.repository.ContratoAluguelRepository;
import br.com.bernardiesel.repository.ContratoCreditoRepository;
import br.com.bernardiesel.repository.ParecerFinanceiroRepository;
import br.com.bernardiesel.repository.PedidoRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class PedidoService {

        private final PedidoRepository pedidoRepository;
        private final ClienteRepository clienteRepository;
        private final AutomovelRepository automovelRepository;
        private final AgenteRepository agenteRepository;
        private final ParecerFinanceiroRepository parecerFinanceiroRepository;
        private final ContratoAluguelRepository contratoAluguelRepository;
        private final ContratoCreditoRepository contratoCreditoRepository;

        public PedidoService(
                        PedidoRepository pedidoRepository,
                        ClienteRepository clienteRepository,
                        AutomovelRepository automovelRepository,
                        AgenteRepository agenteRepository,
                        ParecerFinanceiroRepository parecerFinanceiroRepository,
                        ContratoAluguelRepository contratoAluguelRepository,
                        ContratoCreditoRepository contratoCreditoRepository) {

                this.pedidoRepository = pedidoRepository;
                this.clienteRepository = clienteRepository;
                this.automovelRepository = automovelRepository;
                this.agenteRepository = agenteRepository;
                this.parecerFinanceiroRepository = parecerFinanceiroRepository;
                this.contratoAluguelRepository = contratoAluguelRepository;
                this.contratoCreditoRepository = contratoCreditoRepository;
        }

        public PedidoResponse criar(String email, CriarPedidoRequest dados) {
                Cliente cliente = buscarClientePorEmail(email);

                Automovel automovel = automovelRepository.findById(dados.automovelId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Automóvel não encontrado."));

                validarDatas(dados.dataInicio(), dados.dataFim());

                validarDisponibilidade(
                                automovel.getId(),
                                dados.dataInicio(),
                                dados.dataFim(),
                                null);

                long quantidadeDias = ChronoUnit.DAYS.between(
                                dados.dataInicio(),
                                dados.dataFim());

                BigDecimal valorTotal = automovel.getValorDiaria()
                                .multiply(BigDecimal.valueOf(quantidadeDias));

                Pedido pedido = new Pedido();
                pedido.setCliente(cliente);
                pedido.setAutomovel(automovel);
                pedido.setDataInicio(dados.dataInicio());
                pedido.setDataFim(dados.dataFim());
                pedido.setValorTotal(valorTotal);
                pedido.setStatus(StatusPedido.EM_ANALISE);

                Pedido pedidoSalvo = pedidoRepository.save(pedido);

                return converterParaResponse(pedidoSalvo);
        }

        @Transactional(readOnly = true)
        public List<PedidoResponse> listar(String email) {
                Cliente cliente = buscarClientePorEmail(email);

                return pedidoRepository.findAllByClienteId(cliente.getId())
                                .stream()
                                .map(this::converterParaResponse)
                                .toList();
        }

        @Transactional(readOnly = true)
        public PedidoResponse buscarPorId(String email, UUID pedidoId) {
                Cliente cliente = buscarClientePorEmail(email);

                Pedido pedido = buscarPedidoDoCliente(pedidoId, cliente.getId());

                return converterParaResponse(pedido);
        }

        public PedidoResponse atualizar(
                        String email,
                        UUID pedidoId,
                        AtualizarPedidoRequest dados) {

                Cliente cliente = buscarClientePorEmail(email);

                Pedido pedido = buscarPedidoDoCliente(pedidoId, cliente.getId());

                if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
                        throw new IllegalArgumentException(
                                        "Somente pedidos em análise podem ser atualizados.");
                }

                validarDatas(dados.dataInicio(), dados.dataFim());

                validarDisponibilidade(
                                pedido.getAutomovel().getId(),
                                dados.dataInicio(),
                                dados.dataFim(),
                                pedido.getId());

                long quantidadeDias = ChronoUnit.DAYS.between(
                                dados.dataInicio(),
                                dados.dataFim());

                BigDecimal valorTotal = pedido.getAutomovel()
                                .getValorDiaria()
                                .multiply(BigDecimal.valueOf(quantidadeDias));

                pedido.setDataInicio(dados.dataInicio());
                pedido.setDataFim(dados.dataFim());
                pedido.setValorTotal(valorTotal);

                Pedido pedidoAtualizado = pedidoRepository.save(pedido);

                return converterParaResponse(pedidoAtualizado);
        }

        public void cancelar(String email, UUID pedidoId) {
                Cliente cliente = buscarClientePorEmail(email);

                Pedido pedido = buscarPedidoDoCliente(pedidoId, cliente.getId());

                if (pedido.getStatus() != StatusPedido.EM_ANALISE
                                && pedido.getStatus() != StatusPedido.APROVADO) {
                        throw new IllegalArgumentException(
                                        "Somente pedidos em análise ou aprovados podem ser cancelados.");
                }

                pedido.setStatus(StatusPedido.CANCELADO);

                pedidoRepository.save(pedido);
        }

        @Transactional(readOnly = true)
        public PedidoDetalheResponse buscarDetalhePorCliente(
                        String email,
                        UUID pedidoId) {

                Cliente cliente = buscarClientePorEmail(email);

                Pedido pedido = buscarPedidoDoCliente(pedidoId, cliente.getId());

                return converterParaDetalhe(pedido);
        }

        @Transactional(readOnly = true)
        public PedidoDetalheResponse buscarDetalhePorAgente(
                        String email,
                        UUID pedidoId) {

                Agente agente = agenteRepository.findByEmail(email)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Agente não encontrado."));

                Pedido pedido = pedidoRepository.findById(pedidoId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Pedido não encontrado."));

                boolean pedidoEmAnaliseOuAprovado = pedido.getStatus() == StatusPedido.EM_ANALISE
                                || pedido.getStatus() == StatusPedido.APROVADO;

                ParecerFinanceiro parecer = parecerFinanceiroRepository
                                .findByPedidoId(pedidoId)
                                .orElse(null);

                ContratoAluguel contratoAluguel = contratoAluguelRepository
                                .findByPedidoId(pedidoId)
                                .orElse(null);

                ContratoCredito contratoCredito = null;

                if (contratoAluguel != null) {
                        contratoCredito = contratoCreditoRepository
                                        .findByContratoAluguelId(contratoAluguel.getId())
                                        .orElse(null);
                }

                boolean agenteResponsavelPeloParecer = parecer != null
                                && parecer.getAgente().getId().equals(agente.getId());

                boolean agenteResponsavelPeloContrato = contratoAluguel != null
                                && contratoAluguel.getAgente().getId().equals(agente.getId());

                boolean bancoResponsavelPeloCredito = contratoCredito != null
                                && contratoCredito.getBanco().getId().equals(agente.getId());

                if (!pedidoEmAnaliseOuAprovado
                                && !agenteResponsavelPeloParecer
                                && !agenteResponsavelPeloContrato
                                && !bancoResponsavelPeloCredito) {

                        throw new IllegalArgumentException(
                                        "Você não tem permissão para consultar este pedido.");
                }

                return converterParaDetalhe(pedido);
        }

        @Transactional(readOnly = true)
        public List<RendimentoResponse> listarRendimentosDoClientePorAgente(
                        String email,
                        UUID pedidoId) {

                buscarDetalhePorAgente(email, pedidoId);

                Pedido pedido = pedidoRepository.findById(pedidoId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Pedido não encontrado."));

                return pedido.getCliente().getRendimentos()
                                .stream()
                                .map(r -> new RendimentoResponse(
                                                r.getId(),
                                                r.getEntidadeEmpregadora(),
                                                r.getValor()))
                                .toList();
        }

        private Cliente buscarClientePorEmail(String email) {
                return clienteRepository.findByEmail(email)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Cliente não encontrado."));
        }

        private Pedido buscarPedidoDoCliente(UUID pedidoId, UUID clienteId) {
                return pedidoRepository.findByIdAndClienteId(pedidoId, clienteId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Pedido não encontrado."));
        }

        private void validarDatas(LocalDate dataInicio, LocalDate dataFim) {
                if (dataInicio == null || dataFim == null) {
                        throw new IllegalArgumentException(
                                        "As datas de início e fim são obrigatórias.");
                }

                if (!dataInicio.isAfter(LocalDate.now())) {
                        throw new IllegalArgumentException(
                                        "A data de início deve ser futura.");
                }

                if (!dataFim.isAfter(dataInicio)) {
                        throw new IllegalArgumentException(
                                        "A data de fim deve ser posterior à data de início.");
                }
        }

        private void validarDisponibilidade(
                        UUID automovelId,
                        LocalDate dataInicio,
                        LocalDate dataFim,
                        UUID pedidoIdIgnorado) {

                boolean existeConflito;

                if (pedidoIdIgnorado == null) {
                        existeConflito = pedidoRepository
                                        .existsByAutomovelIdAndStatusInAndDataInicioLessThanAndDataFimGreaterThan(
                                                        automovelId,
                                                        List.of(
                                                                        StatusPedido.EM_ANALISE,
                                                                        StatusPedido.APROVADO,
                                                                        StatusPedido.CONTRATADO),
                                                        dataFim,
                                                        dataInicio);
                } else {
                        existeConflito = pedidoRepository.existeConflitoAoAtualizar(automovelId, pedidoIdIgnorado,
                                        List.of(
                                                        StatusPedido.EM_ANALISE,
                                                        StatusPedido.APROVADO,
                                                        StatusPedido.CONTRATADO),
                                        dataFim,
                                        dataInicio);
                }

                if (existeConflito) {
                        throw new IllegalArgumentException(
                                        "O automóvel não está disponível para o período informado.");
                }
        }

        private PedidoResponse converterParaResponse(Pedido pedido) {
                Automovel automovel = pedido.getAutomovel();

                return new PedidoResponse(
                                pedido.getId(),
                                pedido.getDataInicio(),
                                pedido.getDataFim(),
                                pedido.getValorTotal(),
                                pedido.getStatus(),
                                automovel.getId(),
                                automovel.getMarca(),
                                automovel.getModelo(),
                                automovel.getPlaca());
        }

        private PedidoDetalheResponse converterParaDetalhe(Pedido pedido) {
                Automovel automovel = pedido.getAutomovel();
                Cliente cliente = pedido.getCliente();

                ParecerFinanceiro parecer = parecerFinanceiroRepository
                                .findByPedidoId(pedido.getId())
                                .orElse(null);

                ContratoAluguel contratoAluguel = contratoAluguelRepository
                                .findByPedidoId(pedido.getId())
                                .orElse(null);

                PedidoDetalheResponse.ParecerDetalheResponse parecerResponse = null;

                if (parecer != null) {
                        Agente agenteParecer = parecer.getAgente();

                        parecerResponse = new PedidoDetalheResponse.ParecerDetalheResponse(
                                        parecer.getId(),
                                        parecer.getResultado().name(),
                                        parecer.getJustificativa(),
                                        parecer.getDataAvaliacao(),
                                        agenteParecer.getId(),
                                        agenteParecer.getEmail());
                }

                PedidoDetalheResponse.ContratoAluguelDetalheResponse contratoAluguelResponse = null;

                if (contratoAluguel != null) {
                        Agente agenteContrato = contratoAluguel.getAgente();

                        ContratoCredito contratoCredito = contratoCreditoRepository
                                        .findByContratoAluguelId(contratoAluguel.getId())
                                        .orElse(null);

                        PedidoDetalheResponse.ContratoCreditoDetalheResponse creditoResponse = null;

                        if (contratoCredito != null) {
                                Banco banco = contratoCredito.getBanco();

                                creditoResponse = new PedidoDetalheResponse.ContratoCreditoDetalheResponse(
                                                contratoCredito.getId(),
                                                contratoCredito.getValorFinanciado(),
                                                contratoCredito.getTaxaJuros(),
                                                contratoCredito.getPrazoMeses(),
                                                banco.getId(),
                                                banco.getNome());
                        }

                        contratoAluguelResponse = new PedidoDetalheResponse.ContratoAluguelDetalheResponse(
                                        contratoAluguel.getId(),
                                        contratoAluguel.getDataContratacao(),
                                        agenteContrato.getId(),
                                        agenteContrato.getEmail(),
                                        creditoResponse);
                }

                return new PedidoDetalheResponse(
                                pedido.getId(),
                                pedido.getDataInicio(),
                                pedido.getDataFim(),
                                pedido.getValorTotal(),
                                pedido.getStatus(),
                                automovel.getId(),
                                automovel.getMatricula(),
                                automovel.getAno(),
                                automovel.getMarca(),
                                automovel.getModelo(),
                                automovel.getPlaca(),
                                cliente.getId(),
                                cliente.getNome(),
                                parecerResponse,
                                contratoAluguelResponse);
        }
}