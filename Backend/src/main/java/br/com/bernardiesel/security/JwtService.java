package br.com.bernardiesel.security;

import br.com.bernardiesel.model.Usuario;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;

    @Value("${security.jwt.expiration}")
    private long expiration;

    public JwtService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String generateToken(Usuario usuario) {

        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("bernardiesel")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiration))
                .subject(usuario.getEmail())
                .claim("perfil", usuario.getPerfil().name())
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256)
                .build();

        return jwtEncoder.encode(
                JwtEncoderParameters.from(header, claims)
        ).getTokenValue();
    }
}