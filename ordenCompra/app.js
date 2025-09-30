
// Datos iniciales del carrito
let carrito = [
  { id: 1, nombre: "Camisa Mujer", precio: 10000, cantidad: 1 },
  { id: 2, nombre: "Camisa Hombre", precio: 44000, cantidad: 4 }
];

// Configuración de impuestos y descuentos
const DESCUENTO = 0.20; 
const IVA = 0.19;

// Renderizar carrito en la tabla
function renderCarrito() {
  const tbody = document.getElementById("lista-productos");
  tbody.innerHTML = "";

  carrito.forEach((prod, index) => {
    const subtotal = prod.precio * prod.cantidad;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${prod.nombre}</td>
      <td>$${prod.precio.toLocaleString()}</td>
      <td>
        <button class="btn-cantidad" data-index="${index}" data-valor="-1">-</button>
        ${prod.cantidad}
        <button class="btn-cantidad" data-index="${index}" data-valor="1">+</button>
      </td>
      <td>$${subtotal.toLocaleString()}</td>
      <td><button class="btn-eliminar" data-index="${index}">🗑</button></td>
    `;
    tbody.appendChild(fila);
  });

  calcularTotales();
}

function showToast(mensaje) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = mensaje;

  container.appendChild(toast);

  // eliminar el toast después de 4s (cuando termina la animación)
  setTimeout(() => {
    toast.remove();
  }, 4000);
}


// Cambiar cantidad
function cambiarCantidad(index, valor) {
  carrito[index].cantidad += valor;
  if (carrito[index].cantidad <= 0) carrito[index].cantidad = 1;
  renderCarrito();
}

// Eliminar producto
function eliminarProducto(index) {
  carrito.splice(index, 1);
  renderCarrito();
}

// Calcular totales
function calcularTotales() {
  const subtotal = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
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

// Event Delegation para botones (+, -, eliminar)
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

// Finalizar compra usando la clase Orden
document.getElementById("btn-finalizar").addEventListener("click", () => {
  if (carrito.length === 0) {
    showToast("⚠️ El carrito está vacío.");
    return;
  }

  // Simulamos un cliente
  const cliente = {
    nombre: "Juan Pérez",
    documento: "123456789",
    email: "juanperez@mail.com",
    telefono: "3012345678"
  };

  // Creamos la orden usando la clase Orden (orden.js)
  const numeroOrden = Date.now();
  const orden = new Orden(numeroOrden, cliente, carrito);

  orden.generarOrden(); // guarda en localStorage

  const resumen = orden.mostrarResumen();
  showToast(`✅ Orden #${resumen.numeroOrden} confirmada. Total: $${resumen.total.toLocaleString()}`);

  carrito = []; // reiniciamos carrito
  renderCarrito();
});