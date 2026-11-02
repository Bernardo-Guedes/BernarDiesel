package br.com.bernardiesel.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.bernardiesel.dto.contrato.ContratoAluguelResponse;
import br.com.bernardiesel.model.Agente;
import br.com.bernardiesel.model.ContratoAluguel;
import br.com.bernardiesel.model.Pedido;
import br.com.bernardiesel.model.enums.StatusPedido;
import br.com.bernardiesel.repository.AgenteRepository;
import br.com.bernardiesel.repository.ContratoAluguelRepository;
import br.com.bernardiesel.repository.PedidoRepository;
import br.com.bernardiesel.dto.pedido.PedidoAprovadoResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContratoAluguelService {

    private final ContratoAluguelRepository contratoAluguelRepository;
    private final PedidoRepository pedidoRepository;
    private final AgenteRepository agenteRepository;

    @Transactional(readOnly = true)
    public List<PedidoAprovadoResponse> listarPedidosAprovados(String email) {
        buscarAgenteAutenticado(email);
        return pedidoRepository
                .findAllByStatusOrderByDataInicioAsc(StatusPedido.APROVADO)
                .stream()
                .map(this::mapearPedidoAprovado)
                .toList();
    }

    @Transactional
    public ContratoAluguelResponse contratarPedido(
            UUID pedidoId,
            String email
    ) {

        Agente agente = buscarAgenteAutenticado(email);

        // Bloqueia o pedido durante a transação para evitar
        // que dois agentes contratem o mesmo pedido simultaneamente.
        Pedido pedido = pedidoRepository
                .buscarPorIdComBloqueio(pedidoId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Pedido não encontrado.")
                );

        if (pedido.getStatus() != StatusPedido.APROVADO) {
            throw new IllegalArgumentException(
                    "Somente pedidos aprovados podem ser contratados."
            );
        }

        if (contratoAluguelRepository.existsByPedidoId(pedidoId)) {
            throw new IllegalArgumentException(
                    "Este pedido já possui um contrato de aluguel."
            );
        }

        ContratoAluguel contrato = new ContratoAluguel();

        contrato.setDataContratacao(LocalDateTime.now());
        contrato.setPedido(pedido);
        contrato.setAgente(agente);

        ContratoAluguel contratoSalvo =
                contratoAluguelRepository.save(contrato);

        pedido.setStatus(StatusPedido.CONTRATADO);
        pedidoRepository.save(pedido);

        return mapearContrato(contratoSalvo);
    }

    @Transactional(readOnly = true)
    public List<ContratoAluguelResponse> listarMeusContratos(String email) {

        Agente agente = buscarAgenteAutenticado(email);

        return contratoAluguelRepository
                .findAllByAgenteIdOrderByDataContratacaoDesc(agente.getId())
                .stream()
                .map(this::mapearContrato)
                .toList();
    }

    private Agente buscarAgenteAutenticado(String email) {

        return agenteRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Agente não encontrado."
                        )
                );
    }

    private PedidoAprovadoResponse mapearPedidoAprovado(Pedido pedido) {

    return new PedidoAprovadoResponse(
            pedido.getId(),
            pedido.getDataInicio(),
            pedido.getDataFim(),
            pedido.getValorTotal(),
            pedido.getCliente().getId(),
            pedido.getCliente().getNome(),
            pedido.getAutomovel().getId(),
            pedido.getAutomovel().getMarca(),
            pedido.getAutomovel().getModelo(),
            pedido.getAutomovel().getPlaca()
        );
    }

    private ContratoAluguelResponse mapearContrato(
            ContratoAluguel contrato
    ) {

        Pedido pedido = contrato.getPedido();
        Agente agente = contrato.getAgente();

        return new ContratoAluguelResponse(
                contrato.getId(),
                contrato.getDataContratacao(),
                pedido.getId(),
                pedido.getDataInicio(),
                pedido.getDataFim(),
                pedido.getValorTotal(),
                pedido.getStatus(),
                pedido.getCliente().getId(),
                pedido.getCliente().getNome(),
                pedido.getAutomovel().getId(),
                pedido.getAutomovel().getMarca(),
                pedido.getAutomovel().getModelo(),
                pedido.getAutomovel().getPlaca(),
                agente.getId(),
                agente.getEmail()
        );
    }
}