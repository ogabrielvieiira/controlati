package com.senac.aulafull.presentation;

import com.senac.aulafull.application.dto.EquipamentoRequestDto;
import com.senac.aulafull.domain.entities.Equipamento;
import com.senac.aulafull.domain.repository.EquipamentoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/equipamentos")
@Tag(name = "Contralador de equipamentos", description = "Camada responsável por controlar os registros de equipamentos")
public class EquipamentoController {

    @Autowired
    private EquipamentoRepository equipamentoRepository;

    @GetMapping("/{id}")
    @Operation(summary = "Listar um equipamento", description = "Método responsável por consultar um equipamento específico do sistema")
    public ResponseEntity<?> consultaPorId(@PathVariable Long id) {
        var equipamento = equipamentoRepository.findById(id).
                orElse(null);

        if (equipamento == null){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(equipamento);
    }

    @GetMapping
    @Operation(summary = "Listar todos equipamentos", description = "Método responsável por consultar os equipamentos do sistema")
    public ResponseEntity<?> consultarTodos() {

        return ResponseEntity.ok(equipamentoRepository.findAll());

    }

    @PostMapping
    @Operation(summary = "Salvar Equipamento", description = "Método responsável por criar os equipamentos do sistema")
    public ResponseEntity<?> salvarEquipamento(@RequestBody EquipamentoRequestDto equipamento) {
        try {

            var equipamentoBanco = new Equipamento(null, equipamento.tipo(), equipamento.patrimonio(), equipamento.status());

            var equipamentoResponse =  equipamentoRepository.save(equipamentoBanco);

            return ResponseEntity.ok(equipamentoResponse);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar Equipamento", description = "Método responsável por atualizar um equipamento existente")
    public ResponseEntity<?> atualizarEquipamento(@PathVariable Long id, @RequestBody EquipamentoRequestDto equipamentoDetails) {
        // Busca o equipamento no banco de dados pelo ID
        return equipamentoRepository.findById(id)
                .map(equipamentoExistente -> {
                    // Atualiza os dados do equipamento encontrado com os novos dados
                    equipamentoExistente.setTipo(equipamentoDetails.tipo());
                    equipamentoExistente.setPatrimonio(equipamentoDetails.patrimonio());
                    equipamentoExistente.setStatus(equipamentoDetails.status());

                    // Salva o equipamento atualizado no banco
                    Equipamento equipamentoAtualizado = equipamentoRepository.save(equipamentoExistente);
                    return ResponseEntity.ok(equipamentoAtualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build()); // Retorna 404 se não encontrar
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar Equipamento", description = "Método responsável por deletar um equipamento pelo seu ID")
    public ResponseEntity<?> deletarEquipamento(@PathVariable Long id) {
        // Verifica se o equipamento existe antes de deletar
        if (!equipamentoRepository.existsById(id)) {
            return ResponseEntity.notFound().build(); // Retorna 404 se não encontrar
        }

        try {
            equipamentoRepository.deleteById(id);
            // Retorna 204 No Content, indicando sucesso na exclusão sem corpo de resposta
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            // Log do erro pode ser adicionado aqui
            return ResponseEntity.badRequest().body("Erro ao deletar o equipamento: " + e.getMessage());
        }
    }
}