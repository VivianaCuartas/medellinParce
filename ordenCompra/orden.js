class Orden {
  constructor(numeroOrden, cliente, listaProductos = []) {
    this.numeroOrden = numeroOrden;      // Número único de la orden
    this.cliente = cliente;              // Nombre o datos del cliente
    this.listaProductos = listaProductos; // Array con productos {nombre, precio, cantidad}
    this.total = this.calcularTotal();   // Calcula el total automáticamente
    this.fecha = new Date().toLocaleString(); // Fecha y hora actual
    this.estado = "Pendiente";           // Estado inicial
  }

  // Método privado de apoyo (calcular total de la orden)
  calcularTotal() {
    return this.listaProductos.reduce((acc, producto) => {
      return acc + (producto.precio * producto.cantidad);
    }, 0);
  }

  // Confirmar y guardar la orden
  generarOrden() {
    this.total = this.calcularTotal();
    this.estado = "Confirmada";

    // Persistimos la orden en localStorage
    localStorage.setItem(
      `orden_${this.numeroOrden}`,
      JSON.stringify(this)
    );

    console.log(`✅ Orden #${this.numeroOrden} confirmada y guardada.`);
  }

  // Mostrar un resumen de la orden (en formato de objeto)
  mostrarResumen() {
    return {
      numeroOrden: this.numeroOrden,
      cliente: this.cliente,
      productos: this.listaProductos,
      total: this.total,
      fecha: this.fecha,
      estado: this.estado
    };
  }
}
