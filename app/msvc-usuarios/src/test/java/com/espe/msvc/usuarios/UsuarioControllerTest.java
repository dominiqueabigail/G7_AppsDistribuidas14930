package com.espe.msvc.usuarios;

import com.espe.msvc.usuarios.controllers.UsuarioController;
import com.espe.msvc.usuarios.models.entity.Usuario;
import com.espe.msvc.usuarios.services.UsuarioService;
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

@WebMvcTest(UsuarioController.class)
public class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testListar() throws Exception {
        when(usuarioService.listar()).thenReturn(Arrays.asList(new Usuario(), new Usuario()));

        mockMvc.perform(get("/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void testDetalle() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setNombre("John Doe");
        when(usuarioService.porId(anyLong())).thenReturn(Optional.of(usuario));

        mockMvc.perform(get("/usuarios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("John Doe"));
    }

    @Test
    public void testCrear() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setNombre("John Doe");
        when(usuarioService.guardar(any(Usuario.class))).thenReturn(usuario);

        mockMvc.perform(post("/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\": \"John Doe\", \"email\": \"john.doe@example.com\", \"password\": \"password\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("John Doe"));
    }

    @Test
    public void testEditar() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setNombre("John Doe");
        when(usuarioService.porId(anyLong())).thenReturn(Optional.of(usuario));
        when(usuarioService.guardar(any(Usuario.class))).thenReturn(usuario);

        mockMvc.perform(put("/usuarios/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\": \"John Doe\", \"email\": \"john.doe@example.com\", \"password\": \"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("John Doe"));
    }

    @Test
    public void testEliminar() throws Exception {
        Usuario usuario = new Usuario();
        when(usuarioService.porId(anyLong())).thenReturn(Optional.of(usuario));

        mockMvc.perform(delete("/usuarios/1"))
                .andExpect(status().isNoContent());
    }
}
