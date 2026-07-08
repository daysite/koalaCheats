// ============================================
// CARRITO DE COMPRAS - KOALA CHEATS
// ============================================

let carrito = [];

// Productos por defecto
const productosPorDefecto = [
    { id: 1, nombre: "Panel Koala Lite", precio: 15, caracteristicas: ["Aim suave", "Ver paredes", "Sin anuncios"], stock: 999 },
    { id: 2, nombre: "Panel Koala Pro", precio: 25, caracteristicas: ["Aim profesional", "Magic Bullet", "Anti-Ban avanzado"], stock: 999 },
    { id: 3, nombre: "Panel Koala Ultra", precio: 35, caracteristicas: ["Todas las funciones Pro", "Soporte VIP", "Betas privadas"], stock: 999 }
];

// ============================================
// FUNCIONES DE PRODUCTOS
// ============================================

function cargarProductosDesdeAdmin() {
    let productos = JSON.parse(localStorage.getItem('koalaProductos'));
    if (!productos || productos.length === 0) {
        productos = productosPorDefecto;
        localStorage.setItem('koalaProductos', JSON.stringify(productos));
    }
    actualizarProductosEnDOM(productos);
}

function actualizarProductosEnDOM(productos) {
    const productosContainer = document.getElementById('productos');
    if (!productosContainer) return;
    
    productosContainer.innerHTML = '';
    
    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto';
        productoDiv.setAttribute('data-id', producto.id);
        
        let badgeHTML = '';
        if (producto.id === 1) badgeHTML = '<div class="producto-badge">MÁS VENDIDO</div>';
        if (producto.id === 2) badgeHTML = '<div class="producto-badge">PROMO</div>';
        
        const caracteristicasHTML = producto.caracteristicas.map(c => `<li>✅ ${c}</li>`).join('');
        
        productoDiv.innerHTML = `
            ${badgeHTML}
            <i class="fas fa-gamepad producto-icon"></i>
            <h3>🐨 ${producto.nombre}</h3>
            <p>Panel premium para Free Fire</p>
            <ul class="caracteristicas">
                ${caracteristicasHTML}
            </ul>
            <div class="precio">$${producto.precio.toFixed(2)} USD</div>
            <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">
                <i class="fas fa-cart-plus"></i> Agregar
            </button>
        `;
        
        productosContainer.appendChild(productoDiv);
    });
    
    iniciarAnimacionesProductos();
}

