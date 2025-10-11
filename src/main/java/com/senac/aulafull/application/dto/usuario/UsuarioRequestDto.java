package com.senac.aulafull.application.dto.usuario;

public record UsuarioRequestDto(Long id, String nome, String CPF, String senha, String email, String role) {
}
