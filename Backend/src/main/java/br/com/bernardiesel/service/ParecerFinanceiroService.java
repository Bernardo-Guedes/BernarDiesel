package br.com.bernardiesel.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.bernardiesel.dto.pedido.PedidoResponse;
import br.com.bernardiesel.dto.parecer.ParecerFinanceiroRequest;
import br.com.bernardiesel.dto.parecer.ParecerFinanceiroResponse;

import br.com.bernardiesel.model.Agente;
import br.com.bernardiesel.model.Pedido;
import br.com.bernardiesel.model.ParecerFinanceiro;

import br.com.bernardiesel.model.enums.ResultadoParecer;
import br.com.bernardiesel.model.enums.StatusPedido;

import br.com.bernardiesel.repository.AgenteRepository;
import br.com.bernardiesel.repository.ParecerFinanceiroRepository;
import br.com.bernardiesel.repository.PedidoRepository;

@Service
public class ParecerFinanceiroService {

    private final AgenteRepository agenteRepository;
    private final PedidoRepository pedidoRepository;
    private final ParecerFinanceiroRepository parecerRepository;

    public ParecerFinanceiroService(
            AgenteRepository agenteRepository,
            PedidoRepository pedidoRepository,
            ParecerFinanceiroRepository parecerRepository
    ) {
        this.agenteRepository = agenteRepository;
        this.pedidoRepository = pedidoRepository;
        this.parecerRepository = parecerRepository;
    }

    // Listar pedidos aguardando avaliação financeira.
    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPedidosPendentes(String email) {

        buscarAgenteAutenticado(email);

        return pedidoRepository
                .findAllByStatusOrderByDataInicioAsc(StatusPedido.EM_ANALISE)
                .stream()
                .map(this::converterPedidoParaResponse)
                .toList();
    }

    // Registrar parecer financeiro.
    @Transactional
    public ParecerFinanceiroResponse avaliarPedido(
            String email,
            UUID pedidoId,
            ParecerFinanceiroRequest dados
    ) {

        Agente agente = buscarAgenteAutenticado(email);

        // Busca o pedido com bloqueio para evitar avaliações simultâneas.
        Pedido pedido = pedidoRepository.buscarPorIdComBloqueio(pedidoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Pedido não encontrado."
                ));

        // Somente pedidos em análise podem receber parecer.
        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este pedido não está mais disponível para avaliação."
            );
        }

        // Verificação adicional para garantir um único parecer.
        if (parecerRepository.existsByPedidoId(pedidoId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este pedido já possui um parecer financeiro."
            );
        }

        // Cria o parecer utilizando o construtor público do Lombok.
        ParecerFinanceiro parecer = new ParecerFinanceiro();

        parecer.setResultado(dados.resultado());
        parecer.setJustificativa(dados.justificativa().trim());
        parecer.setDataAvaliacao(LocalDateTime.now());
        parecer.setPedido(pedido);
        parecer.setAgente(agente);

        // Atualiza o relacionamento bidirecional.
        pedido.setParecerFinanceiro(parecer);

        // O resultado determina o novo status do pedido.
        if (dados.resultado() == ResultadoParecer.POSITIVO) {
            pedido.setStatus(StatusPedido.APROVADO);
        } else {
            pedido.setStatus(StatusPedido.REPROVADO);
        }

        // Salva o parecer e o pedido na mesma transação.
        ParecerFinanceiro parecerSalvo = parecerRepository.save(parecer);

        pedidoRepository.save(pedido);

        return converterParaResponse(parecerSalvo);
    }

    // Buscar agente autenticado pelo e-mail do JWT.
    private Agente buscarAgenteAutenticado(String email) {

        return agenteRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Apenas empresas e bancos podem acessar esta funcionalidade."
                ));
    }

    // Converter parecer para DTO.
    private ParecerFinanceiroResponse converterParaResponse(
            ParecerFinanceiro parecer
    ) {

        return new ParecerFinanceiroResponse(
                parecer.getId(),
                parecer.getPedido().getId(),
                parecer.getResultado(),
                parecer.getJustificativa(),
                parecer.getDataAvaliacao(),
                parecer.getAgente().getId()
        );
    }

    // Converter pedido para DTO.
    private PedidoResponse converterPedidoParaResponse(Pedido pedido) {

        return new PedidoResponse(
                pedido.getId(),
                pedido.getDataInicio(),
                pedido.getDataFim(),
                pedido.getValorTotal(),
                pedido.getStatus(),
                pedido.getAutomovel().getId(),
                pedido.getAutomovel().getMarca(),
                pedido.getAutomovel().getModelo(),
                pedido.getAutomovel().getPlaca()
        );
    }

}