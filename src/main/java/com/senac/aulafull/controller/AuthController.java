package com.senac.aulafull.controller;

import com.senac.aulafull.dto.LoginRequestDto;
import com.senac.aulafull.services.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Contoller Autenticação", description = "Controller responsável pela autenticação")
public class AuthController {

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Método responsável por efetuar o login do usuário")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request){

        var token = tokenService.gerarToken(request.usuario(), request.senha());

        return ResponseEntity.ok(token);
    }
}
