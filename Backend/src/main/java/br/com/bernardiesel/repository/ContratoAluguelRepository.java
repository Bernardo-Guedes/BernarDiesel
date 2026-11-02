
package br.com.bernardiesel.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.bernardiesel.model.ContratoAluguel;

public interface ContratoAluguelRepository
        extends JpaRepository<ContratoAluguel, UUID> {

    boolean existsByPedidoId(UUID pedidoId);
}
