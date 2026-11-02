package br.com.bernardiesel.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.*;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import br.com.bernardiesel.model.enums.StatusPedido;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private LocalDate dataInicio;

    @Column(nullable = false)
    private LocalDate dataFim;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valorTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "automovel_id", nullable = false)
    private Automovel automovel;

    @OneToOne(
            mappedBy = "pedido",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private ParecerFinanceiro parecerFinanceiro;

}