// ============================================
// FUNCIONES DEL CARRITO
// ============================================

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('koalaCarrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

function guardarCarrito() {
    localStorage.setItem('koalaCarrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }
}

function agregarAlCarrito(id, nombre, precio) {
    const existingItem = carrito.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.cantidad++;
        mostrarNotificacion(`${nombre} - Cantidad: ${existingItem.cantidad} ✅`);
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
        mostrarNotificacion(`${nombre} agregado al carrito ✅`);
    }
    
    guardarCarrito();
}

function mostrarNotificacion(mensaje) {
    const notificacionesAntiguas = document.querySelectorAll('.notificacion-flotante');
    notificacionesAntiguas.forEach(notif => notif.remove());
    
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-flotante';
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}

function mostrarCarrito() {
    const modal = document.getElementById('cartModal');
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    
    if (!cartItemsDiv) return;
    
    if (carrito.length === 0) {
        cartItemsDiv.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #666;"></i>
                <p style="margin-top: 1rem; color: #aaa;">🛒 El carrito está vacío</p>
                <button onclick="cerrarModalCarrito()" class="btn-primary" style="margin-top: 1rem;">Seguir comprando</button>
            </div>
        `;
        cartTotalSpan.textContent = '0.00';
    } else {
        cartItemsDiv.innerHTML = '';
        let total = 0;
        
        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <h4>🐨 ${item.nombre}</h4>
                    <p>$${item.precio.toFixed(2)} USD x ${item.cantidad}</p>
                    <small style="color: #10b981;">Subtotal: $${subtotal.toFixed(2)} USD</small>
                </div>
                <div class="cart-item-actions">
                    <button onclick="cambiarCantidad(${index}, ${item.cantidad - 1})" style="background:#2a2a35; padding:5px 10px;">-</button>
                    <span style="margin: 0 10px;">${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, ${item.cantidad + 1})" style="background:#2a2a35; padding:5px 10px;">+</button>
                    <button onclick="eliminarDelCarrito(${index})" style="background:#ef4444; padding:5px 10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });
        
        cartTotalSpan.textContent = total.toFixed(2);
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function cambiarCantidad(index, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(index);
    } else {
        carrito[index].cantidad = nuevaCantidad;
        guardarCarrito();
        mostrarCarrito();
    }
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
    mostrarNotificacion(`🗑️ Producto eliminado del carrito`);
}

function cerrarModalCarrito() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ============================================
// FUNCIONES DE PAGO
// ============================================

function generarMensajePedido() {
    if (carrito.length === 0) return "Hola! Quiero información sobre los paneles de Free Fire";
    
    let mensaje = "🐨 *PEDIDO KOALA CHEATS* 🐨\n\n";
    let total = 0;
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `📦 *${item.nombre}*\n`;
        mensaje += `   💰 $${item.precio.toFixed(2)} USD x ${item.cantidad} = $${subtotal.toFixed(2)} USD\n\n`;
    });
    
    mensaje += `━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `💰 *TOTAL: $${total.toFixed(2)} USD*\n\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `📝 *Mis datos:*\n`;
    mensaje += `🎮 ID Free Fire: _______\n`;
    mensaje += `📱 WhatsApp: _______\n\n`;
    mensaje += `🔒 *Pago por:* Mercado Pago / Transferencia / USDT\n`;
    mensaje += `⏰ *Entrega instantánea*`;
    
    return encodeURIComponent(mensaje);
}

function registrarVentaLocal(cliente, whatsapp, productos, total) {
    const ventas = JSON.parse(localStorage.getItem('koalaVentas') || '[]');
    const nuevaVenta = {
        id: ventas.length + 1,
        cliente: cliente,
        whatsapp: whatsapp,
        productos: productos.map(p => p.nombre),
        total: total,
        fecha: new Date().toISOString(),
        estado: 'pendiente'
    };
    ventas.push(nuevaVenta);
    localStorage.setItem('koalaVentas', JSON.stringify(ventas));
    
    carrito = [];
    guardarCarrito();
}

function procesarCompraWhatsApp() {
    if (carrito.length === 0) {
        mostrarNotificacion('❌ Tu carrito está vacío');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const config = JSON.parse(localStorage.getItem('koalaConfig') || '{}');
    const numeroWhatsApp = config.whatsapp || '1234567890';
    const mensaje = generarMensajePedido();
    
    const clienteNombre = prompt('📝 Ingresa tu nombre:', 'Cliente Koala');
    if (clienteNombre && clienteNombre !== 'Cliente Koala') {
        registrarVentaLocal(clienteNombre, numeroWhatsApp, carrito, total);
    }
    
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
    cerrarModalCarrito();
}

function procesarCompraDiscord() {
    if (carrito.length === 0) {
        mostrarNotificacion('❌ Tu carrito está vacío');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const mensaje = decodeURIComponent(generarMensajePedido());
    const config = JSON.parse(localStorage.getItem('koalaConfig') || '{}');
    const discordLink = config.discord || 'https://discord.gg/tu-invitacion';
    
    navigator.clipboard.writeText(mensaje).then(() => {
        alert(`✅ Mensaje copiado al portapapeles!\n\nEnvíalo al usuario @koala.cheats en Discord`);
    });
    
    const clienteNombre = prompt('📝 Ingresa tu nombre:', 'Cliente Koala');
    if (clienteNombre && clienteNombre !== 'Cliente Koala') {
        registrarVentaLocal(clienteNombre, 'Discord', carrito, total);
    }
    
    window.open(discordLink, '_blank');
    cerrarModalCarrito();
}

// ============================================
// ACTUALIZAR BOTONES DE CONTACTO
// ============================================

function actualizarBotonesContacto() {
    const config = JSON.parse(localStorage.getItem('koalaConfig') || '{}');
    
    // Botón WhatsApp del hero
    const heroWhatsApp = document.getElementById('heroWhatsAppBtn');
    if (heroWhatsApp) {
        heroWhatsApp.onclick = () => {
            const numero = config.whatsapp || '1234567890';
            window.open(`https://wa.me/${numero}?text=Hola!%20Quiero%20comprar%20un%20panel%20de%20Free%20Fire`, '_blank');
        };
    }
    
    // Botón Discord del hero
    const heroDiscord = document.getElementById('heroDiscordBtn');
    if (heroDiscord) {
        heroDiscord.onclick = () => {
            const link = config.discord || 'https://discord.gg/tu-invitacion';
            window.open(link, '_blank');
        };
    }
    
    // Links del footer
    const footerWhatsAppLink = document.getElementById('footerWhatsAppLink');
    if (footerWhatsAppLink) {
        footerWhatsAppLink.onclick = (e) => {
            e.preventDefault();
            const numero = config.whatsapp || '1234567890';
            window.open(`https://wa.me/${numero}?text=Hola!%20Quiero%20comprar%20un%20panel%20de%20Free%20Fire`, '_blank');
        };
    }
    
    const footerDiscordLink = document.getElementById('footerDiscordLink');
    if (footerDiscordLink) {
        footerDiscordLink.onclick = (e) => {
            e.preventDefault();
            const link = config.discord || 'https://discord.gg/tu-invitacion';
           
