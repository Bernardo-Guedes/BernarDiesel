package br.com.bernardiesel.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "contratos_credito")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valorFinanciado;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal taxaJuros;

    @Column(nullable = false)
    private Integer prazoMeses;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "contrato_aluguel_id",
        nullable = false,
        unique = true
    )
    private ContratoAluguel contratoAluguel;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "banco_id", nullable = false)
    private Banco banco;
}
