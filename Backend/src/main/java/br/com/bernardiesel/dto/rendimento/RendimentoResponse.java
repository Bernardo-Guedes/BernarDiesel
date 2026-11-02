
package br.com.bernardiesel.dto.rendimento;

import java.math.BigDecimal;
import java.util.UUID;

public record RendimentoResponse(
    UUID id,
    String entidadeEmpregadora,
    BigDecimal valor
) {}
