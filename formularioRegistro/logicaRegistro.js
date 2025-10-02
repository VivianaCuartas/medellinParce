class Usuario {
    constructor(fullname, email, username, password) {
        this.fullname = fullname;
        this.email = email;
        this.username = username;
        this.password = password;
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

    // Mostrar mensaje dinamico con DOM
    mostrarMensaje(texto, tipo) {
        const contenedor = document.getElementById("toast-container-mensaje");
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
        nuevoUsuario.registrar();

        // Resetear formulario al terminar
        form.reset();
    });
});
