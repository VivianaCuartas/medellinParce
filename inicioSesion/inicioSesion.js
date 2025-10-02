let intentoMax = 3;

export function inicioSesion(username, password) {
    // Traer info del  local storage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar coincidencia del ya registrado
    const usuarioValido = usuarios.find(u => u.username === username && u.password === password);

    if (usuarioValido) {
        console.log("Inicio de sesión exitoso.");
        alert(`Bienvenido, ${usuarioValido.fullname}`);
        return true;
    }

    for (let conIntentos = 1; conIntentos <= intentoMax; conIntentos++) {
        if (usuarioValido) {
            return true; 
        } else {
            console.log(`Intento ${conIntentos} de ${intentoMax}.`);
            alert("Usuario o contraseña incorrectos. Intente nuevamente.");
            console.log(`Error: Usuario o contraseña incorrectos. Quedan ${intentoMax - conIntentos} intentos.`);

            if (conIntentos === intentoMax) {
                alert("Cuenta bloqueada por demasiados intentos fallidos.");
                console.log("Cuenta bloqueada por demasiados intentos fallidos.");
                return false;
            }
        }
    }

    return false;
}

