// Sistema de autenticación simple
let usuarios = [];
let productos = [];
let ventas = [];
let configuracion = {};

// Verificar si está logueado
function verificarAuth() {
    const logged = localStorage.getItem('adminLogged');
    if (!logged && !window.location.pathname.includes('login.html')) {
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

// Cargar datos iniciales
function cargarDatos() {
    // Cargar productos
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
    
    // Cargar ventas
    const ventasGuardadas = localStorage.getItem('koalaVentas');
    if (ventasGuardadas) {
        ventas = JSON.parse(ventasGuardadas);
    } else {
        ventas = [
            { id: 1, cliente: "Juan Pérez", whatsapp: "+123456789", productos: ["Panel Koala Pro"], total: 25, fecha: new Date().toISOString(), estado: "completado" }
        ];
        guardarVentas();
    }
    
    // Cargar configuración
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

// Guardar datos
function guardarProductos() {
    localStorage.setItem('koalaProductos', JSON.stringify(productos));
}

function guardarVentas() {
    localStorage.setItem('koalaVentas', JSON.stringify(ventas));
}

// Actualizar Dashboard
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
    
    // Ventas recientes
    const recientes = [...ventas].reverse().slice(0, 5);
    const tbody = document.getElementById('ventasRecientesBody');
    if (tbody) {
        tbody.innerHTML = recientes.map(v => `
            <tr>
                <td>#${v.id}</td>
                <td>${v.cliente}</td>
                <td>${v.productos.join(', ')}</td>
                <td>$${v.total}</td>
                <td>${new Date(v.fecha).toLocaleDateString()}</td>
                <td><span class="estado-${v.estado}">${v.estado}</span></td>
            </tr>
        `).join('');
    }
}

// Mostrar productos en tabla
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

// CRUD Productos
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
        // Editar
        const index = productos.findIndex(p => p.id == id);
        productos[index] = { ...productos[index], nombre, precio, caracteristicas, stock };
    } else {
        // Nuevo
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

// Mostrar ventas
function mostrarVentas() {
    const tbody = document.getElementById('ventasBody');
    if (!tbody) return;
    
    tbody.innerHTML = ventas.map(v => `
        <tr>
            <td>#${v.id}</td>
            <td>${v.cliente}</td>
            <td>${v.whatsapp}</td>
            <td>${v.productos.join(', ')}</td>
            <td>$${v.total}</td>
            <td>${new Date(v.fecha).toLocaleString()}</td>
            <td>
                <select onchange="cambiarEstadoVenta(${v.id}, this.value)">
                    <option value="completado" ${v.estado === 'completado' ? 'selected' : ''}>Completado</option>
                    <option value="pendiente" ${v.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
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
        alert(`Detalle de Venta #${id}\nCliente: ${venta.cliente}\nWhatsApp: ${venta.whatsapp}\nProductos: ${venta.productos.join(', ')}\nTotal: $${venta.total}\nFecha: ${new Date(venta.fecha).toLocaleString()}\nEstado: ${venta.estado}`);
    }
}

// Filtros
function filtrarVentas() {
    const busqueda = document.getElementById('buscarVenta')?.value.toLowerCase() || '';
    const estado = document.getElementById('filtroEstado')?.value || 'todos';
    
    const ventasFiltradas = ventas.filter(v => {
        const matchBusqueda = v.cliente.toLowerCase().includes(busqueda) || v.whatsapp.includes(busqueda);
        const matchEstado = estado === 'todos' || v.estado === estado;
        return matchBusqueda && matchEstado;
    });
    
    const tbody = document.getElementById('ventasBody');
    if (tbody) {
        tbody.innerHTML = ventasFiltradas.map(v => `
            <tr>
                <td>#${v.id}</td>
                <td>${v.cliente}</td>
                <td>${v.whatsapp}</td>
                <td>${v.productos.join(', ')}</td>
                <td>$${v.total}</td>
                <td>${new Date(v.fecha).toLocaleString()}</td>
                <td><span class="estado-${v.estado}">${v.estado}</span></td>
                <td><button class="btn-view" onclick="verDetalleVenta(${v.id})">Ver</button></td>
            </tr>
        `).join('');
    }
}

// Configuración
function guardarConfiguracion() {
    configuracion = {
        whatsapp: document.getElementById('configWhatsapp').value,
        discord: document.getElementById('configDiscord').value,
        email: document.getElementById('configEmail').value
    };
    localStorage.setItem('koalaConfig', JSON.stringify(configuracion));
    alert('✅ Configuración guardada correctamente');
}

// Cambiar secciones
function mostrarSeccion(seccion) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active-section'));
    document.getElementById(seccion).classList.add('active-section');
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    document.getElementById('seccionTitulo').innerText = 
        seccion === 'dashboard' ? 'Dashboard' :
        seccion === 'productos' ? 'Gestión de Productos' :
        seccion === 'ventas' ? 'Todas las Ventas' :
        seccion === 'usuarios' ? 'Usuarios Administradores' : 'Configuración';
    
    if (seccion === 'ventas') mostrarVentas();
}

function cerrarSesion() {
    localStorage.removeItem('adminLogged');
    window.location.reload();
}

// Inicializar
verificarAuth();

// Agregar CSS para estados
const style = document.createElement('style');
style.textContent = `
    .estado-completado { color: #10b981; font-weight: bold; }
    .estado-pendiente { color: #f59e0b; font-weight: bold; }
    .estado-cancelado { color: #ef4444; font-weight: bold; }
`;
document.head.appendChild(style);
