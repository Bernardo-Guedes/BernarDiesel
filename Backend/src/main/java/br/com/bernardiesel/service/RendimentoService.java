
package br.com.bernardiesel.service;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.bernardiesel.dto.rendimento.RendimentoRequest;
import br.com.bernardiesel.dto.rendimento.RendimentoResponse;
import br.com.bernardiesel.model.Cliente;
import br.com.bernardiesel.model.Rendimento;
import br.com.bernardiesel.repository.ClienteRepository;
import br.com.bernardiesel.repository.RendimentoRepository;

@Service
public class RendimentoService {

    private final RendimentoRepository rendimentoRepository;
    private final ClienteRepository clienteRepository;

    public RendimentoService(
            RendimentoRepository rendimentoRepository,
            ClienteRepository clienteRepository) {
        this.rendimentoRepository = rendimentoRepository;
        this.clienteRepository = clienteRepository;
    }

    private Cliente buscarCliente(String email) {
        return clienteRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Cliente não encontrado."
            ));
    }

    private Rendimento buscarRendimento(
            UUID id,
            UUID clienteId) {
        return rendimentoRepository.findByIdAndClienteId(id, clienteId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Rendimento não encontrado."
            ));
    }

    private RendimentoResponse converterParaResponse(
            Rendimento rendimento) {
        return new RendimentoResponse(
            rendimento.getId(),
            rendimento.getEntidadeEmpregadora(),
            rendimento.getValor()
        );
    }

    @Transactional
    public RendimentoResponse cadastrar(
            String email,
            RendimentoRequest dados) {

        Cliente cliente = buscarCliente(email);

        if (rendimentoRepository.countByClienteId(cliente.getId()) >= 3) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "O cliente já possui o limite de três rendimentos."
            );
        }

        Rendimento rendimento = new Rendimento();

        rendimento.setEntidadeEmpregadora(
            dados.entidadeEmpregadora()
        );
        rendimento.setValor(dados.valor());
        rendimento.setCliente(cliente);

        return converterParaResponse(
            rendimentoRepository.save(rendimento)
        );
    }

    @Transactional(readOnly = true)
    public List<RendimentoResponse> listar(String email) {

        Cliente cliente = buscarCliente(email);

        return cliente.getRendimentos()
            .stream()
            .map(this::converterParaResponse)
            .toList();
    }

    @Transactional
    public RendimentoResponse atualizar(
            String email,
            UUID id,
            RendimentoRequest dados) {

        Cliente cliente = buscarCliente(email);

        Rendimento rendimento = buscarRendimento(
            id,
            cliente.getId()
        );

        rendimento.setEntidadeEmpregadora(
            dados.entidadeEmpregadora()
        );
        rendimento.setValor(dados.valor());

        return converterParaResponse(
            rendimentoRepository.save(rendimento)
        );
    }

    @Transactional
    public void excluir(String email, UUID id) {

        Cliente cliente = buscarCliente(email);

        Rendimento rendimento = buscarRendimento(
            id,
            cliente.getId()
        );

        rendimentoRepository.delete(rendimento);
    }
}
