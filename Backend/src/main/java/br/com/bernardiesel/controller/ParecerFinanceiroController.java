package br.com.bernardiesel.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import br.com.bernardiesel.dto.pedido.PedidoResponse;
import br.com.bernardiesel.dto.parecer.ParecerFinanceiroRequest;
import br.com.bernardiesel.dto.parecer.ParecerFinanceiroResponse;

import br.com.bernardiesel.service.ParecerFinanceiroService;

@RestController
@RequestMapping("/api/agentes/me/pedidos")
public class ParecerFinanceiroController {

    private final ParecerFinanceiroService parecerService;

    public ParecerFinanceiroController(
            ParecerFinanceiroService parecerService
    ) {
        this.parecerService = parecerService;
    }

    // Listar pedidos aguardando avaliação.
    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listarPedidosPendentes(
            Authentication authentication
    ) {

        List<PedidoResponse> pedidos =
                parecerService.listarPedidosPendentes(authentication.getName());

        return ResponseEntity.ok(pedidos);
    }

    // Emitir parecer financeiro.
    @PostMapping("/{pedidoId}/parecer")
    public ResponseEntity<ParecerFinanceiroResponse> avaliarPedido(
            Authentication authentication,
            @PathVariable UUID pedidoId,
            @Valid @RequestBody ParecerFinanceiroRequest dados
    ) {

        ParecerFinanceiroResponse resposta =
                parecerService.avaliarPedido(
                        authentication.getName(),
                        pedidoId,
                        dados
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

}