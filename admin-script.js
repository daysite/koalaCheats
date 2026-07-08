// ============================================
// ADMIN SCRIPT - KOALA CHEATS
// ============================================

let productos = [];
let ventas = [];
let configuracion = {};

// ============================================
// AUTENTICACIÓN ADMIN
// ============================================

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

// ============================================
// CARGA DE DATOS
// ============================================

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
        ventas = [];
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
    cargarUsuariosFirebase();
}

// ============================================
// GUARDAR DATOS (LOCAL)
// ============================================

function guardarProductos() {
    localStorage.setItem('koalaProductos', JSON.stringify(productos));
}

function guardarVentas() {
    localStorage.setItem('koalaVentas', JSON.stringify(ventas));
}

// ============================================
// DASHBOARD
// ============================================

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

// ============================================
// GESTIÓN DE PRODUCTOS (CRUD)
// ============================================

function mostrarProductos() {
    const tbody = document.getElementById('productosBody');
    if (!tbody) return;
    
    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No hay productos registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = productos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>$${p.precio}</td>
            <td>${p.caracteristicas.slice(0, 2).join(', ')}...</td>
            <td>${p.stock}</td>
            <td>
                <button class="btn-edit" onclick="editarProducto(${p.id
