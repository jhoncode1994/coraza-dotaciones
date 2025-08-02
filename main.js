const apiAsociados = 'https://coraza-api.onrender.com/api/asociados';
const apiInventario = 'https://coraza-api.onrender.com/api/inventario';

let asociadosGlobal = [];
let inventarioGlobal = [];

document.addEventListener('DOMContentLoaded', async () => {
  await cargarAsociados();
  await cargarInventario();

  // Formulario Asociados
  document.getElementById('asociado-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cedula = document.getElementById('cedula').value.trim();
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const fecha_ingreso = document.getElementById('fecha_ingreso').value || null;

    if (!cedula || isNaN(cedula)) {
      alert('Cédula inválida');
      return;
    }
    if (!nombres || !apellidos) {
      alert('Nombres y apellidos son obligatorios');
      return;
    }

    const asociado = { cedula, nombres, apellidos, fecha_ingreso };
    const metodo = asociadosGlobal.some(a => a.cedula === cedula) ? 'PUT' : 'POST';
    const url = metodo === 'PUT' ? `${apiAsociados}/${cedula}` : apiAsociados;

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asociado)
      });
      if (!response.ok) throw new Error('Error al guardar asociado');
      e.target.reset();
      await cargarAsociados();
    } catch (error) {
      console.error(error);
    }
  });

  // Formulario Inventario
  document.getElementById('inventario-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const tipo = document.getElementById('inv-tipo').value.trim();
    const descripcion = document.getElementById('inv-descripcion').value.trim();
    const estado = document.getElementById('inv-estado').value.trim();
    const id = document.getElementById('inv-id').value || null;

    if (!tipo || !descripcion || !estado) {
      alert('Todos los campos de inventario son obligatorios');
      return;
    }

    const inventario = { id, tipo, descripcion, estado };
    const metodo = id ? 'PUT' : 'POST';
    const url = metodo === 'PUT' ? `${apiInventario}/${id}` : apiInventario;

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventario)
      });
      if (!response.ok) throw new Error('Error al guardar inventario');
      e.target.reset();
      document.getElementById('inv-id').value = ''; // Limpiar ID oculto
      await cargarInventario();
    } catch (error) {
      console.error(error);
    }
  });
});

async function cargarAsociados() {
  try {
    const response = await fetch(apiAsociados);
    const asociados = await response.json();
    if (!Array.isArray(asociados)) throw new Error('Respuesta inválida');
    asociadosGlobal = asociados;

    const lista = document.getElementById('lista-asociados');
    lista.innerHTML = '';
    asociados.forEach(a => {
      const item = document.createElement('li');
      item.innerHTML = `
        ${a.nombres} ${a.apellidos} (${a.cedula}) - Ingreso: ${a.fecha_ingreso || 'N/A'}
        <button onclick="editarAsociado('${a.cedula}')">🖊</button>
        <button onclick="eliminarAsociado('${a.cedula}')">🗑</button>
      `;
      lista.appendChild(item);
    });
  } catch (error) {
    console.error(error);
  }
}

async function eliminarAsociado(cedula) {
  if (!confirm(`¿Eliminar asociado ${cedula}?`)) return;
  try {
    const res = await fetch(`${apiAsociados}/${cedula}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar asociado');
    await cargarAsociados();
  } catch (err) {
    console.error(err);
  }
}

function editarAsociado(cedula) {
  const a = asociadosGlobal.find(x => x.cedula === cedula);
  if (!a) return;
  document.getElementById('cedula').value = a.cedula;
  document.getElementById('nombres').value = a.nombres;
  document.getElementById('apellidos').value = a.apellidos;
  document.getElementById('fecha_ingreso').value = a.fecha_ingreso || '';
}

async function cargarInventario() {
  try {
    const response = await fetch(apiInventario);
    const items = await response.json();
    if (!Array.isArray(items)) throw new Error('Respuesta inválida');
    inventarioGlobal = items;

    const lista = document.getElementById('lista-inventario');
    lista.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${item.tipo} - ${item.descripcion} (${item.estado})
        <button onclick="editarInventario(${item.id})">🖊</button>
        <button onclick="eliminarInventario(${item.id})">🗑</button>
      `;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error(error);
  }
}

async function eliminarInventario(id) {
  if (!confirm(`¿Eliminar ítem con ID ${id}?`)) return;
  try {
    const res = await fetch(`${apiInventario}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar ítem');
    await cargarInventario();
  } catch (err) {
    console.error(err);
  }
}

function editarInventario(id) {
  const item = inventarioGlobal.find(x => x.id === id);
  if (!item) return;
  document.getElementById('inv-id').value = item.id;
  document.getElementById('inv-tipo').value = item.tipo;
  document.getElementById('inv-descripcion').value = item.descripcion;
  document.getElementById('inv-estado').value = item.estado;
}
