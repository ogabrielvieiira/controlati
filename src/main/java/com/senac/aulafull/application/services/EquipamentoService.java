package com.senac.aulafull.application.services;

import com.senac.aulafull.application.dto.equipamentos.EquipamentoRequestDto;
import com.senac.aulafull.application.dto.equipamentos.EquipamentoResponseDto;
import com.senac.aulafull.application.dto.usuario.UsuarioPrincipalDto;
import com.senac.aulafull.domain.entities.Equipamento;
import com.senac.aulafull.domain.entities.Usuario;
import com.senac.aulafull.domain.repository.EquipamentoRepository;
import com.senac.aulafull.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EquipamentoService {

    @Autowired
    private EquipamentoRepository equipamentoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private boolean isAdmin(UsuarioPrincipalDto usuarioPrincipal) {
        return usuarioPrincipal.autorizacao().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
    }

    public EquipamentoResponseDto consultarPorId(Long id, UsuarioPrincipalDto usuarioLogado) {
        Optional<Equipamento> equipamentoOpt = equipamentoRepository.findById(id);

        if (equipamentoOpt.isEmpty()) {
            return null;
        }

        Equipamento equipamento = equipamentoOpt.get();

        if (!isAdmin(usuarioLogado) && !equipamento.getUsuario().getId().equals(usuarioLogado.id())) {
            throw new SecurityException("Acesso negado");
        }

        return new EquipamentoResponseDto(equipamento);
    }

    public List<EquipamentoResponseDto> consultarTodos(UsuarioPrincipalDto usuarioLogado) {
        List<Equipamento> lista;

        if (isAdmin(usuarioLogado)) {
            lista = equipamentoRepository.findAll();
        } else {
            lista = equipamentoRepository.findByUsuarioId(usuarioLogado.id());
        }

        return lista.stream()
                .map(EquipamentoResponseDto::new)
                .collect(Collectors.toList());
    }

    public EquipamentoResponseDto salvarEquipamento(EquipamentoRequestDto equipamentoDto, UsuarioPrincipalDto usuarioLogado) {
        Usuario usuario = usuarioRepository.findById(usuarioLogado.id())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Equipamento equipamento = new Equipamento(
                null,
                equipamentoDto.patrimonio(),
                equipamentoDto.tipo(),
                equipamentoDto.status(),
                usuario
        );

        Equipamento salvo = equipamentoRepository.save(equipamento);
        return new EquipamentoResponseDto(salvo);
    }

    public EquipamentoResponseDto atualizarEquipamento(Long id, EquipamentoRequestDto dto, UsuarioPrincipalDto usuarioLogado) {
        Optional<Equipamento> equipamentoOpt = equipamentoRepository.findById(id);

        if (equipamentoOpt.isEmpty()) {
            return null;
        }

        Equipamento equipamento = equipamentoOpt.get();

        if (!isAdmin(usuarioLogado) && !equipamento.getUsuario().getId().equals(usuarioLogado.id())) {
            throw new SecurityException("Acesso negado");
        }

        equipamento.setTipo(dto.tipo());
        equipamento.setPatrimonio(dto.patrimonio());
        equipamento.setStatus(dto.status());

        Equipamento atualizado = equipamentoRepository.save(equipamento);
        return new EquipamentoResponseDto(atualizado);
    }

    public boolean deletarEquipamento(Long id, UsuarioPrincipalDto usuarioLogado) {
        Optional<Equipamento> equipamentoOpt = equipamentoRepository.findById(id);

        if (equipamentoOpt.isEmpty()) {
            return false;
        }

        Equipamento equipamento = equipamentoOpt.get();

        if (!isAdmin(usuarioLogado) && !equipamento.getUsuario().getId().equals(usuarioLogado.id())) {
            throw new SecurityException("Acesso negado");
        }

        equipamentoRepository.deleteById(id);
        return true;
    }
}