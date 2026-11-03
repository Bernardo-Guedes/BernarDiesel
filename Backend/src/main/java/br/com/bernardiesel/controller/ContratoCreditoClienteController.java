package br.com.bernardiesel.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import br.com.bernardiesel.dto.contrato.ContratoCreditoResponse;
import br.com.bernardiesel.service.ContratoCreditoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clientes/me/contratos")
@RequiredArgsConstructor
public class ContratoCreditoClienteController {

    private final ContratoCreditoService contratoCreditoService;

    @GetMapping("/credito")
    public ResponseEntity<List<ContratoCreditoResponse>>
            listarMeusContratosDeCredito(
                    Authentication authentication
            ) {

        return ResponseEntity.ok(
                contratoCreditoService.listarContratosDoCliente(
                        authentication.getName()
                )
        );
    }
}