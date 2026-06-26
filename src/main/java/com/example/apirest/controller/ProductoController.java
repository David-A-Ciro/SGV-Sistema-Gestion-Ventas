package com.example.apirest.controller;

import com.example.apirest.model.Producto;
import com.example.apirest.repository.ProductoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@CrossOrigin("*")
public class ProductoController {

    @Autowired
    private ProductoRepository repository;

    // REGISTRAR PRODUCTO
    @PostMapping
    public String guardarProducto(@RequestBody Producto producto) {

        repository.save(producto);

        return "Producto registrado correctamente";
    }

    // LISTAR PRODUCTOS
    @GetMapping
    public List<Producto> listarProductos() {

        return repository.findAll();
    }
    
    // ELIMINAR PRODUCTO
@DeleteMapping("/{id}")
public String eliminarProducto(@PathVariable Long id) {

    repository.deleteById(id);

    return "Producto eliminado correctamente";
}

// EDITAR PRODUCTO
@PutMapping("/{id}")
public String editarProducto(@PathVariable Long id,
                             @RequestBody Producto productoActualizado) {

    Producto producto = repository.findById(id).orElse(null);

    if (producto == null) {
        return "Producto no encontrado";
    }

    producto.setNombre(productoActualizado.getNombre());
    producto.setPrecio(productoActualizado.getPrecio());
    producto.setCantidad(productoActualizado.getCantidad());

    repository.save(producto);

    return "Producto actualizado correctamente";
}

}