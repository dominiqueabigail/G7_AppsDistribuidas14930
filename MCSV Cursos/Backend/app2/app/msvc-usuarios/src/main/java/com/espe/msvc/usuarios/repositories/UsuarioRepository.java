package com.espe.msvc.usuarios.repositories;

import com.espe.msvc.usuarios.models.entity.Usuario;
import org.springframework.data.repository.CrudRepository;

public interface UsuarioRepository extends  CrudRepository<Usuario, Long>{

}
