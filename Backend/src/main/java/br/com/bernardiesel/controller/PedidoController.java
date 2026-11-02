package br.com.bernardiesel.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import br.com.bernardiesel.dto.pedido.AtualizarPedidoRequest;
import br.com.bernardiesel.dto.pedido.CriarPedidoRequest;
import br.com.bernardiesel.dto.pedido.PedidoResponse;
import br.com.bernardiesel.service.PedidoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/clientes/me/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // Criar um pedido de aluguel
    @PostMapping
    public ResponseEntity<PedidoResponse> criar(
            Authentication authentication,
            @Valid @RequestBody CriarPedidoRequest dados) {

        PedidoResponse resposta = pedidoService.criar(
                authentication.getName(),
                dados
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }

    // Listar pedidos do cliente autenticado
    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listar(
            Authentication authentication) {

        return ResponseEntity.ok(
                pedidoService.listar(authentication.getName())
        );
    }

    // Buscar um pedido específico
    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> buscarPorId(
            Authentication authentication,
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                pedidoService.buscarPorId(
                        authentication.getName(),
                        id
                )
        );
    }

    // Atualizar um pedido
    @PutMapping("/{id}")
    public ResponseEntity<PedidoResponse> atualizar(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody AtualizarPedidoRequest dados) {

        return ResponseEntity.ok(
                pedidoService.atualizar(
                        authentication.getName(),
                        id,
                        dados
                )
        );
    }

    // Cancelar um pedido
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(
            Authentication authentication,
            @PathVariable UUID id) {

        pedidoService.cancelar(
                authentication.getName(),
                id
        );

        return ResponseEntity.noContent().build();
    }
}