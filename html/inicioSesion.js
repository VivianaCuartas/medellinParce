let intentoMax = 3;

export function inicioSesion() {
    
    for (let conIntentos = 1; conIntentos <= intentoMax; conIntentos++) {
        if (user === userStorage && password === passwStorage) {
            console.log("Inicio de sesión exitoso.");

       /*   // Guardamos el usuario actual que inició sesión
            localStorage.setItem("currentUser", userStorage); */
            return true; 
        }
      
        console.log(`Intento ${conIntentos} de ${intentoMax}.`);
        alert(`Usuario o contraseña incorrectos Intente nuevamente`)
        console.log(`Error: Usuario o contraseña incorrectos. Quedan ${intentoMax - conIntentos} intentos.`);
        
        if (conIntentos === intentoMax) {
            alert("Cuenta bloqueada por 24 horas, comunícate con tu banco");
            console.log("Cuenta bloqueada por 24 horas, comunícate con tu banco");
            return false; 
        } 

    
    }
    return false;
}
