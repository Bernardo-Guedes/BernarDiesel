package br.com.bernardiesel.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.bernardiesel.dto.contrato.ContratoCreditoResponse;
import br.com.bernardiesel.dto.contrato.CriarContratoCreditoRequest;
import br.com.bernardiesel.model.Banco;
import br.com.bernardiesel.model.Cliente;
import br.com.bernardiesel.model.ContratoAluguel;
import br.com.bernardiesel.model.ContratoCredito;
import br.com.bernardiesel.model.Pedido;
import br.com.bernardiesel.repository.BancoRepository;
import br.com.bernardiesel.repository.ClienteRepository;
import br.com.bernardiesel.repository.ContratoAluguelRepository;
import br.com.bernardiesel.repository.ContratoCreditoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContratoCreditoService {

    private final ContratoCreditoRepository contratoCreditoRepository;
    private final ContratoAluguelRepository contratoAluguelRepository;
    private final BancoRepository bancoRepository;
    private final ClienteRepository clienteRepository;

    @Transactional(readOnly = true)
    public List<ContratoCreditoResponse> listarContratosDisponiveis(
            String email
    ) {

        buscarBancoAutenticado(email);

        return contratoAluguelRepository
                .buscarContratosSemCredito()
                .stream()
                .map(this::mapearContratoAluguelDisponivel)
                .toList();
    }

    @Transactional
    public ContratoCreditoResponse criarContratoCredito(
            UUID contratoAluguelId,
            CriarContratoCreditoRequest request,
            String email
    ) {

        Banco banco = buscarBancoAutenticado(email);

        ContratoAluguel contratoAluguel =
                contratoAluguelRepository
                        .buscarPorIdComBloqueio(contratoAluguelId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Contrato de aluguel não encontrado."
                                )
                        );

        if (contratoCreditoRepository
                .existsByContratoAluguelId(contratoAluguelId)) {

            throw new IllegalArgumentException(
                    "Este contrato de aluguel já possui um contrato de crédito."
            );
        }

        ContratoCredito contratoCredito = new ContratoCredito();

        contratoCredito.setContratoAluguel(contratoAluguel);
        contratoCredito.setBanco(banco);
        contratoCredito.setValorFinanciado(request.valorFinanciado());
        contratoCredito.setTaxaJuros(request.taxaJuros());
        contratoCredito.setPrazoMeses(request.prazoMeses());

        ContratoCredito salvo =
                contratoCreditoRepository.save(contratoCredito);

        return mapearContratoCredito(salvo);
    }

    @Transactional(readOnly = true)
    public List<ContratoCreditoResponse> listarMeusContratos(
            String email
    ) {

        Banco banco = buscarBancoAutenticado(email);

        return contratoCreditoRepository
                .buscarPorBanco(banco.getId())
                .stream()
                .map(this::mapearContratoCredito)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ContratoCreditoResponse> listarContratosDoCliente(
            String email
    ) {

        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Cliente não encontrado."
                        )
                );

        return contratoCreditoRepository
                .buscarPorCliente(cliente.getId())
                .stream()
                .map(this::mapearContratoCredito)
                .toList();
    }

    private Banco buscarBancoAutenticado(String email) {

        return bancoRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Banco não encontrado."
                        )
                );
    }

    private ContratoCreditoResponse mapearContratoCredito(
            ContratoCredito contratoCredito
    ) {

        ContratoAluguel contratoAluguel =
                contratoCredito.getContratoAluguel();

        Pedido pedido = contratoAluguel.getPedido();
        Banco banco = contratoCredito.getBanco();

        return new ContratoCreditoResponse(
                contratoCredito.getId(),
                contratoAluguel.getId(),
                contratoAluguel.getDataContratacao(),
                pedido.getId(),
                pedido.getDataInicio(),
                pedido.getDataFim(),
                pedido.getValorTotal(),
                pedido.getCliente().getId(),
                pedido.getCliente().getNome(),
                pedido.getAutomovel().getId(),
                pedido.getAutomovel().getMarca(),
                pedido.getAutomovel().getModelo(),
                pedido.getAutomovel().getPlaca(),
                contratoCredito.getValorFinanciado(),
                contratoCredito.getTaxaJuros(),
                contratoCredito.getPrazoMeses(),
                banco.getId(),
                banco.getNome()
        );
    }

    private ContratoCreditoResponse mapearContratoAluguelDisponivel(
            ContratoAluguel contratoAluguel
    ) {

        Pedido pedido = contratoAluguel.getPedido();

        return new ContratoCreditoResponse(
                null,
                contratoAluguel.getId(),
                contratoAluguel.getDataContratacao(),
                pedido.getId(),
                pedido.getDataInicio(),
                pedido.getDataFim(),
                pedido.getValorTotal(),
                pedido.getCliente().getId(),
                pedido.getCliente().getNome(),
                pedido.getAutomovel().getId(),
                pedido.getAutomovel().getMarca(),
                pedido.getAutomovel().getModelo(),
                pedido.getAutomovel().getPlaca(),
                null,
                null,
                null,
                null,
                null
        );
    }
}