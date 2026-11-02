package br.com.bernardiesel.dto.admin;

import java.util.UUID;

import br.com.bernardiesel.model.enums.Perfil;

public record AgenteResponse(

    UUID id,
    String nome,
    String email,
    String cnpj,
    Perfil perfil

) {}