
package br.com.bernardiesel.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import br.com.bernardiesel.dto.rendimento.RendimentoRequest;
import br.com.bernardiesel.dto.rendimento.RendimentoResponse;
import br.com.bernardiesel.service.RendimentoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/clientes/me/rendimentos")
public class RendimentoController {

    private final RendimentoService rendimentoService;

    public RendimentoController(
            RendimentoService rendimentoService) {
        this.rendimentoService = rendimentoService;
    }

    @PostMapping
    public ResponseEntity<RendimentoResponse> cadastrar(
            Authentication authentication,
            @Valid @RequestBody RendimentoRequest dados) {

        RendimentoResponse resposta = rendimentoService.cadastrar(
            authentication.getName(),
            dados
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping
    public ResponseEntity<List<RendimentoResponse>> listar(
            Authentication authentication) {

        return ResponseEntity.ok(
            rendimentoService.listar(authentication.getName())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<RendimentoResponse> atualizar(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody RendimentoRequest dados) {

        return ResponseEntity.ok(
            rendimentoService.atualizar(
                authentication.getName(),
                id,
                dados
            )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            Authentication authentication,
            @PathVariable UUID id) {

        rendimentoService.excluir(
            authentication.getName(),
            id
        );

        return ResponseEntity.noContent().build();
    }
}
