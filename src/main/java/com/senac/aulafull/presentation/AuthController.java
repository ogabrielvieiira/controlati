package com.senac.aulafull.presentation;

import com.senac.aulafull.application.dto.login.EsqueciMinhaSenhaDto;
import com.senac.aulafull.application.dto.usuario.RegistrarNovaSenhaDto;
import com.senac.aulafull.application.dto.usuario.UsuarioPrincipalDto;
import com.senac.aulafull.application.dto.login.LoginRequestDto;
import com.senac.aulafull.application.dto.login.LoginResponseDto;
import com.senac.aulafull.application.services.TokenService;
import com.senac.aulafull.application.services.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Contoller Autenticação", description = "Controller responsável pela autenticação")
public class AuthController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Método responsável por efetuar o login do usuário")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request){



        if (!usuarioService.validarSenha(request)){
            return ResponseEntity.badRequest().body("Usuário ou senha Invalido");
        }
        var token = tokenService.gerarToken(request);

        return ResponseEntity.ok(new LoginResponseDto(token));
    }


    @GetMapping("/recuperarsenha/envio")
    @Operation(summary = "Recuperar Senha", description = "Método de envio de email")
    public ResponseEntity<?> recuperarSenhaEnvio(@AuthenticationPrincipal UsuarioPrincipalDto usuarioLogado){

        usuarioService.recuperarSenhaEnvio(usuarioLogado);

        return ResponseEntity.ok("Código enviado com sucesso");

    }

    @PostMapping("/esqueciminhasenha")
    @Operation(summary = "Esqueci minha senha", description = "Método para recuperar senha")
    public ResponseEntity<?> esqueciMinhaSenha(@RequestBody EsqueciMinhaSenhaDto esqueciMinhaSenhaDto){
        try {

            usuarioService.esqueciMinhaSenha(esqueciMinhaSenhaDto);
            return ResponseEntity.ok().build();

        } catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/registrarnovasenha")
    @Operation(summary = "Registrar nova senha", description = "Método para registrar uma nova senha")
    public ResponseEntity<?> registrarNovaSenha(@RequestBody RegistrarNovaSenhaDto registrarNovaSenhaDto){

        try {
            usuarioService.registrarNovaSenha(registrarNovaSenhaDto);
            return ResponseEntity.ok().build();

        } catch (Exception e){
            return ResponseEntity.badRequest().build();
        }

    }

}
