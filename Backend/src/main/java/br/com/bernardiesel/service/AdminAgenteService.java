package br.com.bernardiesel.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.bernardiesel.dto.admin.AgenteResponse;
import br.com.bernardiesel.dto.admin.CriarAgenteRequest;

import br.com.bernardiesel.model.Banco;
import br.com.bernardiesel.model.Empresa;

import br.com.bernardiesel.model.enums.Perfil;
import br.com.bernardiesel.model.enums.TipoAgente;

import br.com.bernardiesel.repository.BancoRepository;
import br.com.bernardiesel.repository.EmpresaRepository;
import br.com.bernardiesel.repository.UsuarioRepository;

@Service
public class AdminAgenteService {

    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final BancoRepository bancoRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminAgenteService(
            UsuarioRepository usuarioRepository,
            EmpresaRepository empresaRepository,
            BancoRepository bancoRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
        this.bancoRepository = bancoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AgenteResponse cadastrar(CriarAgenteRequest dados) {

        if (dados.cnpj().length() != 14) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O CNPJ deve possuir 14 dígitos."
            );
        }

        if (usuarioRepository.existsByEmail(dados.email())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este e-mail já está cadastrado."
            );
        }

        if (empresaRepository.existsByCnpj(dados.cnpj())
                || bancoRepository.existsByCnpj(dados.cnpj())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este CNPJ já está cadastrado."
            );
        }

        String senhaHash = passwordEncoder.encode(dados.senha());

        if (dados.tipo() == TipoAgente.EMPRESA) {

            Empresa empresa = new Empresa();

            empresa.setNome(dados.nome());
            empresa.setCnpj(dados.cnpj());
            empresa.setEmail(dados.email());
            empresa.setLogin(dados.email());
            empresa.setSenha(senhaHash);
            empresa.setPerfil(Perfil.EMPRESA);
            empresa.setAtivo(true);

            Empresa salva = empresaRepository.save(empresa);

            return new AgenteResponse(
                    salva.getId(),
                    salva.getNome(),
                    salva.getEmail(),
                    salva.getCnpj(),
                    salva.getPerfil()
            );
        }

        Banco banco = new Banco();

        banco.setNome(dados.nome());
        banco.setCnpj(dados.cnpj());
        banco.setEmail(dados.email());
        banco.setLogin(dados.email());
        banco.setSenha(senhaHash);
        banco.setPerfil(Perfil.BANCO);
        banco.setAtivo(true);

        Banco salvo = bancoRepository.save(banco);

        return new AgenteResponse(
                salvo.getId(),
                salvo.getNome(),
                salvo.getEmail(),
                salvo.getCnpj(),
                salvo.getPerfil()
        );
    }
}