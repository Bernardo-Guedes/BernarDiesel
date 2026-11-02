package br.com.bernardiesel.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.bernardiesel.model.Automovel;

public interface AutomovelRepository extends JpaRepository<Automovel, UUID> {

    boolean existsByMatricula(String matricula);

    boolean existsByPlaca(String placa);
}