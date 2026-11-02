package br.com.bernardiesel.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import br.com.bernardiesel.dto.contrato.ContratoAluguelResponse;
import br.com.bernardiesel.service.ContratoAluguelService;
import br.com.bernardiesel.dto.pedido.PedidoAprovadoResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/agentes/me")
@RequiredArgsConstructor
public class ContratoAluguelController {

    private final ContratoAluguelService contratoAluguelService;

    @GetMapping("/pedidos/aprovados")
    public ResponseEntity<List<PedidoAprovadoResponse>> listarPedidosAprovados(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                contratoAluguelService.listarPedidosAprovados(
                        authentication.getName()
                )
        );
    }

    @PostMapping("/pedidos/{pedidoId}/contrato")
    public ResponseEntity<ContratoAluguelResponse> contratarPedido(
            @PathVariable UUID pedidoId,
            Authentication authentication
    ) {

        ContratoAluguelResponse resposta =
                contratoAluguelService.contratarPedido(
                        pedidoId,
                        authentication.getName()
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping("/contratos/aluguel")
    public ResponseEntity<List<ContratoAluguelResponse>> listarMeusContratos(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                contratoAluguelService.listarMeusContratos(
                        authentication.getName()
                )
        );
    }
}