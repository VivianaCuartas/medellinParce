import { Usuario } from '../formularioRegistro/logicaRegistro.js';

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Basic validation
        if (username && password) {
            // Create a user instance to use its login method
            const usuario = new Usuario('', '', '', '');
            const loggedUser = usuario.login(username, password);
            
            if (loggedUser) {
                // Store user data and login state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userData', JSON.stringify(loggedUser));
                localStorage.setItem('usuarioActivo', JSON.stringify(loggedUser));
                
                // Show welcome message as toast
              
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = '/paginaPrincipal/home.html';
                }, 1500);
            }
        } else {
            showToast('Please enter valid credentials', 'error');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Get UI elements
    const authSection = document.getElementById('auth-section');
    const perfilUsuario = document.getElementById('perfil-usuario');
    
    console.log('Login state:', isLoggedIn);
    console.log('Auth section:', authSection);
    console.log('Profile section:', perfilUsuario);
    
    if (isLoggedIn) {
        // User is logged in
        if (authSection) authSection.style.display = 'none';
        if (perfilUsuario) {
            perfilUsuario.style.display = 'block';
            console.log('Profile should be visible now');
        }
    } else {
        if (authSection) authSection.style.display = 'block';
        if (perfilUsuario) perfilUsuario.style.display = 'none';
    }
    
    const logoutLinks = document.querySelectorAll('#perfil-usuario .dropdown-contenido a:last-child');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Clear auth data
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userData');
            localStorage.removeItem('usuarioActivo');
            console.log('Logged out');
        });
    });
});

function showToast(message, type) {
    const toastContainer = document.getElementById('toast-container-mensaje');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
   
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

export { showToast };
