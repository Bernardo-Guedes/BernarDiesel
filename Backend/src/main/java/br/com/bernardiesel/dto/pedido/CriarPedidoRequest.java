package br.com.bernardiesel.dto.pedido;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

public record CriarPedidoRequest(

        @NotNull(message = "O automóvel é obrigatório.")
        UUID automovelId,

        @NotNull(message = "A data de início é obrigatória.")
        @Future(message = "A data de início deve ser futura.")
        LocalDate dataInicio,

        @NotNull(message = "A data de término é obrigatória.")
        @Future(message = "A data de término deve ser futura.")
        LocalDate dataFim

) {}