package br.com.bernardiesel.service;

import br.com.bernardiesel.dto.cliente.AtualizarClienteRequest;
import br.com.bernardiesel.dto.cliente.ClienteResponse;
import br.com.bernardiesel.model.Cliente;
import br.com.bernardiesel.repository.ClienteRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarMeuPerfil(String email) {

        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Cliente não encontrado."
                ));

        return ClienteResponse.fromEntity(cliente);
    }

    @Transactional
    public ClienteResponse atualizarMeuPerfil(
            String emailAutenticado,
            AtualizarClienteRequest dados
    ) {
        Cliente cliente = clienteRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Cliente não encontrado."
                ));

        String novoEmail = dados.email();
        String novoRg = dados.rg();

        if (!cliente.getEmail().equals(novoEmail)
                && clienteRepository.existsByEmail(novoEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este e-mail já está cadastrado."
            );
        }

        if (!cliente.getRg().equals(novoRg)
                && clienteRepository.existsByRg(novoRg)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este RG já está cadastrado."
            );
        }

        cliente.setNome(dados.nome());
        cliente.setRg(novoRg);
        cliente.setEndereco(dados.endereco());
        cliente.setProfissao(dados.profissao());
        cliente.setEmail(novoEmail);
        cliente.setLogin(novoEmail);

        Cliente clienteAtualizado = clienteRepository.save(cliente);

        return ClienteResponse.fromEntity(clienteAtualizado);
    }
}