package com.example.apirest.repository;


import com.example.apirest.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;



public interface VentaRepository 
extends JpaRepository<Venta,Long>{

}