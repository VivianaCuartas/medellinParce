// Datos iniciales del carrito
let carrito = [];

// Cargar carrito desde localStorage
function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    carrito = JSON.parse(savedCart);
    renderCarrito();
  }
}

// Configuración de impuestos y descuentos
const DESCUENTO = 0.20; 
const IVA = 0.19;

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
function cargarDatosCliente() {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuarioActivo) {
    document.getElementById("cliente-info").innerHTML = `
      <h3>👨🏻 Información del cliente</h3>
      <p><em>No se encontró usuario activo</em></p>
    `;
    return;
  }

  document.getElementById("cliente-info").innerHTML = `
    <h3>👨🏻 Información del cliente</h3>
    <p><strong>Nombre:</strong> ${usuarioActivo.fullname}</p>
    <p><strong>Documento:</strong> ${usuarioActivo.documento}</p>
    <p><strong>Email:</strong> ${usuarioActivo.email}</p>
    <p><strong>Teléfono:</strong> ${usuarioActivo.telefono}</p>
  `;
}

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", () => {
  cargarDatosCliente();
  loadCart(); // tu función para cargar carrito
});

function showToast(mensaje) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = mensaje;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Cambiar cantidad
function cambiarCantidad(index, valor) {
  carrito[index].quantity += valor;
  if (carrito[index].quantity <= 0) carrito[index].quantity = 1;
  saveCart();
  renderCarrito();
}

// Eliminar producto
function eliminarProducto(index) {
  carrito.splice(index, 1);
  saveCart();
  renderCarrito();
}

// Calcular totales
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

// Delegación de eventos (+, -, eliminar)
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

// Guardar carrito actualizado
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(carrito));
}

// Finalizar compra
document.getElementById("btn-finalizar").addEventListener("click", () => {
  if (carrito.length === 0) {
    showToast("⚠️ El carrito está vacío.");
    return;
  }
  const cliente = JSON.parse(localStorage.getItem("usuarioActivo"));


  showToast(`✅ Orden confirmada. $${document.getElementById("total-pagar").textContent}`);
  carrito = [];
  saveCart();
  renderCarrito();
});

// Inicializar
document.addEventListener("DOMContentLoaded", loadCart);
