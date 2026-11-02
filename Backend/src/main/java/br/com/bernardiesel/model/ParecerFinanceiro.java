package br.com.bernardiesel.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import br.com.bernardiesel.model.enums.ResultadoParecer;

@Entity
@Table(name = "pareceres_financeiros")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class ParecerFinanceiro {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResultadoParecer resultado;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String justificativa;

    @Column(nullable = false)
    private LocalDateTime dataAvaliacao;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "pedido_id",
            nullable = false,
            unique = true
    )
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "agente_id", nullable = false)
    private Agente agente;

}