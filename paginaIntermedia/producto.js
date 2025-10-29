// ============================================
// CLASE PRODUCTO
// ============================================
class Producto {
    constructor(id, nombre, tallas, colores, precio, descripcion, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.tallas = tallas;
        this.colores = colores;
        this.precio = precio;
        this.descripcion = descripcion;
        this.imagen = imagen;
    }

    // Formatea el precio en pesos colombianos
    formatearPrecio() {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2
        }).format(this.precio);
    }

    // Guarda el producto seleccionado para mostrarlo en el detalle
    guardarParaDetalle() {
        const productoData = {
            id: this.id,
            nombre: this.nombre,
            tallas: this.tallas,
            colores: this.colores,
            precio: this.precio,
            descripcion: this.descripcion,
            imagen: this.imagen
        };
        
        // Guardamos en localStorage para pasar entre páginas
        localStorage.setItem('productoSeleccionado', JSON.stringify(productoData));
    }

    // Carga un producto desde localStorage
    static cargarDeDetalle() {
        const productoData = localStorage.getItem('productoSeleccionado');
        
        if (productoData) {
            const data = JSON.parse(productoData);
            return new Producto(
                data.id,
                data.nombre,
                data.tallas,
                data.colores,
                data.precio,
                data.descripcion,
                data.imagen
            );
        }
        
        return null;
    }

    // Muestra los detalles del producto en la página de detalle
    mostrarDetalles() {
        // Actualizar nombre
        document.getElementById('productName').textContent = this.nombre;
        
        // Actualizar descripción
        document.getElementById('productDescription').textContent = this.descripcion;
        
        // Actualizar precio
        document.getElementById('productPrice').textContent = this.formatearPrecio();
        
        // Actualizar imagen
        const imagen = document.getElementById('productImage');
        imagen.src = this.imagen;
        imagen.alt = this.nombre;
        
        // Mostrar tallas
        this.mostrarTallas();
        
        // Mostrar colores
        this.mostrarColores();
    }

    // Crea los botones de tallas
    mostrarTallas() {
        const contenedor = document.getElementById('sizeSelector');
        contenedor.innerHTML = '';
        
        this.tallas.forEach((talla, index) => {
            const boton = document.createElement('button');
            boton.className = 'size-btn';
            boton.textContent = talla;
            
            if (index === 0) {
                boton.classList.add('active');
            }
            
            boton.addEventListener('click', function() {
                document.querySelectorAll('.size-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                boton.classList.add('active');
            });
            
            contenedor.appendChild(boton);
        });
    }

    // Crea los círculos de colores
    mostrarColores() {
        const contenedor = document.getElementById('colorSelector');
        contenedor.innerHTML = '';
        
        this.colores.forEach((color, index) => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            
            const circulo = document.createElement('div');
            circulo.className = 'color-circle';
            circulo.style.backgroundColor = color.hex;
            
            if (index === 0) {
                circulo.classList.add('active');
            }
            
            circulo.addEventListener('click', function() {
                document.querySelectorAll('.color-circle').forEach(c => {
                    c.classList.remove('active');
                });
                circulo.classList.add('active');
            });
            
            const nombre = document.createElement('span');
            nombre.className = 'color-name';
            nombre.textContent = color.nombre;
            
            colorOption.appendChild(circulo);
            colorOption.appendChild(nombre);
            contenedor.appendChild(colorOption);
        });
    }

    // Convierte el producto a objeto simple
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            tallas: this.tallas,
            colores: this.colores,
            precio: this.precio,
            descripcion: this.descripcion,
            imagen: this.imagen
        };
    }
}