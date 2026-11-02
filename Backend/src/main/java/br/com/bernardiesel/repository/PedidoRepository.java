package br.com.bernardiesel.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import br.com.bernardiesel.model.Pedido;
import br.com.bernardiesel.model.enums.StatusPedido;

public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    Optional<Pedido> findByIdAndClienteId(UUID id, UUID clienteId);

    List<Pedido> findAllByClienteId(UUID clienteId);

    // Pedidos aguardando avaliação financeira.
    List<Pedido> findAllByStatusOrderByDataInicioAsc(StatusPedido status);

    // Verifica conflitos de disponibilidade.
    boolean existsByAutomovelIdAndStatusInAndDataInicioLessThanAndDataFimGreaterThan(
            UUID automovelId,
            List<StatusPedido> status,
            LocalDate dataFim,
            LocalDate dataInicio
    );

    // Verifica conflitos ao atualizar um pedido.
    @Query("""
        SELECT COUNT(p) > 0
        FROM Pedido p
        WHERE p.automovel.id = :automovelId
        AND p.id <> :pedidoId
        AND p.status IN :status
        AND p.dataInicio < :dataFim
        AND p.dataFim > :dataInicio
    """)
    boolean existeConflitoAoAtualizar(
            @Param("automovelId") UUID automovelId,
            @Param("pedidoId") UUID pedidoId,
            @Param("status") List<StatusPedido> status,
            @Param("dataFim") LocalDate dataFim,
            @Param("dataInicio") LocalDate dataInicio
    );

    // Busca um pedido aplicando bloqueio pessimista.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Pedido p WHERE p.id = :id")
    Optional<Pedido> buscarPorIdComBloqueio(@Param("id") UUID id);

}