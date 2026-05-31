let productos = [];
let ventas = [];
let configuracion = {};

function verificarAuth() {
    const logged = localStorage.getItem('adminLogged');
    if (!logged) {
        const password = prompt('🔐 Panel Administrativo - Ingrese contraseña:');
        if (password === 'KoalaAdmin2025') {
            localStorage.setItem('adminLogged', 'true');
            cargarDatos();
        } else if (password !== null) {
            alert('Contraseña incorrecta');
            window.location.href = 'index.html';
        }
    } else {
        cargarDatos();
    }
}

function cargarDatos() {
    const productosGuardados = localStorage.getItem('koalaProductos');
    if (productosGuardados) {
        productos = JSON.parse(productosGuardados);
    } else {
        productos = [
            { id: 1, nombre: "Panel Koala Lite", precio: 15, caracteristicas: ["Aim suave", "Ver paredes", "Sin anuncios"], stock: 999 },
            { id: 2, nombre: "Panel Koala Pro", precio: 25, caracteristicas: ["Aim profesional", "Magic Bullet", "Anti-Ban avanzado"], stock: 999 },
            { id: 3, nombre: "Panel Koala Ultra", precio: 35, caracteristicas: ["Todas las funciones Pro", "Soporte VIP", "Betas privadas"], stock: 999 }
        ];
        guardarProductos();
    }
    
    const ventasGuardadas = localStorage.getItem('koalaVentas');
    if (ventasGuardadas) {
        ventas = JSON.parse(ventasGuardadas);
    } else {
        ventas = [];
        guardarVentas();
    }
    
    const configGuardada = localStorage.getItem('koalaConfig');
    if (configGuardada) {
        configuracion = JSON.parse(configGuardada);
        document.getElementById('configWhatsapp').value = configuracion.whatsapp || '';
        document.getElementById('configDiscord').value = configuracion.discord || '';
        document.getElementById('configEmail').value = configuracion.email || '';
    }
    
    actualizarDashboard();
    mostrarProductos();
    mostrarVentas();
}

function guardarProductos() {
    localStorage.setItem('koalaProductos', JSON.stringify(productos));
}

function guardarVentas() {
    localStorage.setItem('koalaVentas', JSON.stringify(ventas));
}

function actualizarDashboard() {
    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const clientesUnicos = [...new Set(ventas.map(v => v.whatsapp))];
    const ventasHoy = ventas.filter(v => {
        const fechaVenta = new Date(v.fecha).toDateString();
        const hoy = new Date().toDateString();
        return fechaVenta === hoy;
    }).reduce((sum, v) => sum + v.total, 0);
    
    document.getElementById('totalVentas').innerText = `$${totalVentas}`;
    document.getElementById('totalClientes').innerText = clientesUnicos.length;
    document.getElementById('totalProductos').innerText = productos.length;
    document.getElementById('ventasHoy').innerText = `$${ventasHoy}`;
    
    const recientes = [...ventas].reverse().slice(0, 5);
    const tbody = document.getElementById('ventasRecientesBody');
    if (tbody) {
        if (recientes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No hay ventas aún</td></tr>';
        } else {
            tbody.innerHTML = recientes.map(v => `
                <tr>
                    <td>#${v.id}</td>
                    <td>${v.cliente}</td>
                    <td>${v.productos.join(', ')}</td>
                    <td>$${v.total}</td>
                    <td>${new Date(v.fecha).toLocaleDateString()}</td>
                    <td><span style="color: #f59e0b;">${v.estado}</span></td>
                </tr>
            `).join('');
        }
    }
}

function mostrarProductos() {
    const tbody = document.getElementById('productosBody');
    if (!tbody) return;
    
    tbody.innerHTML = productos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>$${p.precio}</td>
            <td>${p.caracteristicas.slice(0, 2).join(', ')}...</td>
            <td>${p.stock}</td>
            <td>
                <button class="btn-edit" onclick="editarProducto(${p.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" onclick="eliminarProducto(${p.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function mostrarVentas() {
    const tbody = document.getElementById('ventasBody');
    if (!tbody) return;
    
    if (ventas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">No hay ventas registradas</td></tr>';
        return;
    }
    
    tbody.innerHTML = ventas.map(v => `
        <tr>
            <td>#${v.id}</td>
            <td>${v.cliente}</td>
            <td>${v.whatsapp}</td>
            <td>${v.productos.join(', ')}</td>
            <td>$${v.total}</td>
            <td>${new Date(v.fecha).toLocaleString()}</td>
            <td>
                <select onchange="cambiarEstadoVenta(${v.id}, this.value)" style="background:#1a1a2e; color:white; padding:5px;">
                    <option value="pendiente" ${v.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="completado" ${v.estado === 'completado' ? 'selected' : ''}>Completado</option>
                    <option value="cancelado" ${v.estado === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </td>
            <td>
                <button class="btn-view" onclick="verDetalleVenta(${v.id})"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
    `).join('');
}

