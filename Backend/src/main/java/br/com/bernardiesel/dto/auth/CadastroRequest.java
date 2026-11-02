package br.com.bernardiesel.dto.auth;

import java.util.Locale;

import br.com.bernardiesel.util.CpfUtils;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroRequest(

        @NotBlank(message = "O nome é obrigatório.")
        String nome,

        @NotBlank(message = "O CPF é obrigatório.")
        String cpf,

        @NotBlank(message = "O RG é obrigatório.")
        String rg,

        @NotBlank(message = "O endereço é obrigatório.")
        String endereco,

        @NotBlank(message = "A profissão é obrigatória.")
        String profissao,

        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "Informe um e-mail válido.")
        String email,

        @NotBlank(message = "A senha é obrigatória.")
        @Size(min = 8, message = "A senha deve possuir pelo menos 8 caracteres.")
        String senha

) {
        public CadastroRequest {
                if (email != null) {
                email = email.trim().toLowerCase(Locale.ROOT);
                }
                if (cpf != null) {
                cpf = CpfUtils.normalizar(cpf);
                }
        }

}