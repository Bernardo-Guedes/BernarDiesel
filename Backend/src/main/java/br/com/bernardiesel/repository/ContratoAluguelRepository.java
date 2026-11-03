package br.com.bernardiesel.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT ca
            FROM ContratoAluguel ca
            WHERE ca.id = :id
            """)
    Optional<ContratoAluguel> buscarPorIdComBloqueio(
            @Param("id") UUID id
    );

    @Query("""
            SELECT ca
            FROM ContratoAluguel ca
            WHERE NOT EXISTS (
                SELECT cc.id
                FROM ContratoCredito cc
                WHERE cc.contratoAluguel.id = ca.id
            )
            ORDER BY ca.dataContratacao DESC
            """)
    List<ContratoAluguel> buscarContratosSemCredito();
}