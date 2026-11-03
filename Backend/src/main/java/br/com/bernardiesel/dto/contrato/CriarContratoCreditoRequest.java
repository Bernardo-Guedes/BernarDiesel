package br.com.bernardiesel.dto.contrato;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CriarContratoCreditoRequest(

        @NotNull(message = "O valor financiado é obrigatório.")
        @DecimalMin(
                value = "0.01",
                message = "O valor financiado deve ser maior que zero."
        )
        BigDecimal valorFinanciado,

        @NotNull(message = "A taxa de juros é obrigatória.")
        @DecimalMin(
                value = "0.00",
                message = "A taxa de juros não pode ser negativa."
        )
        BigDecimal taxaJuros,

        @NotNull(message = "O prazo em meses é obrigatório.")
        @Positive(message = "O prazo deve ser maior que zero.")
        Integer prazoMeses
) {}