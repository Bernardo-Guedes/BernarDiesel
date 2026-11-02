package br.com.bernardiesel.config;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.com.bernardiesel.model.Automovel;
import br.com.bernardiesel.model.Banco;
import br.com.bernardiesel.model.Cliente;
import br.com.bernardiesel.model.Empresa;
import br.com.bernardiesel.model.Usuario;
import br.com.bernardiesel.model.enums.Perfil;
import br.com.bernardiesel.model.enums.TipoPropriedade;
import br.com.bernardiesel.repository.AutomovelRepository;
import br.com.bernardiesel.repository.BancoRepository;
import br.com.bernardiesel.repository.ClienteRepository;
import br.com.bernardiesel.repository.EmpresaRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            ClienteRepository clienteRepository,
            EmpresaRepository empresaRepository,
            BancoRepository bancoRepository,
            AutomovelRepository automovelRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // Proprietário: Cliente
            Cliente cliente = clienteRepository
                    .findByEmail("cliente.seeder@bernardiesel.com")
                    .orElseGet(() -> {

                        Cliente novo = new Cliente();

                        novo.setNome("Carlos Almeida");
                        novo.setCpf("12345678901");
                        novo.setRg("MG1234567");
                        novo.setEndereco("Rua das Flores, 100");
                        novo.setProfissao("Engenheiro");

                        novo.setLogin("cliente.seeder");
                        novo.setEmail("cliente.seeder@bernardiesel.com");
                        novo.setSenha(passwordEncoder.encode("Senha@123"));
                        novo.setPerfil(Perfil.CLIENTE);

                        return clienteRepository.save(novo);
                    });

            // Proprietário: Empresa
            Empresa empresa = empresaRepository
                    .findByEmail("empresa.seeder@bernardiesel.com")
                    .orElseGet(() -> {

                        Empresa nova = new Empresa();

                        nova.setNome("BernarDiesel Frota");
                        nova.setCnpj("12345678000195");

                        nova.setLogin("empresa.seeder");
                        nova.setEmail("empresa.seeder@bernardiesel.com");
                        nova.setSenha(passwordEncoder.encode("Senha@123"));
                        nova.setPerfil(Perfil.EMPRESA);

                        return empresaRepository.save(nova);
                    });

            // Proprietário: Banco
            Banco banco = bancoRepository
                    .findByEmail("banco.seeder@bernardiesel.com")
                    .orElseGet(() -> {

                        Banco novo = new Banco();

                        novo.setNome("Banco Exemplo");
                        novo.setCnpj("98765432000198");

                        novo.setLogin("banco.seeder");
                        novo.setEmail("banco.seeder@bernardiesel.com");
                        novo.setSenha(passwordEncoder.encode("Senha@123"));
                        novo.setPerfil(Perfil.BANCO);

                        return bancoRepository.save(novo);
                    });

            // Automóveis do cliente
            criarAutomovel(
                    automovelRepository,
                    "MAT001", 2022, "Toyota", "Corolla",
                    "ABC1D23", "150.00",
                    TipoPropriedade.CLIENTE, cliente
            );

            criarAutomovel(
                    automovelRepository,
                    "MAT002", 2023, "Honda", "Civic",
                    "ABC2D34", "180.00",
                    TipoPropriedade.CLIENTE, cliente
            );

            // Automóveis da empresa
            criarAutomovel(
                    automovelRepository,
                    "MAT003", 2024, "Chevrolet", "Onix",
                    "ABC3D45", "110.00",
                    TipoPropriedade.EMPRESA, empresa
            );

            criarAutomovel(
                    automovelRepository,
                    "MAT004", 2023, "Hyundai", "HB20",
                    "ABC4D56", "100.00",
                    TipoPropriedade.EMPRESA, empresa
            );

            // Automóveis do banco
            criarAutomovel(
                    automovelRepository,
                    "MAT005", 2024, "Jeep", "Compass",
                    "ABC5D67", "250.00",
                    TipoPropriedade.BANCO, banco
            );

            criarAutomovel(
                    automovelRepository,
                    "MAT006", 2022, "Volkswagen", "T-Cross",
                    "ABC6D78", "190.00",
                    TipoPropriedade.BANCO, banco
            );
        };
    }

    private void criarAutomovel(
            AutomovelRepository repository,
            String matricula,
            Integer ano,
            String marca,
            String modelo,
            String placa,
            String valorDiaria,
            TipoPropriedade tipoPropriedade,
            Usuario proprietario) {

        if (repository.existsByMatricula(matricula)) {
            return;
        }

        if (repository.existsByPlaca(placa)) {
            throw new IllegalStateException(
                    "Já existe um automóvel cadastrado com a placa " + placa
            );
        }

        Automovel automovel = new Automovel();

        automovel.setMatricula(matricula);
        automovel.setAno(ano);
        automovel.setMarca(marca);
        automovel.setModelo(modelo);
        automovel.setPlaca(placa);
        automovel.setValorDiaria(new BigDecimal(valorDiaria));
        automovel.setTipoPropriedade(tipoPropriedade);
        automovel.setProprietario(proprietario);

        repository.save(automovel);
    }
}