package br.com.bernardiesel.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

import br.com.bernardiesel.model.enums.TipoPropriedade;
import jakarta.persistence.*;

@Entity
@Table(name = "automoveis")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class Automovel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false)
    private Integer ano;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private String modelo;

    @Column(nullable = false, unique = true, length = 10)
    private String placa;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valorDiaria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPropriedade tipoPropriedade;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "proprietario_id", nullable = false)
    private Usuario proprietario;
}