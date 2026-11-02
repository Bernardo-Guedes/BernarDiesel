package br.com.bernardiesel.controller;

import br.com.bernardiesel.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> desativarConta(
            Authentication authentication
    ) {

        usuarioService.desativarConta(authentication.getName());

        return ResponseEntity.noContent().build();
    }
}