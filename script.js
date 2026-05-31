// ============================================
// CARRITO DE COMPRAS - KOALA CHEATS
// ============================================

let carrito = [];

// Cargar productos desde localStorage (para sincronizar con admin)
function cargarProductosDesdeAdmin() {
    const productosGuardados = localStorage.getItem('koalaProductos');
    if (productosGuardados) {
        const productos = JSON.parse(productosGuardados);
        actualizarProductosEnDOM(productos);
    }
}

// Actualizar los productos mostrados en la tienda
function actualizarProductosEnDOM(productos) {
    const productosContainer = document.getElementById('productos');
    if (!productosContainer) return;
    
    productosContainer.innerHTML = '';
    
    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto';
        productoDiv.setAttribute('data-id', producto.id);
        productoDiv.setAttribute('data-name', producto.nombre);
        productoDiv.setAttribute('data-price', producto.precio);
        
        // Generar HTML del producto
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
    
    // Reiniciar animaciones para los nuevos productos
    iniciarAnimacionesProductos();
}

// Cargar carrito del localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('koalaCarrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('koalaCarrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Actualizar contador del carrito en el header
function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        
        // Animación de rebote cuando se agrega algo
        cartCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }
}

// Agregar producto al carrito
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
    
    // Reproducir sonido de carrito (opcional - descomentar si quieres)
    // const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
    // audio.play();
}

// Mostrar notificación flotante
function mostrarNotificacion(mensaje) {
    // Eliminar notificaciones anteriores
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

// Mostrar carrito modal
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
            itemDiv.style.animation = `fadeIn 0.3s ease ${index * 0.1}s`;
            itemDiv.style.animationFillMode = 'backwards';
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <h4>🐨 ${item.nombre}</h4>
                    <p>$${item.precio.toFixed(2)} USD x ${item.cantidad}</p>
                    <small style="color: #10b981;">Subtotal: $${subtotal.toFixed(2)} USD</small>
                </div>
                <div class="cart-item-actions">
                    <button onclick="cambiarCantidad(${index}, ${item.cantidad - 1})" class="btn-cantidad">-</button>
                    <span style="margin: 0 10px;">${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, ${item.cantidad + 1})" class="btn-cantidad">+</button>
                    <button onclick="eliminarDelCarrito(${index})" class="btn-eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });
        
        cartTotalSpan.textContent = total.toFixed(2);
        
        // Mostrar opción de vaciar carrito si hay productos
        if (carrito.length > 0) {
            const vaciarBtn = document.createElement('button');
            vaciarBtn.textContent = 'Vaciar carrito';
            vaciarBtn.className = 'btn-vaciar';
            vaciarBtn.onclick = vaciarCarrito;
            cartItemsDiv.parentNode.insertBefore(vaciarBtn, cartItemsDiv.nextSibling);
        }
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cambiar cantidad de un producto
function cambiarCantidad(index, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(index);
    } else {
        carrito[index].cantidad = nuevaCantidad;
        guardarCarrito();
        mostrarCarrito(); // Refrescar modal
    }
}

// Eliminar item del carrito
function eliminarDelCarrito(index) {
    const productoEliminado = carrito[index].nombre;
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito(); // Refrescar modal
    mostrarNotificacion(`🗑️ ${productoEliminado} eliminado del carrito`);
}

// Vaciar carrito completo
function vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        carrito = [];
        guardarCarrito();
        mostrarCarrito();
        mostrarNotificacion('🛒 Carrito vaciado completamente');
    }
}

// Cerrar modal del carrito
function cerrarModalCarrito() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Generar mensaje para WhatsApp con los productos
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
    mensaje += `📱 WhatsApp: _______\n`;
    mensaje += `✉️ Email: _______\n\n`;
    mensaje += `🔒 *Pago seguro por:*\n`;
    mensaje += `- Mercado Pago\n`;
    mensaje += `- Transferencia bancaria\n`;
    mensaje += `- USDT (Binance)\n\n`;
    mensaje += `⏰ *Entrega instantánea después del pago*`;
    
    return encodeURIComponent(mensaje);
}

// Registrar venta en el panel de admin
function registrarVentaEnAdmin(cliente, whatsapp, productos, total) {
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
    
    // Limpiar carrito
    carrito = [];
    guardarCarrito();
    actualizarContadorCarrito();
}

