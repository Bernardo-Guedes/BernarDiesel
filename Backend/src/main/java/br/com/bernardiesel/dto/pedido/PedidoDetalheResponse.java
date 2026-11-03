package br.com.bernardiesel.dto.pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import br.com.bernardiesel.model.enums.StatusPedido;

public record PedidoDetalheResponse(
        UUID id,
        LocalDate dataInicio,
        LocalDate dataFim,
        BigDecimal valorTotal,
        StatusPedido status,

        UUID automovelId,
        String matriculaAutomovel,
        Integer anoAutomovel,
        String marcaAutomovel,
        String modeloAutomovel,
        String placaAutomovel,

        UUID clienteId,
        String nomeCliente,

        ParecerDetalheResponse parecer,
        ContratoAluguelDetalheResponse contratoAluguel
) {

    public record ParecerDetalheResponse(
            UUID id,
            String resultado,
            String justificativa,
            LocalDateTime dataAvaliacao,
            UUID agenteId,
            String emailAgente
    ) {
    }

    public record ContratoAluguelDetalheResponse(
            UUID id,
            LocalDateTime dataContratacao,
            UUID agenteId,
            String emailAgente,
            ContratoCreditoDetalheResponse contratoCredito
    ) {
    }

    public record ContratoCreditoDetalheResponse(
            UUID id,
            BigDecimal valorFinanciado,
            BigDecimal taxaJuros,
            Integer prazoMeses,
            UUID bancoId,
            String nomeBanco
    ) {
    }
}