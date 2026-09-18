const API_BASE_URL = "https://railway.app";

document.addEventListener("DOMContentLoaded", () => {
 
    /* ═══════════════════════════════════════════════════════════════════
       NAVEGACIÓN / VISTAS
    ════════════════════════════════════════════════════════════════════ */
    const topLinks = document.querySelectorAll("[data-view]");
    const views    = document.querySelectorAll(".view");
 
    function showView(name) {
        views.forEach(v => {
            v.classList.remove("active");
            v.style.display = "none";
        });
 
        const selected = document.getElementById(`view-${name}`);
        if (selected) {
            selected.classList.add("active");
            selected.style.display = "block";
        }
    }
 
    topLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const viewName = link.getAttribute("data-view");
 
            document.querySelectorAll("[data-view]")
                .forEach(l => l.classList.remove("active"));
 
            document.querySelectorAll(`[data-view="${viewName}"]`)
                .forEach(l => l.classList.add("active"));
 
            showView(viewName);
        });
    });
 
    showView("dashboard");
 
 
    /* ═══════════════════════════════════════════════════════════════════
       MODAL PRODUCTO — ABRIR / CERRAR
    ════════════════════════════════════════════════════════════════════ */
    const btnOpenProducto = document.getElementById("btnOpenProducto");
    const modalProducto   = document.getElementById("modalProducto");
    const cerrarModal     = document.getElementById("cerrarModal");
    const modalTitle      = document.getElementById("modalTitle");
    const formProductos   = document.getElementById("formProductos");
 
    btnOpenProducto && btnOpenProducto.addEventListener("click", () => {
        formProductos.reset();
        delete formProductos.dataset.id;
        modalTitle.textContent      = "Agregar Producto";
        modalProducto.style.display = "flex";
    });
 
    cerrarModal && cerrarModal.addEventListener("click", () => {
        modalProducto.style.display = "none";
    });
 
    window.addEventListener("click", (e) => {
        if (e.target === modalProducto) modalProducto.style.display = "none";
        if (e.target === modalVenta)    modalVenta.style.display    = "none";
    });
 
 
    /* ═══════════════════════════════════════════════════════════════════
       PRODUCTOS — LÓGICA CRUD
    ════════════════════════════════════════════════════════════════════ */
    const productosContainer = document.getElementById("productosContainer");
    let productos = [];
 
    /* ── Helpers ── */
    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, m =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]
        );
    }
 
    /* ── Carga ── */
    async function cargarProductos() {
        try {
            const respuesta = await fetch(`${API_BASE_URL}/productos`);
            productos = await respuesta.json();
            renderProductos();
        } catch (error) {
            console.error("Error al cargar productos", error);
        }
    }
 
    let productoSeleccionado = null;
 
    /* ── Venta: cargar productos con filtro ── */
    async function cargarProductosVenta(filtro = "") {
        const cont = document.getElementById("productosVenta");
        cont.innerHTML = "";
 
        const encontrados = productos.filter(p => {
            const texto = (p.nombre + " " + p.categoria).toLowerCase();
            return texto.includes(filtro.toLowerCase());
        });
 
        if (encontrados.length === 0) {
            cont.innerHTML = "<p>No se encontraron productos</p>";
            return;
        }
 
        encontrados.forEach(p => {
            cont.innerHTML += `
                <div class="product-card">
                    <h3>${p.nombre}</h3>
                    <p>🏷️ ${p.categoria}</p>
                    <p>💲 ${p.precio.toLocaleString()}</p>
                    <p>📦 Stock: ${p.cantidad}</p>
                    <button class="btn-primary btnComprar" data-id="${p.id}">
                        Elegir
                    </button>
                </div>
            `;
        });
 
        document.querySelectorAll(".btnComprar").forEach(btn => {
            btn.onclick = () => seleccionarProducto(btn.dataset.id);
        });
    }
 
    document.getElementById("buscarProductoVenta").addEventListener("input", (e) => {
        cargarProductosVenta(e.target.value);
    });
 
    /* ── Venta: seleccionar producto ── */
    function seleccionarProducto(id) {
        productoSeleccionado = productos.find(p => p.id == id);
 
        if (!productoSeleccionado) return;
 
        document.getElementById("ventaProducto").value = productoSeleccionado.nombre;
        document.getElementById("ventaStock").value    = productoSeleccionado.cantidad;
 
        const cantidad = document.getElementById("ventaCantidad");
        cantidad.value = 1;
        cantidad.max   = productoSeleccionado.cantidad;
 
        calcularTotal();
    }
 
    /* ── Venta: calcular total ── */
    function calcularTotal() {
        if (!productoSeleccionado) return;
 
        let cantidad = Number(document.getElementById("ventaCantidad").value);
 
        if (cantidad > productoSeleccionado.cantidad) {
            cantidad = productoSeleccionado.cantidad;
            document.getElementById("ventaCantidad").value = cantidad;
        }
 
        document.getElementById("ventaTotal").value = cantidad * productoSeleccionado.precio;
    }
 
    document.getElementById("ventaCantidad").addEventListener("input", calcularTotal);
 
    /* ── Render productos ── */
    function renderProductos() {
        if (!productosContainer) return;
        productosContainer.innerHTML = "";
 
        if (productos.length === 0) {
            productosContainer.innerHTML = "<p>No hay productos registrados.</p>";
            return;
        }
 
        const grid = document.createElement("div");
        grid.style.cssText = "display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:18px;";
 
        productos.forEach((p, idx) => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${escapeHtml(p.imagen || '')}" alt="${escapeHtml(p.nombre)}"
                     style="width:100%; height:140px; object-fit:cover; border-radius:8px; margin-bottom:10px;">
                <h4 style="margin:0 0 6px 0;">${escapeHtml(p.nombre)}</h4>
                <small style="color:#6b7280;">${escapeHtml(p.categoria || '')}</small>
                <p style="margin:8px 0 6px 0; font-weight:600; color:#1f2937;">$${Number(p.precio).toFixed(2)}</p>
                <p style="margin:0 0 8px 0; color:#6b7280;">Stock: ${p.cantidad}</p>
                <div style="display:flex; gap:8px;">
                    <button class="btn-edit" data-i="${idx}"
                        style="flex:1; padding:8px; border-radius:8px; border:1px solid #e2e8f0; background:#fff; cursor:pointer;">
                        Editar
                    </button>
                    <button class="btn-delete" data-i="${idx}"
                        style="flex:1; padding:8px; border-radius:8px; border:none; background:#ef4444; color:#fff; cursor:pointer;">
                        Eliminar
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
 
        productosContainer.appendChild(grid);
 
        // Eliminar
        productosContainer.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const producto = productos[Number(btn.dataset.i)];
                fetch(`${API_BASE_URL}/productos/${producto.id}`, { method: "DELETE" })
                    .then(() => cargarProductos())
                    .catch(err => console.error(err));
            });
        });
 
        // Editar
        productosContainer.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const p = productos[Number(btn.dataset.i)];
                document.getElementById("prodNombre").value    = p.nombre;
                document.getElementById("prodCategoria").value = p.categoria;
                document.getElementById("prodPrecio").value   = p.precio;
                document.getElementById("prodStock").value    = p.cantidad;
                formProductos.dataset.id    = p.id;
                modalTitle.textContent      = "Editar Producto";
                modalProducto.style.display = "flex";
            });
        });
    }
 
    /* ── Guardar producto (crear / editar) ── */
    formProductos && formProductos.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id    = formProductos.dataset.id;
        const nuevo = {
            nombre:    document.getElementById("prodNombre").value.trim(),
            categoria: document.getElementById("prodCategoria").value,
            precio:    parseFloat(document.getElementById("prodPrecio").value),
            cantidad:  parseInt(document.getElementById("prodStock").value)
        };
 
        try {
            let respuesta;
            if (id) {
                respuesta = await fetch(`${API_BASE_URL}/productos/${id}`, {
                    method:  "PUT",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify(nuevo)
                });
            } else {
                respuesta = await fetch(`${API_BASE_URL}/productos`, {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify(nuevo)
                });
            }
 
            alert(await respuesta.text());
            formProductos.reset();
            delete formProductos.dataset.id;
            modalProducto.style.display = "none";
            cargarProductos();
            cargarVentas();
        } catch (error) {
            alert("Error al guardar producto");
            console.error(error);
        }
    });
 
    cargarProductos();
 
 
    /* ═══════════════════════════════════════════════════════════════════
       VENTAS — LÓGICA CRUD
    ════════════════════════════════════════════════════════════════════ */
    const ventas           = [];
    const btnNuevaVenta    = document.getElementById("btnNuevaVenta");
    const modalVenta       = document.getElementById("modalVenta");
    const cerrarModalVenta = document.getElementById("cerrarModalVenta");
    const formVenta        = document.getElementById("formVenta");
    const ventasBody       = document.getElementById("ventasBody");
 
    /* ── Modal nueva venta ── */
    btnNuevaVenta.addEventListener("click", async () => {
        await cargarProductos();
        productoSeleccionado = null;
        formVenta.reset();
        modalVenta.style.display = "flex";
    });
 
    cerrarModalVenta && cerrarModalVenta.addEventListener("click", () => {
        modalVenta.style.display = "none";
    });
 
    /* ── Modal selector de productos ── */
    const btnSeleccionarProducto = document.getElementById("btnSeleccionarProducto");
    const modalProductosVenta    = document.getElementById("modalProductosVenta");
    const cerrarProductosVenta   = document.getElementById("cerrarProductosVenta");
 
    btnSeleccionarProducto.onclick = () => {
        cargarProductosVenta();
        modalProductosVenta.style.display = "flex";
    };
 
    cerrarProductosVenta.onclick = () => {
        modalProductosVenta.style.display = "none";
    };
 
    /* ── Guardar venta ── */
    formVenta && formVenta.addEventListener("submit", (e) => {
        e.preventDefault();
 
        if (!productoSeleccionado) {
            alert("Seleccione un producto");
            return;
        }
 
        const venta = {
            cliente:    document.getElementById("ventaCliente").value,
            producto:   document.getElementById("ventaProducto").value,
            cantidad:   Number(document.getElementById("ventaCantidad").value),
            total:      Number(document.getElementById("ventaTotal").value),
            fecha:      new Date().toISOString().slice(0, 10),
            estado:     document.getElementById("ventaEstado").value,
            metodoPago: "Efectivo"
        };
 
        fetch(`${API_BASE_URL}/ventas`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(venta)
        })
            .then(res  => res.text())
            .then(data => {
                alert(data);
                cargarVentas();
                modalVenta.style.display = "none";
            });
    });
 
    /* ── Carga ventas ── */
    async function cargarVentas() {
        const respuesta = await fetch(`${API_BASE_URL}/ventas`);
        const datos     = await respuesta.json();
        ventas.length   = 0;
        ventas.push(...datos);
        renderVentas();
    }
 
    /* ── Render ventas ── */
    function renderVentas() {
        if (!ventasBody) return;
        ventasBody.innerHTML = "";
 
        ventas.forEach(v => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${v.id}</td>
                <td>${v.cliente}</td>
                <td>${v.producto}</td>
                <td>${v.cantidad}</td>
                <td>$${Number(v.total).toFixed(2)}</td>
                <td>${v.fecha}</td>
                <td><span class="estado-${v.estado.toLowerCase()}">${v.estado}</span></td>
                <td>⋮</td>
            `;
            ventasBody.appendChild(row);
        });
    }
 
    cargarVentas();
 
 
    /* ═══════════════════════════════════════════════════════════════════
       USUARIOS — LÓGICA CRUD
    ════════════════════════════════════════════════════════════════════ */
    const usuarios        = [];
    const usuariosBody    = document.getElementById("usuariosBody");
    const modalUsuario    = document.getElementById("modalUsuario");
    const btnNuevoUsuario = document.getElementById("btnNuevoUsuario");
    const cerrarUsuario   = document.getElementById("cerrarUsuario");
    const formUsuario     = document.getElementById("formUsuario");
 
    /* ── Modal ── */
    btnNuevoUsuario && btnNuevoUsuario.addEventListener("click", () => {
        modalUsuario.style.display = "flex";
    });
 
    cerrarUsuario && cerrarUsuario.addEventListener("click", () => {
        modalUsuario.style.display = "none";
    });
 
    /* ── Guardar usuario ── */
    formUsuario && formUsuario.addEventListener("submit", async (e) => {
        e.preventDefault();
 
        const usuario = {
            nombre:   document.getElementById("usuarioNombre").value,
            password: document.getElementById("usuarioPassword").value
        };
 
        const respuesta = await fetch(`${API_BASE_URL}/usuarios/registro`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(usuario)
        });
 
        alert(await respuesta.text());
        modalUsuario.style.display = "none";
        cargarUsuarios();
    });
 
    /* ── Carga usuarios ── */
    async function cargarUsuarios() {
        const respuesta = await fetch(`${API_BASE_URL}/usuarios`);
        const datos     = await respuesta.json();
        usuarios.length = 0;
        usuarios.push(...datos);
        renderUsuarios();
    }
 
    /* ── Render usuarios ── */
    function renderUsuarios() {
        if (!usuariosBody) return;
        usuariosBody.innerHTML = "";
 
        document.getElementById("totalUsuarios").innerHTML = usuarios.length;
 
        usuarios.forEach(u => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>#${u.id}</td>
                <td>👤 ${u.nombre}</td>
                <td><span class="estado-completado">Activo</span></td>
                <td>
                    <button class="btn-white verUsuario" data-id="${u.id}">
                        Ver
                    </button>
                </td>
            `;
            usuariosBody.appendChild(row);
        });
 
        document.querySelectorAll(".verUsuario").forEach(btn => {
            btn.addEventListener("click", () => {
                const usuario = usuarios.find(x => x.id == btn.dataset.id);
                document.getElementById("detalleId").innerHTML       = usuario.id;
                document.getElementById("detalleNombre").innerHTML   = usuario.nombre;
                document.getElementById("detallePassword").innerHTML = "••••••";
                document.getElementById("modalDetalleUsuario").style.display = "flex";
            });
        });
    }
 
    document.getElementById("cerrarDetalleUsuario").addEventListener("click", () => {
        document.getElementById("modalDetalleUsuario").style.display = "none";
    });
 
    cargarUsuarios();
 
 
    /* ═══════════════════════════════════════════════════════════════════
       CHARTS — DASHBOARD
    ════════════════════════════════════════════════════════════════════ */
    if (typeof Chart !== "undefined") {
        const c1 = document.getElementById("chart1");
        if (c1) {
            new Chart(c1, {
                type: "bar",
                data: {
                    labels:   ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
                    datasets: [
                        { label: "Ventas",    data: [1200, 3000, 2400, 2600, 2000, 2300], backgroundColor: "#1D4ED8" },
                        { label: "Ganancias", data: [800,  1800, 1600, 1750, 1400, 1500], backgroundColor: "#93C5FD" }
                    ]
                }
            });
        }
 
        const c2 = document.getElementById("chart2");
        if (c2) {
            new Chart(c2, {
                type: "doughnut",
                data: {
                    labels:   ["Electrónica", "Ropa", "Hogar", "Otros"],
                    datasets: [{
                        data:            [40, 25, 20, 15],
                        backgroundColor: ["#2563EB", "#F59E0B", "#10B981", "#EF4444"]
                    }]
                }
            });
        }
    }
 
}); // end DOMContentLoaded