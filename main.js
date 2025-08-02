const apiUrl = 'https://coraza-api.onrender.com/api/asociados';
let asociadosGlobal = []; // Variable global para usar en edición

document.addEventListener('DOMContentLoaded', async () => {
  await cargarAsociados();

  const form = document.getElementById('asociado-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const asociado = {
      cedula: document.getElementById('cedula').value.trim(),
      nombres: document.getElementById('nombres').value.trim(),
      apellidos: document.getElementById('apellidos').value.trim(),
      fecha_ingreso: document.getElementById('fecha_ingreso').value || null
    };

    try {
      // Verificar si es edición o nuevo
      const metodo = asociadosGlobal.some(a => a.cedula === asociado.cedula) ? 'PUT' : 'POST';
      const url = metodo === 'PUT' ? `${apiUrl}/${asociado.cedula}` : apiUrl;

      const response = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asociado)
      });

      if (!response.ok) throw new Error('Error al guardar asociado');

      form.reset();
      await cargarAsociados();
    } catch (error) {
      console.error('Error:', error);
    }
  });
});

async function cargarAsociados() {
  try {
    const response = await fetch(apiUrl);
    const asociados = await response.json();

    if (!Array.isArray(asociados)) throw new Error('Respuesta no válida');

    // Guardar en variable global
    asociadosGlobal = asociados;

    const lista = document.getElementById('lista-asociados');
    lista.innerHTML = '';

    asociados.forEach(asociado => {
      const item = document.createElement('li');
      item.innerHTML = `
        ${asociado.nombres} ${asociado.apellidos} (${asociado.cedula}) - Ingreso: ${asociado.fecha_ingreso || 'N/A'}
        <button onclick="editarAsociado('${asociado.cedula}')">🖊</button>
        <button onclick="eliminarAsociado('${asociado.cedula}')">🗑</button>
      `;
      lista.appendChild(item);
    });
  } catch (error) {
    console.error('Error al cargar asociados:', error);
  }
}

async function eliminarAsociado(cedula) {
  if (!confirm(`¿Seguro que quieres eliminar al asociado con cédula ${cedula}?`)) return;

  try {
    const response = await fetch(`${apiUrl}/${cedula}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Error al eliminar asociado');

    await cargarAsociados();
  } catch (error) {
    console.error('Error al eliminar:', error);
  }
}

function editarAsociado(cedula) {
  const asociado = asociadosGlobal.find(a => a.cedula === cedula);
  if (!asociado) return;

  document.getElementById('cedula').value = asociado.cedula;
  document.getElementById('nombres').value = asociado.nombres;
  document.getElementById('apellidos').value = asociado.apellidos;
  document.getElementById('fecha_ingreso').value = asociado.fecha_ingreso || '';
}
