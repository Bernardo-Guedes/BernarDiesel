package br.com.bernardiesel.dto.parecer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import br.com.bernardiesel.model.enums.ResultadoParecer;

public record ParecerFinanceiroRequest(

        @NotNull(message = "O resultado do parecer é obrigatório.")
        ResultadoParecer resultado,

        @NotBlank(message = "A justificativa é obrigatória.")
        @Size(
                max = 5000,
                message = "A justificativa deve possuir no máximo 5000 caracteres."
        )
        String justificativa

) {}