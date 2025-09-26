document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const toastContainer = document.getElementById('toast-container-mensaje');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // For demonstration, we'll use basic validation
        // In a real app, you would validate against a server
        if (username && password) {
            // Store login status in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Show success message
            showToast('Inicio de sesión exitoso. Redirigiendo...', 'success');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '../paginaIntermedia/index.html';
            }, 1500);
        } else {
            showToast('Por favor ingrese usuario y contraseña', 'error');
        }
    });
    
    // Toast message function
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});
