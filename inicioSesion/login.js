
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

         // Recuperar lista de usuarios registrados
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

         // Buscar si existe uno que coincida
        const usuarioValido = usuarios.find(u => 
            (u.username === username || u.email === username) && u.password === password
        );

        
        // Basic validation
        if (username && password) {
            // Store login state in localStorage
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

    if (usuarioValido) {
    console.log("Inicio de sesión exitoso.");
    alert(`Bienvenido, ${usuarioValido.fullname}`);

    // Guardar login y datos del usuario en localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));

    return true;
}
    

    const logoutLinks = document.querySelectorAll('#perfil-usuario .dropdown-contenido a:last-child');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Clear auth data
            localStorage.removeItem('isLoggedIn');
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
