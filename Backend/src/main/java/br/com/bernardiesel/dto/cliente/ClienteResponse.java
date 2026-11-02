package br.com.bernardiesel.dto.cliente;

import br.com.bernardiesel.model.Cliente;
import br.com.bernardiesel.model.enums.Perfil;

import java.util.UUID;

public record ClienteResponse(
        UUID id,
        String nome,
        String cpf,
        String rg,
        String endereco,
        String profissao,
        String email,
        Perfil perfil
) {

    public static ClienteResponse fromEntity(Cliente cliente) {
        return new ClienteResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getCpf(),
                cliente.getRg(),
                cliente.getEndereco(),
                cliente.getProfissao(),
                cliente.getEmail(),
                cliente.getPerfil()
        );
    }
}