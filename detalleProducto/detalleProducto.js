// ============================================
// CLASE PRODUCTO
// ============================================
class Producto {
    constructor(id, nombre, descripcion, precio, imagen, tallas, colores) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.tallas = tallas;
        this.colores = colores;
    }

    formatearPrecio() {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(this.precio);
    }
}

// ============================================
// CLASE ITEM CARRITO
// ============================================
class ItemCarrito {
    constructor(producto, talla, color, cantidad) {
        this.id = `${producto.id}-${talla}-${color}`;
        this.producto = producto;
        this.talla = talla;
        this.color = color;
        this.cantidad = cantidad;
    }

    calcularSubtotal() {
        return this.producto.precio * this.cantidad;
    }

    aumentarCantidad(cantidad = 1) {
        this.cantidad += cantidad;
    }

    disminuirCantidad(cantidad = 1) {
        this.cantidad = Math.max(1, this.cantidad - cantidad);
    }
}

// ============================================
// CLASE CARRITO
// ============================================
class Carrito {
    constructor() {
        this.items = this.cargarCarrito();
    }

    agregarItem(item) {
        const itemExistente = this.items.find(i => i.id === item.id);
        
        if (itemExistente) {
            itemExistente.aumentarCantidad(item.cantidad);
        } else {
            this.items.push(item);
        }
        
        this.guardarCarrito();
    }

    eliminarItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.guardarCarrito();
    }

    obtenerCantidadTotal() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }

    calcularTotal() {
        return this.items.reduce((total, item) => total + item.calcularSubtotal(), 0);
    }

    vaciarCarrito() {
        this.items = [];
        this.guardarCarrito();
    }

    guardarCarrito() {
        // Guardamos en memoria (en un proyecto real usarías localStorage)
        window.carritoData = this.items;
    }

    cargarCarrito() {
        // Cargamos desde memoria
        return window.carritoData || [];
    }
}

// ============================================
// CLASE UI MANAGER
// ============================================
class UIManager {
    constructor() {
        this.elementos = {
            sizeSelector: document.getElementById('sizeSelector'),
            colorSelector: document.getElementById('colorSelector'),
            quantityInput: document.getElementById('quantityInput'),
            decreaseBtn: document.getElementById('decreaseBtn'),
            increaseBtn: document.getElementById('increaseBtn'),
            addToCartBtn: document.getElementById('addToCartBtn'),
            message: document.getElementById('message'),
            productName: document.getElementById('productName'),
            productDescription: document.getElementById('productDescription'),
            productPrice: document.getElementById('productPrice'),
            productImage: document.getElementById('productImage')
        };
    }

    renderizarTallas(tallas) {
        this.elementos.sizeSelector.innerHTML = '';
        tallas.forEach((talla, index) => {
            const btn = document.createElement('button');
            btn.className = 'size-btn';
            btn.textContent = talla;
            btn.dataset.size = talla;
            if (index === 0) btn.classList.add('active');
            this.elementos.sizeSelector.appendChild(btn);
        });
    }

    renderizarColores(colores) {
        this.elementos.colorSelector.innerHTML = '';
        colores.forEach((color, index) => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            
            const colorCircle = document.createElement('div');
            colorCircle.className = 'color-circle';
            colorCircle.style.backgroundColor = color.hex;
            colorCircle.dataset.color = color.nombre;
            if (index === 0) colorCircle.classList.add('active');
            
            const colorName = document.createElement('span');
            colorName.className = 'color-name';
            colorName.textContent = color.nombre;
            
            colorOption.appendChild(colorCircle);
            colorOption.appendChild(colorName);
            this.elementos.colorSelector.appendChild(colorOption);
        });
    }

    renderizarProducto(producto) {
        this.elementos.productName.textContent = producto.nombre;
        this.elementos.productDescription.textContent = producto.descripcion;
        this.elementos.productPrice.textContent = producto.formatearPrecio();
        this.elementos.productImage.src = producto.imagen;
        this.elementos.productImage.alt = producto.nombre;
    }

    obtenerTallaSeleccionada() {
        const tallaActiva = this.elementos.sizeSelector.querySelector('.size-btn.active');
        return tallaActiva ? tallaActiva.dataset.size : null;
    }

    obtenerColorSeleccionado() {
        const colorActivo = this.elementos.colorSelector.querySelector('.color-circle.active');
        return colorActivo ? colorActivo.dataset.color : null;
    }

    obtenerCantidad() {
        return parseInt(this.elementos.quantityInput.value);
    }

    mostrarMensaje(texto, tipo = 'success') {
        this.elementos.message.textContent = texto;
        this.elementos.message.className = `message ${tipo} show`;
        
        setTimeout(() => {
            this.elementos.message.classList.remove('show');
        }, 3000);
    }

    aumentarCantidad() {
        let cantidad = this.obtenerCantidad();
        if (cantidad < 10) {
            this.elementos.quantityInput.value = cantidad + 1;
        }
    }

    disminuirCantidad() {
        let cantidad = this.obtenerCantidad();
        if (cantidad > 1) {
            this.elementos.quantityInput.value = cantidad - 1;
        }
    }
}

