package br.com.bernardiesel.dto.parecer;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.bernardiesel.model.enums.ResultadoParecer;

public record ParecerFinanceiroResponse(

        UUID id,
        UUID pedidoId,
        ResultadoParecer resultado,
        String justificativa,
        LocalDateTime dataAvaliacao,
        UUID agenteId

) {}