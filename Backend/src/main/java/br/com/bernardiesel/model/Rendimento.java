package br.com.bernardiesel.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "rendimentos")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class Rendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String entidadeEmpregadora;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
}
