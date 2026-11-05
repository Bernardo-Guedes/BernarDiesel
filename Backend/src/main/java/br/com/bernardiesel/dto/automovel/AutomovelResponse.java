package br.com.bernardiesel.dto.automovel;

import java.math.BigDecimal;
import java.util.UUID;

import br.com.bernardiesel.model.enums.TipoPropriedade;

public record AutomovelResponse(
        UUID id,
        String matricula,
        Integer ano,
        String marca,
        String modelo,
        String placa,
        BigDecimal valorDiaria,
        TipoPropriedade tipoPropriedade
) {}