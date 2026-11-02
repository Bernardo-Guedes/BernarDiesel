package br.com.bernardiesel.dto.admin;

import java.util.Locale;

import br.com.bernardiesel.model.enums.TipoAgente;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CriarAgenteRequest(

    @NotNull(message = "O tipo do agente é obrigatório.")
    TipoAgente tipo,

    @NotBlank(message = "O nome é obrigatório.")
    @Size(max = 255, message = "O nome deve possuir no máximo 255 caracteres.")
    String nome,

    @NotBlank(message = "O CNPJ é obrigatório.")
    String cnpj,

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Informe um e-mail válido.")
    @Size(max = 255)
    String email,

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 8, message = "A senha deve possuir pelo menos 8 caracteres.")
    String senha

) {

    public CriarAgenteRequest {

        if (email != null) {
            email = email.trim().toLowerCase(Locale.ROOT);
        }

        if (nome != null) {
            nome = nome.trim();
        }

        if (cnpj != null) {
            cnpj = cnpj.replaceAll("\\D", "");
        }
    }
}