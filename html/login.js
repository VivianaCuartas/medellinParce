document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        
        localStorage.setItem('user', usernameInput);
        localStorage.setItem('password', passwordInput);
        
        let errorMsg = document.getElementById('error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('p');
            errorMsg.id = 'error-message';
            errorMsg.style.color = 'red';
            form.appendChild(errorMsg);
        }
        
        import('./inicioSesion.js')
            .then(module => {
                window.user = usernameInput;
                window.password = passwordInput;
                window.userStorage = localStorage.getItem('user');
                window.passwStorage = localStorage.getItem('password');
                
                const loginResult = module.inicioSesion();
                
                if (loginResult) {
                    console.log("Login successful, redirecting...");
                    window.location.href = 'home.html'; 
                } else {
                    errorMsg.textContent = 'Inicio de sesión fallido';
                }
            })
            .catch(error => {
                console.error('Error loading inicioSesion module:', error);
                errorMsg.textContent = 'Error al cargar el módulo de inicio de sesión';
            });
    });
});
