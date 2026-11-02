package br.com.bernardiesel.dto.pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import br.com.bernardiesel.model.enums.StatusPedido;

public record PedidoResponse(
        UUID id,
        LocalDate dataInicio,
        LocalDate dataFim,
        BigDecimal valorTotal,
        StatusPedido status,
        UUID automovelId,
        String marcaAutomovel,
        String modeloAutomovel,
        String placaAutomovel
) {}