// Procesar compra por WhatsApp
function procesarCompraWhatsApp() {
    if (carrito.length === 0) {
        mostrarNotificacion('❌ Tu carrito está vacío. Agrega productos primero.');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const productosLista = carrito.map(item => item.nombre).join(', ');
    
    // Obtener configuración guardada
    const config = JSON.parse(localStorage.getItem('koalaConfig') || '{}');
    const numeroWhatsApp = config.whatsapp || '1234567890';
    
    const mensaje = generarMensajePedido();
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    
    // Registrar venta pendiente
    const clienteNombre = prompt('📝 Por favor, ingresa tu nombre para registrar tu pedido:', 'Cliente Koala');
    if (clienteNombre && clienteNombre !== 'Cliente Koala') {
        registrarVentaEnAdmin(clienteNombre, numeroWhatsApp, carrito, total);
    }
    
    window.open(url, '_blank');
    cerrarModalCarrito();
}

// Procesar compra por Discord
function procesarCompraDiscord() {
    if (carrito.length === 0) {
        mostrarNotificacion('❌ Tu carrito está vacío. Agrega productos primero.');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const mensaje = decodeURIComponent(generarMensajePedido());
    
    // Obtener configuración
    const config = JSON.parse(localStorage.getItem('koalaConfig') || '{}');
    const discordLink = config.discord || 'https://discord.gg/tu-invitacion';
    
    // Copiar mensaje al portapapeles
    navigator.clipboard.writeText(mensaje).then(() => {
        alert(`✅ Mensaje copiado al portapapeles!\n\nEnvíalo al usuario @koala.cheats en Discord\n\n${mensaje}`);
    }).catch(() => {
        alert(`📋 Copia este mensaje manualmente:\n\n${mensaje}\n\nEnvíalo al usuario @koala.cheats en Discord`);
    });
    
    // Registrar venta pendiente
    const clienteNombre = prompt('📝 Por favor, ingresa tu nombre para registrar tu pedido:', 'Cliente Koala');
    if (clienteNombre && clienteNombre !== 'Cliente Koala') {
        registrarVentaEnAdmin(clienteNombre, 'Discord', carrito, total);
    }
    
    window.open(discordLink, '_blank');
    cerrarModalCarrito();
}

// Iniciar animaciones de productos
function iniciarAnimacionesProductos() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.producto').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });
}

// Scroll suave al catálogo
function scrollToCatalogo() {
    const catalogoSection = document.getElementById('catalogo');
    if (catalogoSection) {
        catalogoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Cargar configuración de contacto
function cargarConfiguracionContacto() {
    const config = JSON.parse(localStorage.getItem('koalaConfig') || '{}');
    
    // Actualizar botones de WhatsApp si existe configuración
    const botonesWA = document.querySelectorAll('.btn-whatsapp, [onclick*="WhatsApp"]');
    botonesWA.forEach(boton => {
        if (config.whatsapp) {
            // No reemplazamos el onclick, solo actualizamos si es necesario
        }
    });
}

// ============================================
// EVENTOS E INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Cargar productos desde el panel admin
    cargarProductosDesdeAdmin();
    
    // Cargar carrito guardado
    cargarCarrito();
    
    // Cargar configuración de contacto
    cargarConfiguracionContacto();
    
    // Abrir modal del carrito
    const openCartBtn = document.getElementById('openCartBtn');
    if (openCartBtn) {
        openCartBtn.onclick = (e) => {
            e.preventDefault();
            mostrarCarrito();
        };
    }
    
    // Cerrar modal
    const modal = document.getElementById('cartModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.onclick = () => {
            cerrarModalCarrito();
        };
    }
    
    // Cerrar modal al hacer clic fuera
    window.onclick = (event) => {
        if (event.target === modal) {
            cerrarModalCarrito();
        }
    };
    
    // Checkout por WhatsApp
    const checkoutWA = document.getElementById('checkoutWhatsApp');
    if (checkoutWA) {
        checkoutWA.onclick = procesarCompraWhatsApp;
    }
    
    // Checkout por Discord
    const checkoutDC = document.getElementById('checkoutDiscord');
    if (checkoutDC) {
        checkoutDC.onclick = procesarCompraDiscord;
    }
    
    // Agregar estilos CSS adicionales para animaciones y botones
    agregarEstilosAdicionales();
});

// Agregar estilos CSS necesarios
function agregarEstilosAdicionales() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .btn-cantidad {
            background: #2a2a35;
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
        }
        
        .btn-cantidad:hover {
            background: #10b981;
        }
        
        .btn-eliminar {
            background: #ef4444;
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 10px;
            transition: all 0.2s;
        }
        
        .btn-eliminar:hover {
            background: #dc2626;
            transform: scale(1.05);
        }
        
        .btn-vaciar {
            background: transparent;
            border: 1px solid #ef4444;
            color: #ef4444;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            margin: 1rem 0;
            width: 100%;
            transition: all 0.2s;
        }
        
        .btn-vaciar:hover {
            background: #ef4444;
            color: white;
        }
        
        .cart-item {
            transition: all 0.3s ease;
        }
        
        .cart-item:hover {
            background: rgba(16, 185, 129, 0.05);
            transform: translateX(5px);
        }
        
        #cart-count {
            transition: transform 0.2s ease;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);
}

// Exportar funciones para uso global
window.agregarAlCarrito = agregarAlCarrito;
window.mostrarCarrito = mostrarCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.vaciarCarrito = vaciarCarrito;
window.cambiarCantidad = cambiarCantidad;
window.scrollToCatalogo = scrollToCatalogo;
window.cerrarModalCarrito = cerrarModalCarrito;
window.procesarCompraWhatsApp = procesarCompraWhatsApp;
window.procesarCompraDiscord = procesarCompraDiscord;
