package com.example.apirest.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.example.apirest.model.Venta;
import com.example.apirest.repository.VentaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class VentaControllerTest {

    @Mock
    private VentaRepository repository;

    @InjectMocks
    private VentaController controller;

    @Test
    void guardarVentaDebeRetornarMensajeCorrecto() {

        Venta venta = new Venta();
        venta.setProducto("Teclado");
        venta.setCantidad(2);
        venta.setTotal(150000);

        when(repository.save(venta)).thenReturn(venta);

        String respuesta = controller.guardarVenta(venta);

        assertEquals("Venta registrada correctamente", respuesta);
    }
}