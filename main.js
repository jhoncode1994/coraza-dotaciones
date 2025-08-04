const apiAsociados = 'https://coraza-api.onrender.com/api/asociados';
const apiInventario = 'https://coraza-api.onrender.com/api/inventario';
const apiEntregas = 'https://coraza-api.onrender.com/api/entregas';

let asociadosGlobal = [];
let inventarioGlobal = [];
let entregasGlobal = [];

document.addEventListener('DOMContentLoaded', async () => {
  await cargarAsociados();
  await cargarInventario();
  await cargarEntregas();
  cargarOpcionesAsociados();
  cargarOpcionesDotacion();

  document.getElementById('asociado-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cedula = document.getElementById('cedula').value.trim();
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const fecha_ingreso = document.getElementById('fecha_ingreso').value || null;

    if (!cedula || isNaN(cedula)) return alert('Cédula inválida');
    if (!nombres || !apellidos) return alert('Nombres y apellidos son obligatorios');

    const asociado = { cedula, nombres, apellidos, fecha_ingreso };
    const metodo = asociadosGlobal.some(a => a.cedula === cedula) ? 'PUT' : 'POST';
    const url = metodo === 'PUT' ? `${apiAsociados}/${cedula}` : apiAsociados;

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asociado)
      });
      if (!res.ok) throw new Error('Error al guardar asociado');
      e.target.reset();
      await cargarAsociados();
      cargarOpcionesAsociados();
    } catch (err) {
      console.error('Error guardando asociado:', err);
    }
  });

  document.getElementById('inventario-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tipo = document.getElementById('inv-tipo').value.trim();
    const descripcion = document.getElementById('inv-descripcion').value.trim();
    const estado = document.getElementById('inv-estado').value.trim();
    const id = document.getElementById('inv-id').value || null;

    if (!tipo || !descripcion || !estado) return alert('Todos los campos de inventario son obligatorios');

    const inventario = { id, tipo, descripcion, estado };
    const metodo = id ? 'PUT' : 'POST';
    const url = metodo === 'PUT' ? `${apiInventario}/${id}` : apiInventario;

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventario)
      });
      if (!res.ok) throw new Error('Error al guardar inventario');
      e.target.reset();
      document.getElementById('inv-id').value = '';
      await cargarInventario();
      cargarOpcionesDotacion();
    } catch (err) {
      console.error('Error guardando inventario:', err);
    }
  });

  document.getElementById('asignacion-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cedula = document.getElementById('asociado-select').value;
    const item_id = document.getElementById('producto-select').value;
    const cantidad = parseInt(document.getElementById('cantidad-asignada').value);
    const fecha_entrega = document.getElementById('fecha-asignacion').value || new Date().toISOString().split('T')[0];

    if (!cedula || !item_id || isNaN(cantidad) || cantidad <= 0) {
      return alert('Todos los campos son obligatorios y la cantidad debe ser mayor a 0');
    }

    const entrega = { cedula, item_id, cantidad, fecha_entrega };

    try {
      const res = await fetch(apiEntregas, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entrega)
      });
      if (!res.ok) throw new Error('Error al guardar entrega');
      e.target.reset();
      await cargarEntregas();
      await cargarInventario();
      mostrarMensajeAsignacion("Dotación asignada correctamente.");
    } catch (err) {
      console.error('Error guardando entrega:', err);
    }
  });

  // CORREGIDO: ingreso-form, no ingreso-bodega-form
  const ingresoForm = document.getElementById('ingreso-form');
  if (ingresoForm) {
    ingresoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const elementos = ['kepis', 'goleana', 'pantalon', 'overol', 'camisa', 'botas', 'corbata', 'moña', 'riata', 'botas_pantanera'];
      for (let nombre of elementos) {
        const cantidad = parseInt(ingresoForm.elements[nombre].value) || 0;
        if (cantidad > 0) {
          const item = inventarioGlobal.find(i => i.tipo.toLowerCase() === nombre.replace('_', ' '));
          if (item) {
            const nuevoTotal = (parseInt(item.estado) || 0) + cantidad;
            const actualizado = { ...item, estado: nuevoTotal.toString() };
            try {
              await fetch(`${apiInventario}/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(actualizado)
              });
            } catch (err) {
              console.error(`Error actualizando ${nombre}:`, err);
            }
          }
        }
      }
      alert('Dotación ingresada exitosamente');
      ingresoForm.reset();
      await cargarInventario();
    });
  }
});

function mostrarSeccion(seccionId) {
  document.querySelectorAll('.seccion').forEach(seccion => {
    seccion.style.display = 'none';
  });
  document.getElementById(`seccion-${seccionId}`).style.display = 'block';
}

// ---------------------- FUNCIONES AUXILIARES ----------------------

async function cargarAsociados() {
  try {
    const res = await fetch(apiAsociados);
    const data = await res.json();
    asociadosGlobal = data;
    const lista = document.getElementById('lista-asociados');
    if (lista) {
      lista.innerHTML = '';
      data.forEach(a => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${a.nombres} ${a.apellidos} (${a.cedula}) - Ingreso: ${a.fecha_ingreso || 'N/A'}
          <button onclick="editarAsociado('${a.cedula}')">🖊</button>
          <button onclick="eliminarAsociado('${a.cedula}')">🗑</button>
        `;
        lista.appendChild(li);
      });
    }
  } catch (err) {
    console.error('Error cargando asociados:', err);
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

async function eliminarAsociado(cedula) {
  if (!confirm(`¿Eliminar asociado ${cedula}?`)) return;
  try {
    const res = await fetch(`${apiAsociados}/${cedula}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar asociado');
    await cargarAsociados();
    cargarOpcionesAsociados();
  } catch (err) {
    console.error('Error eliminando asociado:', err);
  }
}

function cargarOpcionesAsociados() {
  const select = document.getElementById('asociado-select');
  if (!select) return;
  select.innerHTML = '<option value="">Seleccione un asociado</option>';
  asociadosGlobal.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.cedula;
    opt.textContent = `${a.nombres} ${a.apellidos} (${a.cedula})`;
    select.appendChild(opt);
  });
}

async function cargarInventario() {
  try {
    const res = await fetch(apiInventario);
    const data = await res.json();
    inventarioGlobal = data;
    const lista = document.getElementById('lista-inventario');
    if (lista) {
      lista.innerHTML = '';
      data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${item.tipo} - ${item.descripcion} (${item.estado})
          <button onclick="editarInventario(${item.id})">🖊</button>
          <button onclick="eliminarInventario(${item.id})">🗑</button>
        `;
        lista.appendChild(li);
      });
    }
    cargarOpcionesDotacion();
  } catch (err) {
    console.error('Error cargando inventario:', err);
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

async function eliminarInventario(id) {
  if (!confirm(`¿Eliminar ítem con ID ${id}?`)) return;
  try {
    const res = await fetch(`${apiInventario}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar ítem');
    await cargarInventario();
  } catch (err) {
    console.error('Error eliminando ítem:', err);
  }
}

function cargarOpcionesDotacion() {
  const select = document.getElementById('producto-select');
  if (!select) return;
  select.innerHTML = '<option value="">Seleccione un producto</option>';
  inventarioGlobal.forEach(i => {
    const opt = document.createElement('option');
    opt.value = i.id;
    opt.textContent = `${i.tipo} - ${i.descripcion}`;
    select.appendChild(opt);
  });
}

async function cargarEntregas() {
  try {
    const res = await fetch(apiEntregas);
    const data = await res.json();
    entregasGlobal = data;
    const lista = document.getElementById('lista-asignaciones');
    if (!lista) return;
    lista.innerHTML = '';
    data.forEach(e => {
      const asociado = asociadosGlobal.find(a => a.cedula === e.cedula);
      const item = inventarioGlobal.find(i => i.id === e.item_id);
      const li = document.createElement('li');
      li.textContent = `${e.fecha_entrega}: ${asociado?.nombres || ''} ${asociado?.apellidos || ''} recibió ${e.cantidad} x ${item?.tipo || ''} - ${item?.descripcion || ''}`;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error('Error cargando entregas:', err);
  }
}

function mostrarMensajeAsignacion(mensaje) {
  const div = document.getElementById('mensaje-asignacion');
  if (!div) return;
  div.textContent = mensaje;
  setTimeout(() => {
    div.textContent = '';
  }, 3000);
}
