package br.com.bernardiesel.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.bernardiesel.dto.automovel.AutomovelResponse;
import br.com.bernardiesel.repository.AutomovelRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/automoveis")
@RequiredArgsConstructor
public class AutomovelController {

    private final AutomovelRepository automovelRepository;

    @GetMapping
    public ResponseEntity<List<AutomovelResponse>> listar() {
        List<AutomovelResponse> resposta = automovelRepository.findAll()
                .stream()
                .map(a -> new AutomovelResponse(
                        a.getId(),
                        a.getMatricula(),
                        a.getAno(),
                        a.getMarca(),
                        a.getModelo(),
                        a.getPlaca(),
                        a.getValorDiaria(),
                        a.getTipoPropriedade()))
                .toList();
        return ResponseEntity.ok(resposta);
    }
}