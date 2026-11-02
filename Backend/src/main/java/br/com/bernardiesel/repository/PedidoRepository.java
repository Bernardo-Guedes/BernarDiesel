package br.com.bernardiesel.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.bernardiesel.model.Pedido;
import br.com.bernardiesel.model.enums.StatusPedido;

public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    // Busca um pedido específico que pertence a determinado cliente.
    Optional<Pedido> findByIdAndClienteId(UUID id, UUID clienteId);

    // Lista todos os pedidos de determinado cliente.
    List<Pedido> findAllByClienteId(UUID clienteId);

    // Verifica se existe outro pedido que ocupa o mesmo automóvel
    // durante o período solicitado.
    boolean existsByAutomovelIdAndStatusInAndDataInicioLessThanAndDataFimGreaterThan(
            UUID automovelId,
            List<StatusPedido> status,
            LocalDate dataFim,
            LocalDate dataInicio
    );

    // Verifica conflitos ao atualizar um pedido,
    // ignorando o próprio pedido que está sendo alterado.
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
}