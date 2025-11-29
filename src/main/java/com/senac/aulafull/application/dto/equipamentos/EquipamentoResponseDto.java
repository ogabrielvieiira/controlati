package com.senac.aulafull.application.dto.equipamentos;

import com.senac.aulafull.domain.entities.Equipamento;

public record EquipamentoResponseDto(Long id, String patrimonio, String tipo, String status, Long usuarioId, String usuarioNome) {

    public EquipamentoResponseDto(Equipamento equipamento) {
        this(
                equipamento.getId(),
                equipamento.getPatrimonio(),
                equipamento.getTipo(),
                equipamento.getStatus(),
                equipamento.getUsuario() != null ? equipamento.getUsuario().getId() : null,
                equipamento.getUsuario() != null ? equipamento.getUsuario().getNome() : null
        );
    }
}