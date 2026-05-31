// Carrito de compras
let carrito = [];

// Cargar carrito del localStorage al iniciar
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
    }
}

// Agregar producto al carrito
function agregarAlCarrito(id, nombre, precio) {
    const existingItem = carrito.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.cantidad++;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    mostrarNotificacion(`${nombre} agregado al carrito ✅`);
}

// Mostrar notificación flotante
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Mostrar carrito modal
function mostrarCarrito() {
    const modal = document.getElementById('cartModal');
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    
    if (!cartItemsDiv) return;
    
    if (carrito.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; padding: 2rem;">🛒 El carrito está vacío</p>';
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
                    <p>$${item.precio} USD x ${item.cantidad}</p>
                    <small>Subtotal: $${subtotal} USD</small>
                </div>
                <div class="cart-item-actions">
                    <button onclick="eliminarDelCarrito(${index})">🗑️</button>
                </div>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });
        
        cartTotalSpan.textContent = total.toFixed(2);
    }
    
    modal.style.display = 'block';
}

// Eliminar item del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito(); // Refrescar modal
}

// Vaciar carrito (opcional)
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
}

// Generar mensaje para WhatsApp con los productos
function generarMensajePedido() {
    if (carrito.length === 0) return "Hola! Quiero información sobre los paneles de Free Fire";
    
    let mensaje = "Hola! Quiero comprar estos productos:\n\n";
    let total = 0;
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `🐨 ${item.nombre} - $${item.precio} USD x ${item.cantidad} = $${subtotal} USD\n`;
    });
    
    mensaje += `\n💰 TOTAL: $${total} USD\n`;
    mensaje += `\nMi usuario de Free Fire es: _______\n`;
    mensaje += `📱 Mi número de WhatsApp es: _______\n`;
    
    return encodeURIComponent(mensaje);
}

// Configurar eventos
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    
    // Abrir modal del carrito
    const openCartBtn = document.getElementById('openCartBtn');
    if (openCartBtn) {
        openCartBtn.onclick = mostrarCarrito;
    }
    
    // Cerrar modal
    const modal = document.getElementById('cartModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Checkout por WhatsApp
    const checkoutWA = document.getElementById('checkoutWhatsApp');
    if (checkoutWA) {
        checkoutWA.onclick = () => {
            if (carrito.length === 0) {
                alert('❌ Tu carrito está vacío. Agrega productos primero.');
                return;
            }
            const mensaje = generarMensajePedido();
            window.open(`https://wa.me/1234567890?text=${mensaje}`, '_blank');
        };
    }
    
    // Checkout por Discord (copia enlace de invitación)
    const checkoutDC = document.getElementById('checkoutDiscord');
    if (checkoutDC) {
        checkoutDC.onclick = () => {
            if (carrito.length === 0) {
                alert('❌ Tu carrito está vacío. Agrega productos primero.');
                return;
            }
            const mensaje = generarMensajePedido();
            alert(`📋 Copia este mensaje y pégalo en Discord:\n\n${decodeURIComponent(mensaje)}\n\nEnvíalo al usuario: @koala.cheats`);
            window.open('https://discord.gg/tu-invitacion', '_blank');
        };
    }
});

// Scroll al catálogo
function scrollToCatalogo() {
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}

// Animación de entrada para los productos
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
