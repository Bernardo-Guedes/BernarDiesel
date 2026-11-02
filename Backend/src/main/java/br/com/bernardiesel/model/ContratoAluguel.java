package br.com.bernardiesel.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "contratos_aluguel")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ContratoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private LocalDateTime dataContratacao;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "agente_id", nullable = false)
    private Agente agente;

    @OneToOne(
        mappedBy = "contratoAluguel",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private ContratoCredito contratoCredito;
}
