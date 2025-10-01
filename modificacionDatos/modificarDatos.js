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

    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
  
    // Update welcome message with user's name
    if (userData && userData.nombre) {
        document.getElementById('user-name').textContent = userData.nombre;
    } else {
        document.getElementById('user-name').textContent = "Sara";
    }
  
    // In your modificarDatos.js file

  
    // Make sure buttons won't submit the form (works even if HTML has type="submit")
    [editarBtn, guardarBtn].forEach(btn => {
      if (btn) btn.setAttribute('type', 'button');
    });
  
    // Prevent any accidental form submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }
  
    // --- preload dummy info if not exists ---
    if (!localStorage.getItem('perfilUsuario')) {
      const dummy = {
        nombre: 'Sara',
        apellido: 'Arango',
        email: 'sara@example.com',
        telefono: '+57 300 123 4567'
      };
      localStorage.setItem('perfilUsuario', JSON.stringify(dummy));
    }
  
    // --- load saved data into inputs ---
    const datosGuardados = JSON.parse(localStorage.getItem('perfilUsuario') || '{}');
    nombreInput.value = datosGuardados.nombre || '';
    apellidoInput.value = datosGuardados.apellido || '';
    emailInput.value = datosGuardados.email || '';
    telefonoInput.value = datosGuardados.telefono || '';
  
    // remove the 'popup' class after the animation so it can re-play next time
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
  
    // --- save changes ---
    guardarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const datos = {
        nombre: nombreInput.value.trim(),
        apellido: apellidoInput.value.trim(),
        email: emailInput.value.trim(),
        telefono: telefonoInput.value.trim()
      };
      localStorage.setItem('perfilUsuario', JSON.stringify(datos));
  
      inputs.forEach(input => input.disabled = true);
      showToast('Cambios guardados correctamente ✅');
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
