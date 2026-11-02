package br.com.bernardiesel.security;

import java.io.IOException;

import br.com.bernardiesel.model.Usuario;
import br.com.bernardiesel.repository.UsuarioRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtAccountStatusFilter extends OncePerRequestFilter {

    private final UsuarioRepository usuarioRepository;

    public JwtAccountStatusFilter(
            UsuarioRepository usuarioRepository
    ) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuth) {

            String email = jwtAuth.getToken().getSubject();

            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElse(null);

            if (usuario == null || !Boolean.TRUE.equals(usuario.getAtivo())) {

                SecurityContextHolder.clearContext();

                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Esta conta está desativada ou não existe."
                );

                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}