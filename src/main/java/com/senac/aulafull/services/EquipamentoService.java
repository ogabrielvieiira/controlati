package com.senac.aulafull.services;

import com.senac.aulafull.dto.LoginRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EquipamentoService {


    public boolean validarSenha(LoginRequestDto login){
        return false;
    }
}
