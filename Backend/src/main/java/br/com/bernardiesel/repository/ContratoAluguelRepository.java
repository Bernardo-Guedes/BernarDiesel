package br.com.bernardiesel.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.bernardiesel.model.ContratoAluguel;

public interface ContratoAluguelRepository
        extends JpaRepository<ContratoAluguel, UUID> {

    boolean existsByPedidoId(UUID pedidoId);

    Optional<ContratoAluguel> findByPedidoId(UUID pedidoId);

    List<ContratoAluguel> findAllByAgenteIdOrderByDataContratacaoDesc(
            UUID agenteId
    );

    List<ContratoAluguel> findAllByPedidoClienteIdOrderByDataContratacaoDesc(
            UUID clienteId
    );
}