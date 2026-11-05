package br.com.bernardiesel.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import br.com.bernardiesel.dto.pedido.PedidoDetalheResponse;
import br.com.bernardiesel.dto.rendimento.RendimentoResponse;
import br.com.bernardiesel.service.PedidoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/agentes/me/pedidos")
@RequiredArgsConstructor
public class PedidoAgenteController {

    private final PedidoService pedidoService;

    @GetMapping("/{pedidoId}")
    public ResponseEntity<PedidoDetalheResponse> buscarDetalhe(
            Authentication authentication,
            @PathVariable UUID pedidoId) {
        return ResponseEntity.ok(
                pedidoService.buscarDetalhePorAgente(
                        authentication.getName(),
                        pedidoId
                )
        );
    }

    @GetMapping("/{pedidoId}/rendimentos")
    public ResponseEntity<List<RendimentoResponse>> listarRendimentos(
            Authentication authentication,
            @PathVariable UUID pedidoId) {
        return ResponseEntity.ok(
                pedidoService.listarRendimentosDoClientePorAgente(
                        authentication.getName(),
                        pedidoId
                )
        );
    }
}