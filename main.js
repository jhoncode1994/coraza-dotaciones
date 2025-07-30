const API_URL = 'https://coraza-api.onrender.com/api/asociados'; // cambia si estás en local

// Referencias a elementos del DOM
const form = document.getElementById('form-asociado');
const tabla = document.getElementById('tabla-asociados');

// ✅ Mostrar todos los asociados al cargar
document.addEventListener('DOMContentLoaded', async () => {
  await cargarAsociados();
});

// ✅ Guardar nuevo asociado
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const asociado = {
    cedula: document.getElementById('new-cedula').value.trim(),
    nombres: document.getElementById('new-nombres').value.trim(),
    apellidos: document.getElementById('new-apellidos').value.trim(),
    cargo: document.getElementById('new-cargo').value.trim(),
    grupo: document.getElementById('new-grupo').value.trim(),
    fecha_ingreso: document.getElementById('new-fecha-ingreso').value || null,
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asociado),
    });

    if (!res.ok) throw new Error('Error al guardar asociado');

    form.reset();
    await cargarAsociados();
  } catch (err) {
    alert('❌ No se pudo guardar el asociado');
    console.error(err);
  }
});

// ✅ Función para cargar y mostrar asociados en la tabla
async function cargarAsociados() {
  try {
    const res = await fetch(API_URL);
    const asociados = await res.json();

    tabla.innerHTML = '';

    asociados.forEach((a) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${a.cedula}</td>
        <td>${a.nombres}</td>
        <td>${a.apellidos}</td>
        <td>${a.cargo}</td>
        <td>${a.grupo}</td>
        <td>${a.fecha_ingreso ? a.fecha_ingreso.split('T')[0] : ''}</td>
        <td>
          <!-- Luego agregamos botones de editar y eliminar -->
        </td>
      `;
      tabla.appendChild(row);
    });
  } catch (err) {
    console.error('Error al cargar asociados:', err);
  }
}
