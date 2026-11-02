package br.com.bernardiesel.controller;

import br.com.bernardiesel.dto.admin.AgenteResponse;
import br.com.bernardiesel.dto.admin.CriarAgenteRequest;
import br.com.bernardiesel.service.AdminAgenteService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/agentes")
public class AdminAgenteController {

    private final AdminAgenteService adminAgenteService;

    public AdminAgenteController(
            AdminAgenteService adminAgenteService
    ) {
        this.adminAgenteService = adminAgenteService;
    }

    @PostMapping
    public ResponseEntity<AgenteResponse> cadastrar(
            @Valid @RequestBody CriarAgenteRequest dados
    ) {

        AgenteResponse resposta = adminAgenteService.cadastrar(dados);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }
}