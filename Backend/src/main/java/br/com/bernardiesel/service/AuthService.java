package br.com.bernardiesel.service;

import br.com.bernardiesel.dto.auth.AuthResponse;
import br.com.bernardiesel.dto.auth.CadastroRequest;
import br.com.bernardiesel.dto.auth.LoginRequest;

import br.com.bernardiesel.model.Cliente;
import br.com.bernardiesel.model.Usuario;
import br.com.bernardiesel.model.enums.Perfil;

import br.com.bernardiesel.repository.ClienteRepository;
import br.com.bernardiesel.repository.UsuarioRepository;

import br.com.bernardiesel.security.JwtService;
import br.com.bernardiesel.util.CpfUtils;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            ClienteRepository clienteRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse cadastrarCliente(CadastroRequest dados) {

        String email = dados.email();
        String cpf = dados.cpf();

        if (!CpfUtils.validar(cpf)) {
            throw new IllegalArgumentException("CPF inválido.");
        }

        if (usuarioRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este e-mail já está cadastrado."
            );
        }

        if (clienteRepository.existsByCpf(cpf)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este CPF já está cadastrado."
            );
        }

        Cliente cliente = new Cliente();

        cliente.setNome(dados.nome());
        cliente.setCpf(cpf);
        cliente.setRg(dados.rg());
        cliente.setEndereco(dados.endereco());
        cliente.setProfissao(dados.profissao());

        cliente.setEmail(email);

        // Caso sua entidade Usuario tenha o campo login obrigatório.
        cliente.setLogin(email);

        // Nunca armazenar a senha original.
        cliente.setSenha(passwordEncoder.encode(dados.senha()));

        // O cadastro público sempre cria um CLIENTE.
        cliente.setPerfil(Perfil.CLIENTE);

        Cliente clienteSalvo = clienteRepository.save(cliente);

        String token = jwtService.generateToken(clienteSalvo);

        return criarResposta(clienteSalvo, token);
    }

    public AuthResponse login(LoginRequest dados) {

        String email = dados.email();

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(
                        email,
                        dados.senha()
                );

        // O Spring Security verifica o e-mail e a senha.
        authenticationManager.authenticate(authenticationToken);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuário não encontrado."
                ));

        String token = jwtService.generateToken(usuario);

        return criarResposta(usuario, token);
    }

    private AuthResponse criarResposta(Usuario usuario, String token) {

        String nome;

        if (usuario instanceof Cliente cliente) {
            nome = cliente.getNome();
        } else {
            nome = usuario.getLogin();
        }

        return new AuthResponse(
                token,
                "Bearer",
                3600L,
                usuario.getId(),
                nome,
                usuario.getEmail(),
                usuario.getPerfil()
        );
    }
}