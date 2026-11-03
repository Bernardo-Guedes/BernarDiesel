package br.com.bernardiesel.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import br.com.bernardiesel.dto.contrato.ContratoCreditoResponse;
import br.com.bernardiesel.dto.contrato.CriarContratoCreditoRequest;
import br.com.bernardiesel.service.ContratoCreditoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bancos/me/contratos")
@RequiredArgsConstructor
public class ContratoCreditoBancoController {

    private final ContratoCreditoService contratoCreditoService;

    @GetMapping("/aluguel/disponiveis")
    public ResponseEntity<List<ContratoCreditoResponse>>
            listarContratosDisponiveis(
                    Authentication authentication
            ) {

        return ResponseEntity.ok(
                contratoCreditoService.listarContratosDisponiveis(
                        authentication.getName()
                )
        );
    }

    @PostMapping("/{contratoAluguelId}/credito")
    public ResponseEntity<ContratoCreditoResponse> criarContratoCredito(
            @PathVariable UUID contratoAluguelId,
            @Valid @RequestBody CriarContratoCreditoRequest request,
            Authentication authentication
    ) {

        ContratoCreditoResponse resposta =
                contratoCreditoService.criarContratoCredito(
                        contratoAluguelId,
                        request,
                        authentication.getName()
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping("/credito")
    public ResponseEntity<List<ContratoCreditoResponse>> listarMeusContratos(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                contratoCreditoService.listarMeusContratos(
                        authentication.getName()
                )
        );
    }
}