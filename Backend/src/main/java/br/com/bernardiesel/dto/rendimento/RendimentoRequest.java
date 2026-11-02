
package br.com.bernardiesel.dto.rendimento;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RendimentoRequest(

    @NotBlank(message = "A entidade empregadora é obrigatória.")
    String entidadeEmpregadora,

    @NotNull(message = "O valor do rendimento é obrigatório.")
    @DecimalMin(value = "0.01", message = "O rendimento deve ser maior que zero.")
    BigDecimal valor

) {
    public RendimentoRequest {
        if (entidadeEmpregadora != null) {
            entidadeEmpregadora = entidadeEmpregadora.trim();
        }
    }
}
