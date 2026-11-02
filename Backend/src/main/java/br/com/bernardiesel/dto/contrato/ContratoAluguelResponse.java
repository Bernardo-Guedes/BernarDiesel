package br.com.bernardiesel.dto.contrato;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import br.com.bernardiesel.model.enums.StatusPedido;

public record ContratoAluguelResponse(
        UUID id,
        LocalDateTime dataContratacao,
        UUID pedidoId,
        LocalDate dataInicio,
        LocalDate dataFim,
        BigDecimal valorTotal,
        StatusPedido statusPedido,
        UUID clienteId,
        String nomeCliente,
        UUID automovelId,
        String marcaAutomovel,
        String modeloAutomovel,
        String placaAutomovel,
        UUID agenteId,
        String emailAgente
) {
}