package com.senac.aulafull.presentation;

import com.senac.aulafull.application.dto.EquipamentoRequestDto;
import com.senac.aulafull.application.dto.usuario.UsuarioPrincipalDto;
import com.senac.aulafull.domain.entities.Equipamento;
import com.senac.aulafull.domain.entities.Usuario;
import com.senac.aulafull.domain.repository.EquipamentoRepository;
import com.senac.aulafull.domain.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/equipamentos")
@Tag(name = "Controlador de equipamentos", description = "Camada responsável por controlar os registros de equipamentos")
public class EquipamentoController {

    @Autowired
    private EquipamentoRepository equipamentoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/{id}")
    @Operation(summary = "Listar um equipamento", description = "Método responsável por consultar um equipamento específico do usuário logado")
    public ResponseEntity<?> consultaPorId(@PathVariable Long id, @AuthenticationPrincipal UsuarioPrincipalDto usuarioLogado) {
        var equipamentoOpt = equipamentoRepository.findById(id);

        if (equipamentoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Equipamento equipamento = equipamentoOpt.get();

        // VALIDAÇÃO DE SEGURANÇA: Verifica se o equipamento pertence ao usuário logado
        if (!equipamento.getUsuario().getId().equals(usuarioLogado.id())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(equipamento);
    }

    @GetMapping
    @Operation(summary = "Listar todos equipamentos", description = "Método responsável por consultar os equipamentos do usuário logado")
    public ResponseEntity<?> consultarTodos(@AuthenticationPrincipal UsuarioPrincipalDto usuarioLogado) {
        // FILTRAGEM: Retorna apenas os equipamentos do usuário logado
        return ResponseEntity.ok(equipamentoRepository.findByUsuarioId(usuarioLogado.id()));
    }

    @PostMapping
    @Operation(summary = "Salvar Equipamento", description = "Método responsável por criar os equipamentos para o usuário logado")
    public ResponseEntity<?> salvarEquipamento(@RequestBody EquipamentoRequestDto equipamentoDto, @AuthenticationPrincipal UsuarioPrincipalDto usuarioLogado) {
        try {
            // Busca a entidade Usuário completa para associar ao equipamento
            Usuario usuario = usuarioRepository.findById(usuarioLogado.id())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            // Cria o equipamento associando-o ao usuário logado
            // Atenção à ordem dos parâmetros do construtor gerado pelo Lombok (@AllArgsConstructor)
            // Ordem provável na Entidade: id, patrimonio, tipo, status, usuario
            var equipamentoBanco = new Equipamento(
                    null,
                    equipamentoDto.patrimonio(),
                    equipamentoDto.tipo(),
                    equipamentoDto.status(),
                    usuario
            );

            var equipamentoResponse = equipamentoRepository.save(equipamentoBanco);

            return ResponseEntity.ok(equipamentoResponse);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar Equipamento", description = "Método responsável por atualizar um equipamento existente")
    public ResponseEntity<?> atualizarEquipamento(@PathVariable Long id, @RequestBody EquipamentoRequestDto equipamentoDetails, @AuthenticationPrincipal UsuarioPrincipalDto usuarioLogado) {

        return equipamentoRepository.findById(id)
                .map(equipamentoExistente -> {
                    // VALIDAÇÃO DE SEGURANÇA: O equipamento pertence ao usuário?
                    if (!equipamentoExistente.getUsuario().getId().equals(usuarioLogado.id())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    }

                    // Atualiza os dados
                    equipamentoExistente.setTipo(equipamentoDetails.tipo());
                    equipamentoExistente.setPatrimonio(equipamentoDetails.patrimonio());
                    equipamentoExistente.setStatus(equipamentoDetails.status());

                    Equipamento equipamentoAtualizado = equipamentoRepository.save(equipamentoExistente);
                    return ResponseEntity.ok(equipamentoAtualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar Equipamento", description = "Método responsável por deletar um equipamento pelo seu ID")
    public ResponseEntity<?> deletarEquipamento(@PathVariable Long id, @AuthenticationPrincipal UsuarioPrincipalDto usuarioLogado) {

        Optional<Equipamento> equipamentoOpt = equipamentoRepository.findById(id);

        if (equipamentoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Equipamento equipamento = equipamentoOpt.get();

        // VALIDAÇÃO DE SEGURANÇA
        if (!equipamento.getUsuario().getId().equals(usuarioLogado.id())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            equipamentoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar o equipamento: " + e.getMessage());
        }
    }
}