package com.espe.msvc.cursos.clients;

import com.espe.msvc.cursos.models.entity.Usuario;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "msvc-usuarios", url = "http://localhost:8001")
public interface UsuarioClientRest {

    @GetMapping("/usuarios/{id}")
    Usuario detalle(@PathVariable Long id);

    @PostMapping("/usuarios")
    Usuario crear(@RequestBody Usuario usuario);
}

