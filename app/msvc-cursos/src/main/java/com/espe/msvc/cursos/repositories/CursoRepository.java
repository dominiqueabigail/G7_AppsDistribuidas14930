package com.espe.msvc.cursos.repositories;

import com.espe.msvc.cursos.models.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface CursoRepository extends JpaRepository<Curso, Long> { }
