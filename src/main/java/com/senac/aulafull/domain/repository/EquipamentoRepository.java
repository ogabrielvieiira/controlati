package com.senac.aulafull.domain.repository;

import com.senac.aulafull.domain.entities.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {
    Optional<Equipamento> findByPatrimonio(String patrimonio);
}