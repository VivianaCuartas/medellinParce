import { Usuario } from '../formularioRegistro/logicaRegistro.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const editarBtn = document.getElementById('editarBtn');
    const guardarBtn = document.getElementById('guardarBtn');
  
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
  
    const toastContainer = document.getElementById('toast-container');
    const inputs = [nombreInput, apellidoInput, emailInput, telefonoInput];

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        // Redirect to login page if not logged in
        window.location.href = '/inicioSesion/index.html';
        return;
    }

    // Get user data from localStorage
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (!usuarioActivo) {
        // No active user, redirect to login
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/inicioSesion/index.html';
        return;
    }
  
    // Update welcome message with user's name
    const nombreCompleto = usuarioActivo.fullname.split(' ');
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = nombreCompleto[0] || "Usuario";
    }
  
    // Make sure buttons won't submit the form
    [editarBtn, guardarBtn].forEach(btn => {
      if (btn) btn.setAttribute('type', 'button');
    });
  
    // Prevent any accidental form submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }
  
    // Create or update perfilUsuario based on active user data
    const perfilUsuario = {
        nombre: usuarioActivo.fullname ? usuarioActivo.fullname.split(' ')[0] : '',
        apellido: usuarioActivo.fullname ? usuarioActivo.fullname.split(' ')[1] || '' : '',
        email: usuarioActivo.email || '',
        telefono: usuarioActivo.telefono || ''
    };
    
    localStorage.setItem('perfilUsuario', JSON.stringify(perfilUsuario));
    
    // Load user data into form inputs
    nombreInput.value = perfilUsuario.nombre;
    apellidoInput.value = perfilUsuario.apellido;
    emailInput.value = perfilUsuario.email;
    telefonoInput.value = perfilUsuario.telefono;
  
    // remove the 'popup' class after the animation
    inputs.forEach(i => {
      i.addEventListener('animationend', () => i.classList.remove('popup'));
    });
  
    // --- enable editing ---
    editarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      inputs.forEach((input, idx) => {
        input.disabled = false;
        input.classList.add('popup');
        // focus the first input only
        if (idx === 0) input.focus();
      });
    });
  
    // --- save changes using Usuario class methods ---
    guardarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const datos = {
        nombre: nombreInput.value.trim(),
        apellido: apellidoInput.value.trim(),
        email: emailInput.value.trim(),
        telefono: telefonoInput.value.trim()
      };
      
      // Create a Usuario instance with the active user data
      const usuarioInstance = new Usuario(
        usuarioActivo.fullname, 
        usuarioActivo.email, 
        usuarioActivo.username, 
        usuarioActivo.password
      );
      
      // Set any additional properties
      usuarioInstance.telefono = usuarioActivo.telefono || '';
      usuarioInstance.intentos = usuarioActivo.intentos || 0;
      
      // Use the modificarDatos method to update the user's profile
      if (usuarioInstance.modificarDatos(datos)) {
        // Get the updated user data
        const updatedUser = Usuario.obtenerUsuario(usuarioActivo.username);
        if (updatedUser) {
          // Update the active user in localStorage
          localStorage.setItem('usuarioActivo', JSON.stringify(updatedUser));
        }
        
        showToast('Cambios guardados correctamente ✅');
      } else {
        showToast('Error al guardar los cambios ❌');
      }
  
      inputs.forEach(input => input.disabled = true);
    });
  
    function showToast(message, duration = 3500) {
      if (!toastContainer) return;
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      toastContainer.appendChild(toast);
  
      setTimeout(() => {
        toast.remove();
      }, duration + 400);
    }
  });
