package com.senac.aulafull.controller;

import com.senac.aulafull.model.Equipamento;
import com.senac.aulafull.repository.EquipamentoRepository;
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

    @GetMapping("/id")
    public ResponseEntity<?> consultaPorId(@PathVariable Long id) {
        var equipamento = equipamentoRepository.findById(id).
                orElse(null);

        if (equipamento == null){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(equipamento);
    }

    @GetMapping
    @Operation(summary = "patrimonio", description = "Método responsável por consultar os equipamentos do sistema")
    public ResponseEntity<?> consultarTodos() {

        return ResponseEntity.ok(equipamentoRepository.findAll());

    }

    @PostMapping
    @Operation(summary = "Salvar Equipamento", description = "Método responsável por criar os equipamentos do sistema")
    public ResponseEntity<?> salvarEquipamento(@RequestBody Equipamento equipamento) {
        try {

            var equipamentoResponse = equipamentoRepository.save(equipamento);

            return ResponseEntity.ok(equipamentoResponse);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}