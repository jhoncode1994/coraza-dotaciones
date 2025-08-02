// === API URLs ===
const apiAsociados = 'https://coraza-api.onrender.com/api/asociados';
const apiInventario = 'https://coraza-api.onrender.com/api/inventario';

// === VARIABLES GLOBALES ===
let asociadosGlobal = [];

// === AL CARGAR DOCUMENTO ===
document.addEventListener('DOMContentLoaded', async () => {
  await cargarAsociados();
  await cargarInventario();

  const formAsociado = document.getElementById('asociado-form');
  if (formAsociado) {
    formAsociado.addEventListener('submit', async (e) => {
      e.preventDefault();
      await guardarAsociado();
    });
  }

  const btnGuardarInventario = document.getElementById('btn-guardar-inventario');
  if (btnGuardarInventario) {
    btnGuardarInventario.addEventListener('click', guardarInventario);
  }
});

// === FUNCIONES ASOCIADOS ===
async function guardarAsociado() {
  const form = document.getElementById('asociado-form');
  const asociado = {
    cedula: document.getElementById('cedula').value.trim(),
    nombres: document.getElementById('nombres').value.trim(),
    apellidos: document.getElementById('apellidos').value.trim(),
    fecha_ingreso: document.getElementById('fecha_ingreso').value || null
  };

  try {
    const metodo = asociadosGlobal.some(a => a.cedula === asociado.cedula) ? 'PUT' : 'POST';
    const url = metodo === 'PUT' ? `${apiAsociados}/${asociado.cedula}` : apiAsociados;

    const response = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asociado)
    });

    if (!response.ok) throw new Error('Error al guardar asociado');

    form.reset();
    await cargarAsociados();
  } catch (error) {
    console.error('Error al guardar asociado:', error);
    alert('❌ Error al guardar asociado.');
  }
}

async function cargarAsociados() {
  try {
    const response = await fetch(apiAsociados);
    const asociados = await response.json();

    if (!Array.isArray(asociados)) throw new Error('Respuesta no válida');

    asociadosGlobal = asociados;

    const lista = document.getElementById('lista-asociados');
    if (lista) {
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
    }
  } catch (error) {
    console.error('Error al cargar asociados:', error);
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

async function eliminarAsociado(cedula) {
  if (!confirm(`¿Seguro que quieres eliminar al asociado con cédula ${cedula}?`)) return;

  try {
    const response = await fetch(`${apiAsociados}/${cedula}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Error al eliminar asociado');

    await cargarAsociados();
  } catch (error) {
    console.error('Error al eliminar asociado:', error);
  }
}

// === FUNCIONES INVENTARIO ===
async function guardarInventario() {
  const nombre = document.getElementById('nombre').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const estado = document.getElementById('estado').value.trim();
  const serial = document.getElementById('serial').value.trim();
  const observaciones = document.getElementById('observaciones').value.trim();

  if (!nombre || isNaN(cantidad)) {
    alert('Por favor complete todos los campos obligatorios.');
    return;
  }

  try {
    const respuesta = await fetch(apiInventario, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        descripcion,
        cantidad,
        estado,
        serial,
        observaciones
      }),
    });

    const resultado = await respuesta.json();

    if (respuesta.ok) {
      alert('✅ Inventario guardado correctamente');
      limpiarFormularioInventario();
      await cargarInventario();
    } else {
      throw new Error(resultado.error || 'Error al guardar inventario');
    }
  } catch (error) {
    console.error('❌ Error en guardarInventario():', error);
    alert('Error al guardar en el servidor.');
  }
}

function limpiarFormularioInventario() {
  document.getElementById('nombre').value = '';
  document.getElementById('descripcion').value = '';
  document.getElementById('cantidad').value = '';
  document.getElementById('estado').value = '';
  document.getElementById('serial').value = '';
  document.getElementById('observaciones').value = '';
}

async function cargarInventario() {
  try {
    const response = await fetch(apiInventario);
    const inventario = await response.json();

    const tabla = document.getElementById('tabla-inventario');
    if (!tabla || !Array.isArray(inventario)) return;

    tabla.innerHTML = `
      <tr>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Cantidad</th>
        <th>Estado</th>
        <th>Serial</th>
        <th>Observaciones</th>
      </tr>
    `;

    inventario.forEach(item => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${item.nombre}</td>
        <td>${item.descripcion}</td>
        <td>${item.cantidad}</td>
        <td>${item.estado}</td>
        <td>${item.serial}</td>
        <td>${item.observaciones}</td>
      `;
      tabla.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al cargar inventario:', error);
  }
}
