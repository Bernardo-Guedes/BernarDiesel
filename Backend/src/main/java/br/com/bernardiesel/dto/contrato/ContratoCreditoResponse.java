package br.com.bernardiesel.dto.contrato;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record ContratoCreditoResponse(
        UUID id,
        UUID contratoAluguelId,
        LocalDateTime dataContratacao,
        UUID pedidoId,
        LocalDate dataInicio,
        LocalDate dataFim,
        BigDecimal valorAluguel,
        UUID clienteId,
        String nomeCliente,
        UUID automovelId,
        String marcaAutomovel,
        String modeloAutomovel,
        String placaAutomovel,
        BigDecimal valorFinanciado,
        BigDecimal taxaJuros,
        Integer prazoMeses,
        UUID bancoId,
        String nomeBanco
) {}