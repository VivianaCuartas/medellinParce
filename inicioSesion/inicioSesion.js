let intentoMax = 3;

export function inicioSesion() {
    
    for (let conIntentos = 1; conIntentos <= intentoMax; conIntentos++) {
        if (user === userStorage && password === passwStorage) {
            console.log("Inicio de sesión exitoso.");

            return true; 
        }
      
        console.log(`Intento ${conIntentos} de ${intentoMax}.`);
        alert(`Usuario o contraseña incorrectos Intente nuevamente`)
        console.log(`Error: Usuario o contraseña incorrectos. Quedan ${intentoMax - conIntentos} intentos.`);
        
        if (conIntentos === intentoMax) {
            alert("Cuenta bloqueada por demasiados intentos fallidos.");
            console.log("Cuenta bloqueada por demasiados intentos fallidos.");
            return false; 
        } 

    
    }
    return false;
}
