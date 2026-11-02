package br.com.bernardiesel.exception;

import br.com.bernardiesel.dto.response.ApiError;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException exception) {

        Map<String, String> details = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        error -> error.getField(),
                        error -> error.getDefaultMessage(),
                        (first, second) -> first
                ));

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Existem campos inválidos na requisição.",
                details
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(
            BadCredentialsException exception) {

        return buildResponse(
                HttpStatus.UNAUTHORIZED,
                "E-mail ou senha incorretos."
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthentication(
            AuthenticationException exception) {

        return buildResponse(
                HttpStatus.UNAUTHORIZED,
                "Não foi possível autenticar o usuário."
        );
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(
            EntityNotFoundException exception) {

        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(
            IllegalArgumentException exception) {

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage()
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrity(
            DataIntegrityViolationException exception) {

        return buildResponse(
                HttpStatus.CONFLICT,
                "Não foi possível realizar a operação devido a um conflito nos dados."
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadableMessage(
            HttpMessageNotReadableException exception) {

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "O corpo da requisição está ausente ou possui formato inválido."
        );
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleResponseStatus(
            ResponseStatusException exception) {

        HttpStatus status = HttpStatus.valueOf(
                exception.getStatusCode().value()
        );

        return buildResponse(
                status,
                exception.getReason()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(
            Exception exception) {

        exception.printStackTrace();

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocorreu um erro interno no servidor."
        );
    }

    private ResponseEntity<ApiError> buildResponse(
            HttpStatus status,
            String message) {

        return buildResponse(status, message, null);
    }

    private ResponseEntity<ApiError> buildResponse(
            HttpStatus status,
            String message,
            Map<String, String> details) {

        ApiError error = new ApiError(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                details
        );

        return ResponseEntity.status(status).body(error);
    }
}