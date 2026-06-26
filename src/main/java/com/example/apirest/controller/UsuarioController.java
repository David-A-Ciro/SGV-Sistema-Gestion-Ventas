package com.example.apirest.controller;

import com.example.apirest.model.Usuario;
import com.example.apirest.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin("*")
public class UsuarioController {


@Autowired
private UsuarioRepository repository;



@PostMapping("/registro")
public String registrar(@RequestBody Usuario usuario) {

    repository.save(usuario);

    return "Usuario registrado correctamente";
}



@PostMapping("/login")
public String login(@RequestBody Usuario usuario) {


    Usuario usuarioEncontrado =
            repository.findByNombre(usuario.getNombre());


    if(usuarioEncontrado != null &&
       usuarioEncontrado.getPassword()
       .equals(usuario.getPassword())){


        return "Autenticación satisfactoria";
    }


    return "Error en la autenticación";

}




@GetMapping
public List<Usuario> listarUsuarios(){

    return repository.findAll();

}



}