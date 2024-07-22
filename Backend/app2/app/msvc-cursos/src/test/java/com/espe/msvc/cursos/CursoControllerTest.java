package com.espe.msvc.cursos;

import com.espe.msvc.cursos.controllers.CursoController;
import com.espe.msvc.cursos.models.entity.Curso;
import com.espe.msvc.cursos.models.entity.Usuario;
import com.espe.msvc.cursos.services.CursoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CursoController.class)
public class CursoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CursoService cursoService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testListar() throws Exception {
        when(cursoService.listar()).thenReturn(Arrays.asList(new Curso(), new Curso()));

        mockMvc.perform(get("/cursos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void testDetalle() throws Exception {
        Curso curso = new Curso();
        curso.setNombre("Curso de Spring Boot");
        when(cursoService.porId(anyLong())).thenReturn(Optional.of(curso));

        mockMvc.perform(get("/cursos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Curso de Spring Boot"));
    }

    @Test
    public void testCrear() throws Exception {
        Curso curso = new Curso();
        curso.setNombre("Curso de Spring Boot");
        when(cursoService.guardar(any(Curso.class))).thenReturn(curso);

        mockMvc.perform(post("/cursos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\": \"Curso de Spring Boot\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Curso de Spring Boot"));
    }

    @Test
    public void testEditar() throws Exception {
        Curso curso = new Curso();
        curso.setNombre("Curso de Spring Boot");
        when(cursoService.porId(anyLong())).thenReturn(Optional.of(curso));
        when(cursoService.guardar(any(Curso.class))).thenReturn(curso);

        mockMvc.perform(put("/cursos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\": \"Curso de Spring Boot\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Curso de Spring Boot"));
    }

    @Test
    public void testEliminar() throws Exception {
        Curso curso = new Curso();
        when(cursoService.porId(anyLong())).thenReturn(Optional.of(curso));

        mockMvc.perform(delete("/cursos/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testAsignarUsuario() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setNombre("John Doe");
        when(cursoService.agregarUsuario(any(Usuario.class), anyLong())).thenReturn(Optional.of(usuario));

        mockMvc.perform(put("/cursos/asignar-usuario/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\": \"John Doe\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("John Doe"));
    }
    /*
    @Test
    public void testEliminarUsuario() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setNombre("John Doe");
        when(cursoService.eliminarUsuario(any(Usuario.class), anyLong())).thenReturn(Optional.of(usuario));

        mockMvc.perform(put("/cursos/eliminar-usuario/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\": \"John Doe\"}"))
                .andExpect(status().isNoContent());
    }
    */
}
