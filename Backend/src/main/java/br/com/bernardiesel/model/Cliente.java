package br.com.bernardiesel.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "clientes")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class Cliente extends Usuario implements Proprietario {

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(nullable = false, unique = true)
    private String rg;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String profissao;

    @OneToMany(
        mappedBy = "cliente",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Rendimento> rendimentos = new ArrayList<>();
}
