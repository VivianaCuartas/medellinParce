// Check if we're on the login page
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (username && password) {
            // In a real application, you would verify credentials with a backend
            // For this example, we're just storing login state in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            
            // Show success message
            showToast('Login successful!', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = '/paginaPrincipal/home.html';
            }, 1500);
        } else {
            showToast('Please enter valid credentials', 'error');
        }
    });
}

// Function to show toast messages
function showToast(message, type) {
    const toastContainer = document.getElementById('toast-container-mensaje');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Check login status for home page navigation
document.addEventListener('DOMContentLoaded', function() {
    // This runs on every page where login.js is included
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Elements that need to be toggled based on login status
    const loginMenuItem = document.querySelector('nav ul li a[href="/inicioSesion/index.html"]')?.parentNode;
    const perfilUsuario = document.getElementById('perfil-usuario');
    
    if (loginMenuItem && perfilUsuario) {
        // We're on a page with navigation
        if (isLoggedIn) {
            // User is logged in
            loginMenuItem.style.display = 'none';
            perfilUsuario.style.display = 'block';
        } else {
            // User is not logged in
            loginMenuItem.style.display = 'list-item';
            perfilUsuario.style.display = 'none';
        }
    }
    
    // Add logout functionality
    const logoutLink = document.querySelector('#perfil-usuario .dropdown-contenido a[href="../inicioSesion/index.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            window.location.href = '/inicioSesion/index.html';
        });
    }
});

// Export any functions you need to use in other modules
export { showToast };
