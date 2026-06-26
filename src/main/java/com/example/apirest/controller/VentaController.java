package com.example.apirest.controller;


import com.example.apirest.model.Venta;
import com.example.apirest.repository.VentaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/ventas")
@CrossOrigin("*")
public class VentaController {


@Autowired
private VentaRepository repository;



@PostMapping
public String guardarVenta(
@RequestBody Venta venta){


repository.save(venta);


return "Venta registrada correctamente";

}



@GetMapping
public List<Venta> listarVentas(){


return repository.findAll();

}



@DeleteMapping("/{id}")
public String eliminarVenta(
@PathVariable Long id){


repository.deleteById(id);


return "Venta eliminada";

}

}