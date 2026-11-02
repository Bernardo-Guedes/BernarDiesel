package br.com.bernardiesel.controller;

import br.com.bernardiesel.dto.cliente.AtualizarClienteRequest;
import br.com.bernardiesel.dto.cliente.ClienteResponse;
import br.com.bernardiesel.service.ClienteService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping("/me")
    public ResponseEntity<ClienteResponse> buscarMeuPerfil(
            Authentication authentication
    ) {

        ClienteResponse resposta = clienteService.buscarMeuPerfil(
                authentication.getName()
        );

        return ResponseEntity.ok(resposta);
    }

    @PutMapping("/me")
    public ResponseEntity<ClienteResponse> atualizarMeuPerfil(
            Authentication authentication,
            @Valid @RequestBody AtualizarClienteRequest dados
    ) {
        ClienteResponse resposta =
                clienteService.atualizarMeuPerfil(
                        authentication.getName(),
                        dados
                );

        return ResponseEntity.ok(resposta);
    }
}