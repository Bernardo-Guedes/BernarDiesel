package br.com.bernardiesel.repository;

import br.com.bernardiesel.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    boolean existsByCpf(String cpf);

}