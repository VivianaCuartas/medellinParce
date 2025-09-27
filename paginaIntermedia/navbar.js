document.addEventListener('DOMContentLoaded', function() {
    const authSection = document.getElementById('auth-section');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    if (isLoggedIn && username) {
        // Replace login link with profile icon section (similar to modificacionDatos/index.html)
        authSection.innerHTML = `
            <div id="perfil-usuario">
                <img src="../paginaIntermedia/imagenes/image copy.png" alt="Icono de usuario" class="icono-usuario">
                <div class="dropdown-contenido">
                    <a href="../modificacionDatos/index.html">Mi Perfil</a>
                    <a href="../inicioSesion/index.html" id="logout-link">Cerrar Sesión</a>
                </div>
            </div>
        `;
        
        // Add event listener for logout
        const logoutLink = document.getElementById('logout-link');
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.open('../inicioSesion/index.html');
        });
        
        // Handle dropdown visibility
        const perfilUsuario = document.getElementById('perfil-usuario');
        if (perfilUsuario) {
            perfilUsuario.addEventListener('click', function(e) {
                const dropdown = this.querySelector('.dropdown-contenido');
                dropdown.classList.toggle('active');
            });
            
            // Close dropdown when clicking elsewhere
            document.addEventListener('click', function(e) {
                if (!e.target.closest('#perfil-usuario')) {
                    const dropdown = document.querySelector('.dropdown-contenido');
                    if (dropdown && dropdown.classList.contains('active')) {
                        dropdown.classList.remove('active');
                    }
                }
            });
        }
    }
});
