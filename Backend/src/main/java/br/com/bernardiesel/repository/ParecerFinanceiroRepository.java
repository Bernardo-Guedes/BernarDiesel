package br.com.bernardiesel.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.bernardiesel.model.ParecerFinanceiro;

public interface ParecerFinanceiroRepository
        extends JpaRepository<ParecerFinanceiro, UUID> {

    boolean existsByPedidoId(UUID pedidoId);

    Optional<ParecerFinanceiro> findByPedidoId(UUID pedidoId);

}