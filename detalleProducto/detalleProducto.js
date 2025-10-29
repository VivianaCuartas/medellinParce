// ============================================
// VARIABLES GLOBALES
// ============================================
let productoActual = null;
let carrito = [];

// ============================================
// FUNCIONES PARA CANTIDAD
// ============================================
function aumentarCantidad() {
    const input = document.getElementById('quantityInput');
    let cantidad = parseInt(input.value);
    
    if (cantidad < 10) {
        input.value = cantidad + 1;
    }
}

function disminuirCantidad() {
    const input = document.getElementById('quantityInput');
    let cantidad = parseInt(input.value);
    
    if (cantidad > 1) {
        input.value = cantidad - 1;
    }
}

function obtenerCantidad() {
    const input = document.getElementById('quantityInput');
    return parseInt(input.value);
}

// ============================================
// FUNCIONES PARA OBTENER SELECCIONES
// ============================================
function obtenerTallaSeleccionada() {
    const botonActivo = document.querySelector('.size-btn.active');
    return botonActivo ? botonActivo.textContent : null;
}

function obtenerColorSeleccionado() {
    const circuloActivo = document.querySelector('.color-circle.active');
    if (circuloActivo) {
        const colorOption = circuloActivo.parentElement;
        const nombreColor = colorOption.querySelector('.color-name');
        return nombreColor.textContent;
    }
    return null;
}

// ============================================
// FUNCIÓN PARA AGREGAR AL CARRITO
// ============================================
function agregarAlCarrito() {
    const talla = obtenerTallaSeleccionada();
    const color = obtenerColorSeleccionado();
    const cantidad = obtenerCantidad();
    
    if (!talla || !color) {
        mostrarMensaje('Por favor selecciona talla y color', 'error');
        return;
    }
    
    if (!productoActual) {
        mostrarMensaje('Error: No hay producto seleccionado', 'error');
        return;
    }
    
    // Crear el nombre del producto con talla y color
    const nombreCompleto = `${productoActual.nombre} - Talla: ${talla} - Color: ${color}`;
    
    // Usar la función addToCart del cart.js existente
    if (typeof addToCart === 'function') {
        addToCart(nombreCompleto, productoActual.precio, cantidad);
        mostrarMensaje(`✓ Producto agregado al carrito`, 'success');
        console.log('Producto agregado:', nombreCompleto);
    } else {
        console.error('❌ La función addToCart no está disponible');
        mostrarMensaje('Error al agregar al carrito', 'error');
    }
}

// ============================================
// FUNCIÓN PARA MOSTRAR MENSAJES
// ============================================
function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('message');
    mensaje.textContent = texto;
    mensaje.className = `message ${tipo} show`;
    
    setTimeout(function() {
        mensaje.classList.remove('show');
    }, 3000);
}

// ============================================
// CONFIGURAR EVENTOS
// ============================================
function configurarEventos() {
    document.getElementById('decreaseBtn').addEventListener('click', disminuirCantidad);
    document.getElementById('increaseBtn').addEventListener('click', aumentarCantidad);
    document.getElementById('addToCartBtn').addEventListener('click', agregarAlCarrito);
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Cargar el producto seleccionado desde localStorage
    productoActual = Producto.cargarDeDetalle();
    
    if (productoActual) {
        // Mostrar los detalles del producto
        productoActual.mostrarDetalles();
        
        // Configurar eventos de botones
        configurarEventos();
        
        console.log('Producto cargado:', productoActual.nombre);
    } else {
        // Si no hay producto seleccionado, mostrar error
        document.querySelector('.container').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>No hay producto seleccionado</h2>
                <p>Por favor, selecciona un producto desde el catálogo.</p>
                <a href="./categoria.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                    Volver al catálogo
                </a>
            </div>
        `;
        console.error('No se encontró producto seleccionado');
    }
});