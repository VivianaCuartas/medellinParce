// Datos iniciales del carrito (pueden venir de localStorage en el futuro)
let carrito = [
  { id: 1, nombre: "Camisa Mujer", precio: 10000, cantidad: 1 },
  { id: 2, nombre: "Camisa Hombre", precio: 44000, cantidad: 4 }
];

// Configuración de impuestos y descuentos
const DESCUENTO = 0.20; // 20%
const IVA = 0.19;       // 19%

// Función para renderizar el carrito en la tabla
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
        <button class="cantidad-btn" onclick="cambiarCantidad(${index}, -1)">-</button>
        ${prod.cantidad}
        <button class="cantidad-btn" onclick="cambiarCantidad(${index}, 1)">+</button>
      </td>
      <td>$${subtotal.toLocaleString()}</td>
      <td><button class="eliminar" onclick="eliminarProducto(${index})">🗑</button></td>
    `;
    tbody.appendChild(fila);
  });

  calcularTotales();
}

// Función para cambiar la cantidad
function cambiarCantidad(index, valor) {
  carrito[index].cantidad += valor;
  if (carrito[index].cantidad <= 0) {
    carrito[index].cantidad = 1; // No permitir cantidad 0 o negativa
  }
  renderCarrito();
}

// Función para eliminar un producto
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

  document.querySelector(".totales").innerHTML = `
    <p><strong>Subtotal:</strong> $${subtotal.toLocaleString()}</p>
    <p><strong>Descuento (20%):</strong> -$${descuento.toLocaleString()}</p>
    <p><strong>IVA (19%):</strong> $${iva.toLocaleString()}</p>
    <h3>TOTAL A PAGAR: $${total.toLocaleString()}</h3>
  `;
}

// Finalizar compra
document.querySelector(".btn-finalizar").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const orden = {
    numeroOrden: Date.now(),
    cliente: "Cliente Demo",
    productos: carrito,
    fecha: new Date().toLocaleString(),
    subtotal: carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0),
    descuento: DESCUENTO,
    iva: IVA,
    estado: "Confirmada"
  };

  localStorage.setItem(`orden_${orden.numeroOrden}`, JSON.stringify(orden));

  alert(`✅ Orden generada con éxito. Número de orden: ${orden.numeroOrden}`);
  carrito = []; // Vaciar carrito
  renderCarrito();
});

// Render inicial
renderCarrito();
