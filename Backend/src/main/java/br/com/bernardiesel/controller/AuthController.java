package br.com.bernardiesel.controller;

import br.com.bernardiesel.dto.auth.AuthResponse;
import br.com.bernardiesel.dto.auth.CadastroRequest;
import br.com.bernardiesel.dto.auth.LoginRequest;
import br.com.bernardiesel.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> cadastrar(
            @Valid @RequestBody CadastroRequest dados
    ) {

        AuthResponse resposta = authService.cadastrarCliente(dados);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest dados
    ) {

        AuthResponse resposta = authService.login(dados);

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/me")
    public ResponseEntity<?> usuarioAutenticado(
            org.springframework.security.core.Authentication authentication
    ) {

        return ResponseEntity.ok(
                java.util.Map.of(
                        "email", authentication.getName()
                )
        );
    }
}