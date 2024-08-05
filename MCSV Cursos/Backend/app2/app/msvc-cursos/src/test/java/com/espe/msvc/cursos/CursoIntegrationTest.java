package com.espe.msvc.cursos;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CursoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testListar() throws Exception {
        mockMvc.perform(get("/cursos"))
                .andExpect(status().isOk());
    }

    @Test
    public void testDetalle() throws Exception {
        mockMvc.perform(get("/cursos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Curso de Spring Boot"));
    }

    @Test
    public void testCrear() throws Exception {
        mockMvc.perform(post("/cursos")
                        .contentType("application/json")
                        .content("{\"nombre\": \"Curso de Spring Boot\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Curso de Spring Boot"));
    }

    @Test
    public void testEditar() throws Exception {
        mockMvc.perform(put("/cursos/1")
                        .contentType("application/json")
                        .content("{\"nombre\": \"Curso de Spring Boot\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Curso de Spring Boot"));
    }

    @Test
    public void testEliminar() throws Exception {
        mockMvc.perform(delete("/cursos/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testAsignarUsuario() throws Exception {
        mockMvc.perform(put("/cursos/asignar-usuario/1")
                        .contentType("application/json")
                        .content("{\"nombre\": \"John Doe\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("John Doe"));
    }

    @Test
    public void testEliminarUsuario() throws Exception {
        mockMvc.perform(put("/cursos/eliminar-usuario/1")
                        .contentType("application/json")
                        .content("{\"nombre\": \"John Doe\"}"))
                .andExpect(status().isNoContent());
    }
}
