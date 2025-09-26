class Orden {
  constructor(numeroOrden, cliente, listaProductos = []) {
    this.numeroOrden = numeroOrden;
    this.cliente = cliente;
    this.listaProductos = listaProductos;
    this.subtotal = this.calcularSubtotal();
    this.descuento = this.calcularDescuento();
    this.iva = this.calcularIVA();
    this.total = this.calcularTotal();
    this.fecha = new Date().toLocaleString();
    this.estado = "Pendiente";
  }

  // Calcular subtotal (suma de precio * cantidad)
  calcularSubtotal() {
    return this.listaProductos.reduce((acc, producto) => {
      return acc + (producto.precio * producto.cantidad);
    }, 0);
  }

  // Calcular descuento (20% del subtotal)
  calcularDescuento() {
    const DESCUENTO_PORCENTAJE = 0.20;
    return this.subtotal * DESCUENTO_PORCENTAJE;
  }

  // Calcular IVA (19% del subtotal después del descuento)
  calcularIVA() {
    const IVA_PORCENTAJE = 0.19;
    const baseImpuesto = this.subtotal - this.descuento;
    return baseImpuesto * IVA_PORCENTAJE;
  }

  // Calcular total final
  calcularTotal() {
    return this.subtotal - this.descuento + this.iva;
  }

  // Recalcular todos los valores (útil si se modifican productos)
  recalcular() {
    this.subtotal = this.calcularSubtotal();
    this.descuento = this.calcularDescuento();
    this.iva = this.calcularIVA();
    this.total = this.calcularTotal();
  }

  // Agregar producto a la orden
  agregarProducto(producto) {
    const existente = this.listaProductos.find(p => p.id === producto.id);
    if (existente) {
      existente.cantidad += producto.cantidad;
    } else {
      this.listaProductos.push({ ...producto });
    }
    this.recalcular();
  }

  // Eliminar producto de la orden
  eliminarProducto(idProducto) {
    this.listaProductos = this.listaProductos.filter(p => p.id !== idProducto);
    this.recalcular();
  }

  // Actualizar cantidad de un producto
  actualizarCantidad(idProducto, nuevaCantidad) {
    const producto = this.listaProductos.find(p => p.id === idProducto);
    if (producto && nuevaCantidad > 0) {
      producto.cantidad = nuevaCantidad;
      this.recalcular();
    }
  }

  // Confirmar y guardar la orden
  generarOrden() {
    if (this.listaProductos.length === 0) {
      throw new Error("No se puede generar una orden sin productos");
    }

    this.recalcular(); // Asegurar cálculos actualizados
    this.estado = "Confirmada";

    // Persistir en localStorage
    try {
      localStorage.setItem(
        `orden_${this.numeroOrden}`,
        JSON.stringify(this)
      );
      console.log(`✅ Orden #${this.numeroOrden} confirmada y guardada.`);
      return true;
    } catch (error) {
      console.error("Error al guardar la orden:", error);
      return false;
    }
  }

  // Obtener resumen completo
  mostrarResumen() {
    return {
      numeroOrden: this.numeroOrden,
      cliente: this.cliente,
      productos: this.listaProductos,
      subtotal: this.subtotal,
      descuento: this.descuento,
      iva: this.iva,
      total: this.total,
      fecha: this.fecha,
      estado: this.estado
    };
  }

  // Obtener orden desde localStorage
  static cargarOrden(numeroOrden) {
    try {
      const ordenData = localStorage.getItem(`orden_${numeroOrden}`);
      if (ordenData) {
        const data = JSON.parse(ordenData);
        const orden = new Orden(data.numeroOrden, data.cliente, data.listaProductos);
        orden.estado = data.estado;
        orden.fecha = data.fecha;
        return orden;
      }
      return null;
    } catch (error) {
      console.error("Error al cargar la orden:", error);
      return null;
    }
  }

  // Obtener todas las órdenes del localStorage
  static obtenerTodasLasOrdenes() {
    const ordenes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('orden_')) {
        const numeroOrden = key.replace('orden_', '');
        const orden = Orden.cargarOrden(numeroOrden);
        if (orden) {
          ordenes.push(orden);
        }
      }
    }
    return ordenes;
  }
}