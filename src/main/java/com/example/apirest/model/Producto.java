package com.example.apirest.model;

import jakarta.persistence.*;

@Entity
@Table(name="productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String categoria;

    private Double precio;

    private Integer cantidad;


    public Producto(){
    }


    public Long getId(){
        return id;
    }


    public void setId(Long id){
        this.id=id;
    }


    public String getNombre(){
        return nombre;
    }


    public void setNombre(String nombre){
        this.nombre=nombre;
    }


    public String getCategoria(){
        return categoria;
    }


    public void setCategoria(String categoria){
        this.categoria=categoria;
    }


    public Double getPrecio(){
        return precio;
    }


    public void setPrecio(Double precio){
        this.precio=precio;
    }


    public Integer getCantidad(){
        return cantidad;
    }


    public void setCantidad(Integer cantidad){
        this.cantidad=cantidad;
    }
}