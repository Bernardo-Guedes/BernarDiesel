package br.com.bernardiesel.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.bernardiesel.model.ContratoCredito;

public interface ContratoCreditoRepository
        extends JpaRepository<ContratoCredito, UUID> {

    boolean existsByContratoAluguelId(UUID contratoAluguelId);

    Optional<ContratoCredito> findByContratoAluguelId(
            UUID contratoAluguelId
    );

    List<ContratoCredito> findAllByBancoId(UUID bancoId);

    @Query("""
            SELECT cc
            FROM ContratoCredito cc
            WHERE cc.banco.id = :bancoId
            ORDER BY cc.contratoAluguel.dataContratacao DESC
            """)
    List<ContratoCredito> buscarPorBanco(
            @Param("bancoId") UUID bancoId
    );

    @Query("""
            SELECT cc
            FROM ContratoCredito cc
            WHERE cc.contratoAluguel.pedido.cliente.id = :clienteId
            ORDER BY cc.contratoAluguel.dataContratacao DESC
            """)
    List<ContratoCredito> buscarPorCliente(
            @Param("clienteId") UUID clienteId
    );
}