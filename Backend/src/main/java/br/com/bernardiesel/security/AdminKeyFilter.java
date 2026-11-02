package br.com.bernardiesel.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;

public class AdminKeyFilter extends OncePerRequestFilter {

    private static final String HEADER_NAME = "X-Admin-Key";

    private final byte[] adminKey;

    public AdminKeyFilter(String adminKey) {

        if (adminKey == null || adminKey.isBlank()) {
            throw new IllegalStateException(
                    "A variável ADMIN_KEY não foi configurada."
            );
        }

        this.adminKey = adminKey.getBytes(StandardCharsets.UTF_8);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String providedKey = request.getHeader(HEADER_NAME);

        if (providedKey == null || providedKey.isBlank()) {
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Chave administrativa não informada."
            );
            return;
        }

        byte[] providedBytes =
                providedKey.getBytes(StandardCharsets.UTF_8);

        if (!MessageDigest.isEqual(adminKey, providedBytes)) {
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Chave administrativa inválida."
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}