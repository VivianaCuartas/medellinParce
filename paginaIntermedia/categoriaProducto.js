// ============================================
// CATÁLOGO DE PRODUCTOS
// ============================================

// Array con todos los productos disponibles
const catalogoProductos = [
    new Producto(
        1,
        'Chompas Mujer Urbana',
        ['S', 'M', 'L', 'XL'],
        [
            { nombre: 'Negro', hex: '#000000' },
            { nombre: 'Blanco', hex: '#ffffff' },
            { nombre: 'Gris', hex: '#808080' }
        ],
        25.00,
        'Chompa 100% algodón con diseño urbano exclusivo de Medellín Parce. Cómoda y moderna, perfecta para el día a día con estilo paisa.',
        '../paginaIntermedia/imagenes/buzomujer.jpg'
    ),
    new Producto(
        2,
        'Buzo Mujer',
        ['S', 'M', 'L', 'XL'],
        [
            { nombre: 'Rosa', hex: '#FFB6C1' },
            { nombre: 'Blanco', hex: '#ffffff' },
            { nombre: 'Negro', hex: '#000000' }
        ],
        22.50,
        'Buzo suave y cómodo con logo de Medellín Parce. Ideal para clima fresco de la ciudad. Material de alta calidad y diseño exclusivo.',
        '../paginaIntermedia/imagenes/colorbuzo.jpg'
    ),
    new Producto(
        3,
        'Camiseta Logo Medellín',
        ['S', 'M', 'L', 'XL', 'XXL'],
        [
            { nombre: 'Negro', hex: '#000000' },
            { nombre: 'Gris', hex: '#808080' },
            { nombre: 'Amarillo', hex: '#FFD700' },
            { nombre: 'Blanco', hex: '#ffffff' }
        ],
        28.00,
        'Camiseta con diseño icónico de Medellín Parce. Disponible en varios colores vibrantes. Perfecta para mostrar tu orgullo paisa.',
        '../paginaIntermedia/imagenes/variedad.jpg'
    )
];

// ============================================
// FUNCIÓN PARA IR AL DETALLE DEL PRODUCTO
// ============================================
function irADetalle(idProducto) {
    // Buscar el producto en el catálogo
    const producto = catalogoProductos.find(p => p.id === idProducto);
    
    if (producto) {
        // Guardar el producto seleccionado
        producto.guardarParaDetalle();
        
        // Redirigir a la página de detalle
        window.location.href = '../detalleProducto/index.html';
    } else {
        console.error('Producto no encontrado');
    }
}

// ============================================
// CONFIGURAR EVENTOS AL CARGAR LA PÁGINA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Obtener todas las tarjetas de productos
    const productCards = document.querySelectorAll('.product-card');
    
    // Agregar evento de clic a cada imagen de producto
    productCards.forEach((card, index) => {
        const imagen = card.querySelector('img');
        const titulo = card.querySelector('.product-name');
        
        // Agregar cursor pointer para indicar que es clickeable
        if (imagen) {
            imagen.style.cursor = 'pointer';
            imagen.addEventListener('click', function() {
                irADetalle(index + 1); // +1 porque los IDs empiezan en 1
            });
        }
        
        // También hacer clickeable el título
        if (titulo) {
            titulo.style.cursor = 'pointer';
            titulo.addEventListener('click', function() {
                irADetalle(index + 1);
            });
        }
    });
    
    console.log('Eventos de productos configurados');
    console.log(`${catalogoProductos.length} productos disponibles en el catálogo`);
});
