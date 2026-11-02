package br.com.bernardiesel.dto.cliente;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.Locale;

public record AtualizarClienteRequest(

        @NotBlank(message = "O nome é obrigatório.")
        String nome,

        @NotBlank(message = "O RG é obrigatório.")
        String rg,

        @NotBlank(message = "O endereço é obrigatório.")
        String endereco,

        @NotBlank(message = "A profissão é obrigatória.")
        String profissao,

        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "Informe um e-mail válido.")
        String email

) {
    public AtualizarClienteRequest {
        if (nome != null) {
            nome = nome.trim();
        }
        if (rg != null) {
            rg = rg.trim();
        }
        if (endereco != null) {
            endereco = endereco.trim();
        }
        if (profissao != null) {
            profissao = profissao.trim();
        }
        if (email != null) {
            email = email.trim().toLowerCase(Locale.ROOT);
        }
    }
}