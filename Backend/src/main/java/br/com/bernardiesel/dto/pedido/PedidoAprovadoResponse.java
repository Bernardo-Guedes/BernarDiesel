package br.com.bernardiesel.dto.pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PedidoAprovadoResponse(
        UUID pedidoId,
        LocalDate dataInicio,
        LocalDate dataFim,
        BigDecimal valorTotal,
        UUID clienteId,
        String nomeCliente,
        UUID automovelId,
        String marcaAutomovel,
        String modeloAutomovel,
        String placaAutomovel
) {
}