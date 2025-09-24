// Productos de ejemplo en carrito
let carrito = [
  { id: 1, nombre: "Laptop Gamer", precio: 3500, cantidad: 1 },
  { id: 2, nombre: "Mouse Inalámbrico", precio: 150, cantidad: 2 }
];

function renderCarrito() {
  const listaCarrito = document.getElementById("lista-carrito");
  const totalCarrito = document.getElementById("total-carrito");

  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((prod, index) => {
    let subtotal = prod.precio * prod.cantidad;
    total += subtotal;

    listaCarrito.innerHTML += `
      <div class="item-carrito">
        <span>${prod.nombre} - $${prod.precio} x ${prod.cantidad} = $${subtotal}</span>
        <button onclick="eliminarProducto(${index})">❌</button>
      </div>
    `;
  });

  totalCarrito.textContent = `$${total}`;
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  renderCarrito();
}

// Confirmar compra
document.getElementById("btn-confirmar").addEventListener("click", () => {
  let orden = new Orden(Date.now(), "Cliente Demo", carrito);
  orden.generarOrden();

  mostrarOrden(orden);
});

function mostrarOrden(orden) {
  document.getElementById("vista-carrito").classList.remove("activa");
  document.getElementById("vista-orden").classList.add("activa");

  const resumen = orden.mostrarResumen();
  const resumenDiv = document.getElementById("resumen-orden");

  resumenDiv.innerHTML = `
    <p>Orden #: ${resumen.numeroOrden}</p>
    <p>Cliente: ${resumen.cliente}</p>
    <p>Fecha: ${resumen.fecha}</p>
    <p>Estado: ${resumen.estado}</p>
    <h3>Productos:</h3>
    <ul>
      ${resumen.productos.map(p => `<li>${p.nombre} (x${p.cantidad}) - $${p.precio * p.cantidad}</li>`).join("")}
    </ul>
    <p>Total: $${resumen.total}</p>
  `;
}

// Volver a tienda
document.getElementById("btn-volver").addEventListener("click", () => {
  document.getElementById("vista-orden").classList.remove("activa");
  document.getElementById("vista-carrito").classList.add("activa");
});

// Render inicial
renderCarrito();
