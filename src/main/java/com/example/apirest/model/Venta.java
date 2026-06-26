package com.example.apirest.model;


import jakarta.persistence.*;
import java.time.LocalDate;


@Entity
@Table(name="ventas")
public class Venta {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


private String cliente;


private String producto;


private Integer cantidad;


private LocalDate fecha;


private Double total;


private String estado;


private String metodoPago;



public Venta(){
}


public Long getId(){
    return id;
}


public void setId(Long id){
    this.id=id;
}


public String getCliente(){
    return cliente;
}


public void setCliente(String cliente){
    this.cliente=cliente;
}


public String getProducto(){
    return producto;
}


public void setProducto(String producto){
    this.producto=producto;
}


public Integer getCantidad(){
    return cantidad;
}


public void setCantidad(Integer cantidad){
    this.cantidad=cantidad;
}


public LocalDate getFecha(){
    return fecha;
}


public void setFecha(LocalDate fecha){
    this.fecha=fecha;
}


public Double getTotal(){
    return total;
}


public void setTotal(Double total){
    this.total=total;
}


public String getEstado(){
    return estado;
}


public void setEstado(String estado){
    this.estado=estado;
}


public String getMetodoPago(){
    return metodoPago;
}


public void setMetodoPago(String metodoPago){
    this.metodoPago=metodoPago;
}

}