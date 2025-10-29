// ============================================
// CONFIGURACIÓN INICIAL
// ============================================
const DESCUENTO = 0.20; 
const IVA = 0.19;
let carrito = [];
let numeroOrdenActual = null; // Guardar el número de orden de esta sesión

// ============================================
// FUNCIONES AUXILIARES
// ============================================

// Obtener el número de orden actual SIN incrementar
function obtenerNumeroOrdenActual() {
  if (numeroOrdenActual === null) {
    numeroOrdenActual = (parseInt(localStorage.getItem("ultimoNumeroOrden")) || 0) + 1;
  }
  return numeroOrdenActual;
}

// Incrementar y guardar el número de orden (solo al confirmar)
function confirmarNumeroOrden() {
  const nuevoNumero = obtenerNumeroOrdenActual();
  localStorage.setItem("ultimoNumeroOrden", nuevoNumero);
  return nuevoNumero;
}

// Obtener fecha actual formateada
function obtenerFechaActual() {
  const ahora = new Date();
  const opciones = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
  };
  return ahora.toLocaleDateString('es-ES', opciones);
}

// Mostrar notificaciones toast
function showToast(mensaje) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = mensaje;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ============================================
// GESTIÓN DEL CARRITO
// ============================================

// Cargar carrito desde localStorage
function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    carrito = JSON.parse(savedCart);
    renderCarrito();
  }
}

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(carrito));
}

// Renderizar carrito en la tabla
function renderCarrito() {
  const tbody = document.getElementById("lista-productos");
  tbody.innerHTML = "";

  carrito.forEach((prod, index) => {
    const subtotal = prod.price * prod.quantity;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${prod.name}</td>
      <td>$${prod.price.toLocaleString()}</td>
      <td>
        <button class="btn-cantidad" data-index="${index}" data-valor="-1">-</button>
        ${prod.quantity}
        <button class="btn-cantidad" data-index="${index}" data-valor="1">+</button>
      </td>
      <td>$${subtotal.toLocaleString()}</td>
      <td><button class="btn-eliminar" data-index="${index}">🗑</button></td>
    `;
    tbody.appendChild(fila);
  });

  calcularTotales();
}

// Cambiar cantidad de un producto
function cambiarCantidad(index, valor) {
  carrito[index].quantity += valor;
  if (carrito[index].quantity <= 0) carrito[index].quantity = 1;
  saveCart();
  renderCarrito();
}

// Eliminar producto del carrito
function eliminarProducto(index) {
  carrito.splice(index, 1);
  saveCart();
  renderCarrito();
}

// Calcular totales (subtotal, descuento, IVA, total)
function calcularTotales() {
  const subtotal = carrito.reduce((acc, prod) => acc + prod.price * prod.quantity, 0);
  const descuento = subtotal * DESCUENTO;
  const iva = (subtotal - descuento) * IVA;
  const total = subtotal - descuento + iva;

  document.getElementById("totales").innerHTML = `
    <p><strong>Subtotal:</strong> $${subtotal.toLocaleString()}</p>
    <p><strong>Descuento (20%):</strong> -$${descuento.toLocaleString()}</p>
    <p><strong>IVA (19%):</strong> $${iva.toLocaleString()}</p>
    <h3 id="total-pagar">TOTAL A PAGAR: $${total.toLocaleString()}</h3>
  `;
}

// ============================================
// DATOS DEL CLIENTE Y FACTURA
// ============================================

function cargarDatosCliente() {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  
  // Obtener número de orden SIN incrementar
  const numeroOrden = obtenerNumeroOrdenActual();
  const fechaOrden = obtenerFechaActual();
  
  // Actualizar número de factura
  document.getElementById("numero-factura").textContent = `#Factura ${numeroOrden}`;
  
  // Agregar o actualizar la fecha
  let fechaElement = document.getElementById("fecha-factura");
  if (!fechaElement) {
    fechaElement = document.createElement("p");
    fechaElement.id = "fecha-factura";
    fechaElement.style.textAlign = "center";
    fechaElement.style.marginBottom = "20px";
    fechaElement.style.color = "#000";
    document.getElementById("numero-factura").after(fechaElement);
  }
  fechaElement.textContent = `${fechaOrden}`;
  
  // Mostrar información del cliente
  if (!usuarioActivo) {
    document.getElementById("cliente-info").innerHTML = `
      <h3>👨🏻 Información del cliente</h3>
      <p><em>No se encontró usuario activo</em></p>
      <p>Para finalizar la compra <strong>regístrate</strong> o <strong>inicia sesión</strong>:</p>
      <p><a href="../formularioRegistro/registro.html">Regístrate</a> o <a href="../inicioSesion/index.html">Inicia sesión</a></p>
    `;
    return;
  }

  document.getElementById("cliente-info").innerHTML = `
    <h3>👨🏻 Información del cliente</h3>
    <p><strong>Nombre:</strong> ${usuarioActivo.fullname}</p>
    <p><strong>Email:</strong> ${usuarioActivo.email}</p>
  `;
}

// ============================================
// EVENT LISTENERS
// ============================================

// Delegación de eventos para botones de cantidad y eliminar
document.getElementById("lista-productos").addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-cantidad")) {
    const index = parseInt(e.target.dataset.index);
    const valor = parseInt(e.target.dataset.valor);
    cambiarCantidad(index, valor);
  }

  if (e.target.classList.contains("btn-eliminar")) {
    const index = parseInt(e.target.dataset.index);
    eliminarProducto(index);
  }
});

// Finalizar compra
document.getElementById("btn-finalizar").addEventListener("click", () => {
  if (carrito.length === 0) {
    showToast("⚠️ El carrito está vacío.");
    return;
  }
  
  const cliente = JSON.parse(localStorage.getItem("usuarioActivo"));

  // Verificar que exista sesión activa antes de permitir finalizar
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn || !cliente) {
    showToast('Registrate o inicia sesión para finalizar la compra');
    const clienteInfo = document.getElementById('cliente-info');
    if (clienteInfo && !clienteInfo.innerHTML.includes('Regístrate')) {
      clienteInfo.innerHTML += `<p><a href="../formularioRegistro/registro.html">Regístrate</a> o <a href="../inicioSesion/index.html">Inicia sesión</a> para finalizar la compra.</p>`;
    }
    return; // Bloquear la finalización si no está autenticado
  }

  // AQUÍ se confirma e incrementa el número de orden
  const numeroOrden = confirmarNumeroOrden();
  
  // Convertir productos del carrito al formato de la clase Orden
  const productosOrden = carrito.map((prod, index) => ({
    id: index,
    nombre: prod.name,
    precio: prod.price,
    cantidad: prod.quantity
  }));
  
  // Crear y guardar la orden
  const orden = new Orden(numeroOrden, cliente, productosOrden);
  
  if (orden.generarOrden()) {
    const total = orden.total.toLocaleString();
    showToast(`✅ Orden #${numeroOrden} confirmada. Total: $${total}`);
    
    // Limpiar carrito
    carrito = [];
    saveCart();
    renderCarrito();
    
    // Resetear el número de orden para la siguiente
    numeroOrdenActual = null;
    
    // Opcional: Redirigir después de 2 segundos
    setTimeout(() => window.location.href = "../paginaPrincipal/home.html", 3000);
  } else {
    showToast("❌ Error al guardar la orden");
  }
});

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  cargarDatosCliente();
  loadCart();
});