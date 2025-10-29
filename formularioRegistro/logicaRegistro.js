class Usuario {
    constructor(fullname, email, username, password) {
        this.fullname = fullname;
        this.email = email;
        this.username = username;
        this.password = password;
        this.telefono = ""; // Adding telefono property for profile completion
        this.intentos = 0;  // Track login attempts for this user
       
    }

    // Método de registro 
    registrar() {
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // validacion de registro
        const existe = usuarios.some(u => u.username === this.username || u.email === this.email);
        if (existe) {
            this.mostrarMensaje("El usuario o correo ya está registrado.", "error");
            return false;
        }

        usuarios.push(this);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        this.mostrarMensaje("Registro exitoso. Ahora puedes iniciar sesión.", "success");
        return true;
    }

    // Método para iniciar sesión
    login(inputUsername, inputPassword) {
        // Get all users from storage
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        
        // Find the user by username or email
        const usuario = usuarios.find(u => 
            u.username === inputUsername || u.email === inputUsername
        );
        
        if (!usuario) {
            this.mostrarMensaje("Usuario no encontrado", "error");
            return false;
        }
        
        // Check if account is locked
        if (usuario.intentos >= usuario.intentoMax) {
            this.mostrarMensaje("Cuenta bloqueada por demasiados intentos fallidos.", "error");
            return false;
        }
        
        // Check password
        if (usuario.password === inputPassword) {
            // Reset attempts on successful login
            usuario.intentos = 3;
            
            // Update user in storage
            this.actualizarUsuarioEnStorage(usuario);
            
            // Return the user data
            this.mostrarMensaje(`Bienvenido, ${usuario.fullname}`, "success");
            return usuario;
        } else {
            // Increment failed attempts
            usuario.intentos++;
            
            // Update user in storage with new attempt count
            this.actualizarUsuarioEnStorage(usuario);
            
            const intentosRestantes = usuario.intentoMax - usuario.intentos;
            this.mostrarMensaje(`Contraseña incorrecta. Intentos restantes: ${intentosRestantes}`, "error");
            
            if (usuario.intentos >= usuario.intentoMax) {
                this.mostrarMensaje("Cuenta bloqueada por demasiados intentos fallidos.", "error");
            }
            
            return false;
        }
    }

    // Método para actualizar usuario en localStorage
    actualizarUsuarioEnStorage(usuarioActualizado) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const index = usuarios.findIndex(u => u.username === usuarioActualizado.username);
        
        if (index !== -1) {
            usuarios[index] = usuarioActualizado;
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        }
    }

    // Método para modificar datos
    modificarDatos(datos) {
        // Update user properties
        if (datos.nombre || datos.apellido) {
            this.fullname = `${datos.nombre || ''} ${datos.apellido || ''}`.trim();
        }
        
        if (datos.email) {
            this.email = datos.email;
        }
        
        if (datos.telefono) {
            this.telefono = datos.telefono;
        }
        
        // Update in localStorage
        this.actualizarUsuarioEnStorage(this);
        
        // Also update perfilUsuario in localStorage for UI consistency
        const perfilUsuario = {
            nombre: datos.nombre || this.fullname.split(' ')[0],
            apellido: datos.apellido || (this.fullname.split(' ')[1] || ''),
            email: datos.email || this.email,
            telefono: datos.telefono || this.telefono
        };
        
        localStorage.setItem('perfilUsuario', JSON.stringify(perfilUsuario));
        
        return true;
    }

    // Método para desbloquear cuenta
    desbloquearCuenta() {
        this.intentos = 0;
        this.actualizarUsuarioEnStorage(this);
        return true;
    }

    // Método estático para obtener un usuario por username o email
    static obtenerUsuario(usernameOrEmail) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        return usuarios.find(u => u.username === usernameOrEmail || u.email === usernameOrEmail);
    }

    // Mostrar mensaje dinamico con DOM
    mostrarMensaje(texto, tipo) {
        const contenedor = document.getElementById("toast-container-mensaje");
        if (!contenedor) return; 
        
        contenedor.innerHTML = ""; 

        const div = document.createElement("div");
        div.textContent = texto;
        div.style.padding = "10px";
        div.style.borderRadius = "8px";
        div.style.marginTop = "10px";
        div.style.fontSize = "14px";
        div.style.fontWeight = "bold";

        if (tipo === "error") {
            div.style.backgroundColor = "#ff4d4d";
            div.style.color = "white";
        } else {
            div.style.backgroundColor = "#4CAF50";
            div.style.color = "white";
        }

        contenedor.appendChild(div);

        // Timer para remover el mensaje
        setTimeout(() => {
            div.remove();
        }, 3000);
    }
}

// Lógica del formulario con DOM
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");
    
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const fullname = document.getElementById("fullname").value.trim();
            const email = document.getElementById("email").value.trim();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            const confirmPassword = document.getElementById("confirm-password").value.trim();

            // Validación de email con RegEx
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const tempUser = new Usuario(fullname, email, username, password);
                tempUser.mostrarMensaje("El correo no es válido.", "error");
                return;
            }

            // Validar contraseñas iguales
            if (password !== confirmPassword) {
                const tempUser = new Usuario(fullname, email, username, password);
                tempUser.mostrarMensaje("Las contraseñas no coinciden.", "error");
                return;
            }

            // Crear objeto usuario y registrar
            const nuevoUsuario = new Usuario(fullname, email, username, password);
            if (nuevoUsuario.registrar()) {
                // Redirect to login page after successful registration
                setTimeout(() => {
                    window.location.href = "../inicioSesion/index.html";
                }, 2000);
            }

            // Resetear formulario al terminar
            form.reset();
        });
    }
});

// Export the class so it can be used in other files
export { Usuario };
