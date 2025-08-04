const apiAsociados = 'https://coraza-api.onrender.com/api/asociados';
const apiInventario = 'https://coraza-api.onrender.com/api/inventario';
const apiEntregas = 'https://coraza-api.onrender.com/api/entregas';

function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(sec => sec.classList.add('oculto'));
  document.getElementById(id).classList.remove('oculto');
}

function mostrarNotificacion(mensaje, exito = true) {
  const noti = document.getElementById('notificacion');
  noti.textContent = mensaje;
  noti.style.background = exito ? '#4caf50' : '#f44336';
  noti.classList.remove('oculto');
  setTimeout(() => {
    noti.classList.add('oculto');
  }, 3000);
}

document.getElementById('formAsociado').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    cedula: document.getElementById('cedula').value,
    nombre: document.getElementById('nombre').value,
    cargo: document.getElementById('cargo').value,
    telefono: document.getElementById('telefono').value
  };

  try {
    const res = await fetch(apiAsociados, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    if (res.ok) {
      mostrarNotificacion('Asociado registrado correctamente.');
      e.target.reset();
    } else {
      mostrarNotificacion('Error al registrar asociado.', false);
    }
  } catch {
    mostrarNotificacion('Error de conexión al registrar.', false);
  }
});

document.getElementById('formInventario').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const items = Array.from(form.elements).filter(el => el.name);
  const datos = items.reduce((acc, el) => {
    acc[el.name] = parseInt(el.value) || 0;
    return acc;
  }, {});

  try {
    const res = await fetch(apiInventario, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(datos)
    });
    if (res.ok) {
      mostrarNotificacion('Ingreso al inventario registrado.');
      form.reset();
    } else {
      mostrarNotificacion('Error al registrar inventario.', false);
    }
  } catch {
    mostrarNotificacion('Error de conexión al registrar.', false);
  }
});

document.getElementById('formEntrega').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const datos = {
    cedula: document.getElementById('cedulaEntrega').value,
    fecha: document.getElementById('fechaEntrega').value
  };

  Array.from(form.elements).forEach(el => {
    if (el.name && el.type === 'number') {
      datos[el.name] = parseInt(el.value) || 0;
    }
  });

  try {
    const res = await fetch(apiEntregas, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(datos)
    });
    if (res.ok) {
      mostrarNotificacion('Dotación asignada correctamente.');
      form.reset();
    } else {
      mostrarNotificacion('Error al asignar dotación.', false);
    }
  } catch {
    mostrarNotificacion('Error de conexión al asignar.', false);
  }
});
