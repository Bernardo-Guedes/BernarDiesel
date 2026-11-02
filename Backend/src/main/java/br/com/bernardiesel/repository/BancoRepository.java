package br.com.bernardiesel.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.bernardiesel.model.Banco;

public interface BancoRepository extends JpaRepository<Banco, UUID> {

    Optional<Banco> findByEmail(String email);
}