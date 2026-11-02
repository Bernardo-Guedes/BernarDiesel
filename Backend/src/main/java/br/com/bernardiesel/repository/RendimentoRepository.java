
package br.com.bernardiesel.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.bernardiesel.model.Rendimento;

public interface RendimentoRepository
        extends JpaRepository<Rendimento, UUID> {

    long countByClienteId(UUID clienteId);

    Optional<Rendimento> findByIdAndClienteId(
        UUID id,
        UUID clienteId
    );
}
