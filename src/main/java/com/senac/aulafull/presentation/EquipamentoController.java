package com.senac.aulafull.presentation;

import com.senac.aulafull.application.dto.equipamentos.EquipamentoRequestDto;
import com.senac.aulafull.application.dto.equipamentos.EquipamentoResponseDto;
import com.senac.aulafull.application.dto.usuario.UsuarioPrincipalDto;
import com.senac.aulafull.application.services.EquipamentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipamentos")
@Tag(name = "Controlador de equipamentos", description = "Camada responsável por controlar os registros de equipamentos")
public class EquipamentoController {

    @Autowired
    private EquipamentoService equipamentoService;

    @GetMapping("/{id}")
    @Operation(summary = "Listar um equipamento", description = "Método responsável por consultar um equipamento específico")
    public ResponseEntity<EquipamentoResponseDto> consultaPorId(@PathVariable Long id, @AuthenticationPrincipal UsuarioPrincipalDto usuarioLogado) {
        try {
            var equipamentoDto = equipamentoService.consultarPorId(id, usuarioLogado);
            if (equipamentoDto == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(equipamentoDto);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping
    @Operation(summary = "Listar todos equipamentos", description = "Método responsável por consultar os equipamentos")
    public ResponseEntity<List<EquipamentoResponseDto>> consultarTodos(@AuthenticationPrincipal UsuarioPrincipalDto usuarioLogado) {
        return ResponseEntity.ok(equipamentoService.consultarTodos(usuarioLogado));
    }

    @PostMapping
    @Operation(summary = "Salvar Equipamento", description = "Método responsável por criar os equipamentos para o usuário logado")
    public ResponseEntity<EquipamentoResponseDto> salvarEquipamento(@RequestBody EquipamentoRequestDto equipamentoDto, @AuthenticationPrincipal UsuarioPrincipalDto usuarioLogado) {
        try {
            var equipamentoResponse = equipamentoService.salvarEquipamento(equipamentoDto, usuarioLogado);
            return ResponseEntity.ok(equipamentoResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar Equipamento", description = "Método responsável por atualizar um equipamento existente")
    public ResponseEntity<EquipamentoResponseDto> atualizarEquipamento(@PathVariable Long id, @RequestBody EquipamentoRequestDto equipamentoDetails, @AuthenticationPrincipal UsuarioPrincipalDto usuarioLogado) {
        try {
            var equipamentoAtualizado = equipamentoService.atualizarEquipamento(id, equipamentoDetails, usuarioLogado);
            if (equipamentoAtualizado == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(equipamentoAtualizado);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar Equipamento", description = "Método responsável por deletar um equipamento pelo seu ID")
    public ResponseEntity<?> deletarEquipamento(@PathVariable Long id, @AuthenticationPrincipal UsuarioPrincipalDto usuarioLogado) {
        try {
            boolean deletado = equipamentoService.deletarEquipamento(id, usuarioLogado);
            if (!deletado) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar o equipamento: " + e.getMessage());
        }
    }
}