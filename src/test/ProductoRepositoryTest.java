package com.example.apirest.repository;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import com.example.apirest.model.Producto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ProductoRepositoryTest {

    @Autowired
    private ProductoRepository repository;

    @Test
    void listarProductosDebeRetornarLista() {

        List<Producto> productos = repository.findAll();

        assertNotNull(productos);

    }
}