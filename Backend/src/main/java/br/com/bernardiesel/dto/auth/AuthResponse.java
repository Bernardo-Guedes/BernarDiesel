package br.com.bernardiesel.dto.auth;

import br.com.bernardiesel.model.enums.Perfil;

import java.util.UUID;

public record AuthResponse(

        String accessToken,
        String tokenType,
        Long expiresIn,
        UUID id,
        String nome,
        String email,
        Perfil perfil

) {}