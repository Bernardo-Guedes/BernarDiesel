package br.com.bernardiesel.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.bernardiesel.model.Agente;

public interface AgenteRepository extends JpaRepository<Agente, UUID> {

    Optional<Agente> findByEmail(String email);

}