// ============================================
// CLASE CONTROLADOR PRODUCTO
// ============================================
class ProductoController {
    constructor(producto, carrito, uiManager) {
        this.producto = producto;
        this.carrito = carrito;
        this.ui = uiManager;
        this.inicializar();
    }

    inicializar() {
        this.renderizarProducto();
        this.configurarEventos();
    }

    renderizarProducto() {
        this.ui.renderizarProducto(this.producto);
        this.ui.renderizarTallas(this.producto.tallas);
        this.ui.renderizarColores(this.producto.colores);
    }

    configurarEventos() {
        // Evento para seleccionar talla
        this.ui.elementos.sizeSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('size-btn')) {
                this.seleccionarTalla(e.target);
            }
        });

        // Evento para seleccionar color
        this.ui.elementos.colorSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-circle')) {
                this.seleccionarColor(e.target);
            }
        });

        // Eventos de cantidad
        this.ui.elementos.decreaseBtn.addEventListener('click', () => {
            this.ui.disminuirCantidad();
        });

        this.ui.elementos.increaseBtn.addEventListener('click', () => {
            this.ui.aumentarCantidad();
        });

        // Evento agregar al carrito
        this.ui.elementos.addToCartBtn.addEventListener('click', () => {
            this.agregarAlCarrito();
        });
    }

    seleccionarTalla(botonTalla) {
        const botones = this.ui.elementos.sizeSelector.querySelectorAll('.size-btn');
        botones.forEach(btn => btn.classList.remove('active'));
        botonTalla.classList.add('active');
    }

    seleccionarColor(circuloColor) {
        const circulos = this.ui.elementos.colorSelector.querySelectorAll('.color-circle');
        circulos.forEach(circle => circle.classList.remove('active'));
        circuloColor.classList.add('active');
    }

    agregarAlCarrito() {
        const talla = this.ui.obtenerTallaSeleccionada();
        const color = this.ui.obtenerColorSeleccionado();
        const cantidad = this.ui.obtenerCantidad();

        if (!talla || !color) {
            this.ui.mostrarMensaje('Por favor selecciona talla y color', 'error');
            return;
        }

        const item = new ItemCarrito(this.producto, talla, color, cantidad);
        this.carrito.agregarItem(item);

        this.ui.mostrarMensaje(
            `✓ Producto agregado al carrito (${this.carrito.obtenerCantidadTotal()} items)`,
            'success'
        );

        console.log('Carrito actualizado:', this.carrito);
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Crear producto de ejemplo
    const productoEjemplo = new Producto(
        1,
        'CAMISETA PARCE TROPICAL',
        'Camiseta 100% algodón con estampado exclusivo de diseño tropical. Ideal para el verano, con un ajuste cómodo y tela transpirable.',
        45000,
        './camiseta1.jpg',
        ['S', 'M', 'L', 'XL'],
        [
            { nombre: 'Blanco', hex: '#ffffff' },
            { nombre: 'Gris Neutro', hex: '#808080' },
            { nombre: 'Verde Menta', hex: '#98D8C8' }
        ]
    );

    // Inicializar carrito y UI
    const carrito = new Carrito();
    const uiManager = new UIManager();
    
    // Inicializar controlador
    const controller = new ProductoController(productoEjemplo, carrito, uiManager);

    console.log('Aplicación inicializada correctamente');
});