function cambiarEstadoVenta(id, nuevoEstado) {
    const venta = ventas.find(v => v.id === id);
    if (venta) {
        venta.estado = nuevoEstado;
        guardarVentas();
        mostrarVentas();
        actualizarDashboard();
    }
}

function verDetalleVenta(id) {
    const venta = ventas.find(v => v.id === id);
    if (venta) {
        alert(`Detalle de Venta #${id}\n\nCliente: ${venta.cliente}\nWhatsApp: ${venta.whatsapp}\nProductos: ${venta.productos.join(', ')}\nTotal: $${venta.total}\nFecha: ${new Date(venta.fecha).toLocaleString()}\nEstado: ${venta.estado}`);
    }
}

function filtrarVentas() {
    const busqueda = document.getElementById('buscarVenta')?.value.toLowerCase() || '';
    const estado = document.getElementById('filtroEstado')?.value || 'todos';
    
    const ventasFiltradas = ventas.filter(v => {
        const matchBusqueda = v.cliente.toLowerCase().includes(busqueda);
        const matchEstado = estado === 'todos' || v.estado === estado;
        return matchBusqueda && matchEstado;
    });
    
    const tbody = document.getElementById('ventasBody');
    if (tbody) {
        if (ventasFiltradas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">No se encontraron ventas</td></tr>';
        } else {
            tbody.innerHTML = ventasFiltradas.map(v => `
                <tr>
                    <td>#${v.id}</td>
                    <td>${v.cliente}</td>
                    <td>${v.whatsapp}</td>
                    <td>${v.productos.join(', ')}</td>
                    <td>$${v.total}</td>
                    <td>${new Date(v.fecha).toLocaleString()}</td>
                    <td><span style="color: ${v.estado === 'completado' ? '#10b981' : v.estado === 'pendiente' ? '#f59e0b' : '#ef4444'}">${v.estado}</span></td>
                    <td><button class="btn-view" onclick="verDetalleVenta(${v.id})">Ver</button></td>
                </tr>
            `).join('');
        }
    }
}

function abrirModalProducto(producto = null) {
    const modal = document.getElementById('modalProducto');
    const titulo = document.getElementById('modalProductoTitulo');
    
    if (producto) {
        titulo.innerText = 'Editar Producto';
        document.getElementById('productoId').value = producto.id;
        document.getElementById('productoNombre').value = producto.nombre;
        document.getElementById('productoPrecio').value = producto.precio;
        document.getElementById('productoCaracteristicas').value = producto.caracteristicas.join(', ');
        document.getElementById('productoStock').value = producto.stock;
    } else {
        titulo.innerText = 'Nuevo Producto';
        document.getElementById('formProducto').reset();
        document.getElementById('productoId').value = '';
    }
    
    modal.style.display = 'block';
}

function cerrarModalProducto() {
    document.getElementById('modalProducto').style.display = 'none';
}

document.getElementById('formProducto')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('productoId').value;
    const nombre = document.getElementById('productoNombre').value;
    const precio = parseFloat(document.getElementById('productoPrecio').value);
    const caracteristicas = document.getElementById('productoCaracteristicas').value.split(',').map(c => c.trim());
    const stock = parseInt(document.getElementById('productoStock').value);
    
    if (id) {
        const index = productos.findIndex(p => p.id == id);
        productos[index] = { ...productos[index], nombre, precio, caracteristicas, stock };
    } else {
        const nuevoId = Math.max(...productos.map(p => p.id), 0) + 1;
        productos.push({ id: nuevoId, nombre, precio, caracteristicas, stock });
    }
    
    guardarProductos();
    mostrarProductos();
    actualizarDashboard();
    cerrarModalProducto();
    alert('✅ Producto guardado correctamente');
});

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) abrirModalProducto(producto);
}

function eliminarProducto(id) {
    if (confirm('¿Eliminar este producto permanentemente?')) {
        productos = productos.filter(p => p.id !== id);
        guardarProductos();
        mostrarProductos();
        actualizarDashboard();
        alert('✅ Producto eliminado');
    }
}

function guardarConfiguracion() {
    configuracion = {
        whatsapp: document.getElementById('configWhatsapp').value,
        discord: document.getElementById('configDiscord').value,
        email: document.getElementById('configEmail').value
    };
    localStorage.setItem('koalaConfig', JSON.stringify(configuracion));
    alert('✅ Configuración guardada correctamente');
}

function mostrarSeccion(seccion) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active-section'));
    document.getElementById(seccion).classList.add('active-section');
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    const titulos = {
        dashboard: 'Dashboard',
        productos: 'Gestión de Productos',
        ventas: 'Todas las Ventas',
        configuracion: 'Configuración'
    };
    document.getElementById('seccionTitulo').innerText = titulos[seccion];
    
    if (seccion === 'ventas') mostrarVentas();
}

function cerrarSesion() {
    localStorage.removeItem('adminLogged');
    window.location.reload();
}

verificarAuth();
