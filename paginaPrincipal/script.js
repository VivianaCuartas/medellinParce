// Clase Producto
class Producto {
  constructor(nombre, imagen) {
    this.nombre = nombre;
    this.imagen = imagen;
  }

  crearCard() {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = this.imagen;
    img.alt = this.nombre;

    const titulo = document.createElement("h3");
    titulo.textContent = this.nombre.toUpperCase();

    const boton = document.createElement("button");
    boton.textContent = "OBTENER";
    boton.addEventListener("click", () => {
      alert(`Has seleccionado: ${this.nombre}`);
    });

    card.appendChild(img);
    card.appendChild(titulo);
    card.appendChild(boton);

    return card;
  }
}

// Clase Catálogo
class Catalogo {
  constructor(listaProductos, contenedorId) {
    this.listaProductos = listaProductos;
    this.contenedor = document.getElementById(contenedorId);
  }

  mostrarProductos() {
    this.listaProductos.forEach(prod => {
      const producto = new Producto(prod.nombre, prod.imagen);
      this.contenedor.appendChild(producto.crearCard());
    });
  }
}

// Datos de productos
const camisetas = [
  { nombre: "Camiseta Metrocable", imagen: "camiseta1.png" },
  { nombre: "Camiseta Coltejer", imagen: "camiseta2.png" },
  { nombre: "Camiseta Comuna 13", imagen: "camiseta3.png" },
  { nombre: "Camiseta Botero", imagen: "camiseta4.png" },
  { nombre: "Camiseta Parce", imagen: "camiseta5.png" },
  { nombre: "Camiseta Chiva", imagen: "camiseta6.png" }
];

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  const catalogo = new Catalogo(camisetas, "catalogo");
  catalogo.mostrarProductos();
});
