let cart = [];

function addToCart(name, price, quantity = 1) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, quantity });
    }
    updateCartDisplay();
    saveCart();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
    saveCart();
}

function updateQuantity(name, newQuantity) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        updateCartDisplay();
        saveCart();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartContent = document.querySelector('.cart-content');
    if (!cartContent) return;

    cartContent.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <div class="cart-item-controls">
                <button class="quantity-decrease-btn" data-name="${item.name}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-increase-btn" data-name="${item.name}">+</button>
            </div>
            <span>$${itemTotal.toFixed(2)}</span>
            <button class="remove-item-btn" data-name="${item.name}">×</button>
        `;
        cartContent.appendChild(itemElement);
    });

    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    totalElement.innerHTML = `
        <strong>Total: $${total.toFixed(2)}</strong>
        ${total > 0 ? '<button class="checkout-btn">Pagar</button>' : ''}
    `;
    cartContent.appendChild(totalElement);

    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = itemCount;
        cartCount.style.display = itemCount > 0 ? 'block' : 'none';
    }

    // Agregar event listeners a los nuevos botones
    attachCartButtonListeners();
}

// Nueva función para agregar event listeners
function attachCartButtonListeners() {
    // Botones de disminuir cantidad
    document.querySelectorAll('.quantity-decrease-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const itemName = this.getAttribute('data-name');
            const item = cart.find(i => i.name === itemName);
            if (item) {
                updateQuantity(itemName, item.quantity - 1);
            }
        });
    });

    // Botones de aumentar cantidad
    document.querySelectorAll('.quantity-increase-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const itemName = this.getAttribute('data-name');
            const item = cart.find(i => i.name === itemName);
            if (item) {
                updateQuantity(itemName, item.quantity + 1);
            }
        });
    });

    // Botones de eliminar
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const itemName = this.getAttribute('data-name');
            removeFromCart(itemName);
        });
    });

    // Botón de checkout
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            checkout();
        });
    }
}

function checkout() {
    if (cart.length > 0) {
        // Guardamos el carrito en localStorage (ya lo tienes con saveCart)
        saveCart();

        // Redirigir a la página de resumen de compra
        window.location.href = "../ordenCompra/index.html"; 
        // Ajusta la ruta según la estructura de carpetas
    } else {
        alert("⚠️ El carrito está vacío.");
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Prevenir que el dropdown se cierre al hacer clic dentro
    const cartDropdown = document.querySelector('.cart-dropdown');
    if (cartDropdown) {
        cartDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});