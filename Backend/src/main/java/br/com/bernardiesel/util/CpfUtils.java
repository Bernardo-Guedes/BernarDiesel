package br.com.bernardiesel.util;

public class CpfUtils {

    private CpfUtils() {
    }

    public static String normalizar(String cpf) {
        if (cpf == null) {
            return null;
        }
        return cpf.replaceAll("\\D", "");
    }

    public static boolean validar(String cpf) {
        cpf = normalizar(cpf);
        if (cpf == null || cpf.length() != 11) {
            return false;
        }
        if (cpf.matches("(\\d)\\1{10}")) {
            return false;
        }
        int primeiroDigito = calcularDigito(cpf, 9);
        int segundoDigito = calcularDigito(cpf, 10);
        return primeiroDigito == Character.getNumericValue(cpf.charAt(9))
                && segundoDigito == Character.getNumericValue(cpf.charAt(10));
    }

    private static int calcularDigito(String cpf, int posicao) {
        int soma = 0;
        int peso = posicao + 1;
        for (int i = 0; i < posicao; i++) {
            soma += Character.getNumericValue(cpf.charAt(i)) * peso--;
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
}