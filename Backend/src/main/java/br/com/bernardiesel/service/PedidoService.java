
package br.com.bernardiesel.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.bernardiesel.dto.pedido.AtualizarPedidoRequest;
import br.com.bernardiesel.dto.pedido.CriarPedidoRequest;
import br.com.bernardiesel.dto.pedido.PedidoResponse;
import br.com.bernardiesel.model.Automovel;
import br.com.bernardiesel.model.Cliente;
import br.com.bernardiesel.model.Pedido;
import br.com.bernardiesel.model.enums.StatusPedido;
import br.com.bernardiesel.repository.AutomovelRepository;
import br.com.bernardiesel.repository.ClienteRepository;
import br.com.bernardiesel.repository.PedidoRepository;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ClienteRepository clienteRepository,
            AutomovelRepository automovelRepository) {

        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.automovelRepository = automovelRepository;
    }

    // Criar pedido
    @Transactional
    public PedidoResponse criar(String email, CriarPedidoRequest dados) {

        Cliente cliente = buscarClienteAutenticado(email);

        Automovel automovel = automovelRepository.findById(dados.automovelId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Automóvel não encontrado."
                ));

        validarDatas(dados.dataInicio(), dados.dataFim());

        validarDisponibilidade(
                automovel.getId(),
                dados.dataInicio(),
                dados.dataFim(),
                null
        );

        long quantidadeDias = ChronoUnit.DAYS.between(
                dados.dataInicio(),
                dados.dataFim()
        );

        BigDecimal valorTotal = automovel.getValorDiaria()
                .multiply(BigDecimal.valueOf(quantidadeDias));

        Pedido pedido = new Pedido();
        pedido.setDataInicio(dados.dataInicio());
        pedido.setDataFim(dados.dataFim());
        pedido.setValorTotal(valorTotal);
        pedido.setStatus(StatusPedido.EM_ANALISE);
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        return converterParaResponse(pedidoSalvo);
    }

    // Listar pedidos do cliente autenticado
    @Transactional(readOnly = true)
    public List<PedidoResponse> listar(String email) {

        Cliente cliente = buscarClienteAutenticado(email);

        return pedidoRepository.findAllByClienteId(cliente.getId())
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    // Buscar pedido específico
    @Transactional(readOnly = true)
    public PedidoResponse buscarPorId(String email, UUID id) {

        Cliente cliente = buscarClienteAutenticado(email);

        Pedido pedido = buscarPedidoDoCliente(id, cliente.getId());

        return converterParaResponse(pedido);
    }

    // Atualizar pedido
    @Transactional
    public PedidoResponse atualizar(
            String email,
            UUID id,
            AtualizarPedidoRequest dados) {

        Cliente cliente = buscarClienteAutenticado(email);

        Pedido pedido = buscarPedidoDoCliente(id, cliente.getId());

        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Somente pedidos em análise podem ser alterados."
            );
        }

        validarDatas(dados.dataInicio(), dados.dataFim());

        validarDisponibilidade(
                pedido.getAutomovel().getId(),
                dados.dataInicio(),
                dados.dataFim(),
                pedido.getId()
        );

        long quantidadeDias = ChronoUnit.DAYS.between(
                dados.dataInicio(),
                dados.dataFim()
        );

        BigDecimal valorTotal = pedido.getAutomovel().getValorDiaria()
                .multiply(BigDecimal.valueOf(quantidadeDias));

        pedido.setDataInicio(dados.dataInicio());
        pedido.setDataFim(dados.dataFim());
        pedido.setValorTotal(valorTotal);

        Pedido pedidoAtualizado = pedidoRepository.save(pedido);

        return converterParaResponse(pedidoAtualizado);
    }

    // Cancelar pedido
    @Transactional
    public void cancelar(String email, UUID id) {

        Cliente cliente = buscarClienteAutenticado(email);

        Pedido pedido = buscarPedidoDoCliente(id, cliente.getId());

        if (pedido.getStatus() == StatusPedido.CONTRATADO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível cancelar um pedido já contratado."
            );
        }

        if (pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este pedido já foi cancelado."
            );
        }

        if (pedido.getStatus() == StatusPedido.REPROVADO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível cancelar um pedido reprovado."
            );
        }

        pedido.setStatus(StatusPedido.CANCELADO);

        pedidoRepository.save(pedido);
    }

    // Buscar cliente autenticado pelo e-mail do token JWT
    private Cliente buscarClienteAutenticado(String email) {

        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cliente não encontrado."
                ));
    }

    // Buscar pedido garantindo que pertence ao cliente
    private Pedido buscarPedidoDoCliente(UUID pedidoId, UUID clienteId) {

        return pedidoRepository.findByIdAndClienteId(pedidoId, clienteId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Pedido não encontrado."
                ));
    }

    // Validar período solicitado
    private void validarDatas(LocalDate dataInicio, LocalDate dataFim) {

        if (!dataInicio.isAfter(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A data de início deve ser posterior à data atual."
            );
        }

        if (!dataFim.isAfter(dataInicio)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A data de término deve ser posterior à data de início."
            );
        }
    }

    // Verificar disponibilidade do automóvel
    private void validarDisponibilidade(
            UUID automovelId,
            LocalDate dataInicio,
            LocalDate dataFim,
            UUID pedidoIdIgnorado) {

        List<StatusPedido> statusQueReservam = List.of(
                StatusPedido.EM_ANALISE,
                StatusPedido.APROVADO,
                StatusPedido.CONTRATADO
        );

        boolean existeConflito;

        if (pedidoIdIgnorado == null) {

            existeConflito = pedidoRepository
                    .existsByAutomovelIdAndStatusInAndDataInicioLessThanAndDataFimGreaterThan(
                            automovelId,
                            statusQueReservam,
                            dataFim,
                            dataInicio
                    );

        } else {

            existeConflito = pedidoRepository
                    .existeConflitoAoAtualizar(
                            automovelId,
                            pedidoIdIgnorado,
                            statusQueReservam,
                            dataFim,
                            dataInicio
                    );
        }

        if (existeConflito) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "O automóvel não está disponível para o período informado."
            );
        }
    }

    // Converter entidade para DTO de resposta
    private PedidoResponse converterParaResponse(Pedido pedido) {

        return new PedidoResponse(
                pedido.getId(),
                pedido.getDataInicio(),
                pedido.getDataFim(),
                pedido.getValorTotal(),
                pedido.getStatus(),
                pedido.getAutomovel().getId(),
                pedido.getAutomovel().getMarca(),
                pedido.getAutomovel().getModelo(),
                pedido.getAutomovel().getPlaca()
        );
    }
}
