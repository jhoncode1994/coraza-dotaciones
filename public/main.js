// URL del backend
const apiInventario = 'https://coraza-api.onrender.com/api/inventario';

// Función para mostrar una sección y ocultar las otras
function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(seccion => {
    seccion.classList.add('oculto');
  });

  document.getElementById(id).classList.remove('oculto');

  // Si entramos a Inventario, cargamos la tabla
  if (id === 'inventario') {
    cargarInventario();
  }
}

// Función para cargar y mostrar inventario actual
async function cargarInventario() {
  try {
    const res = await fetch(apiInventario);
    const inventario = await res.json();

    const tabla = document.createElement('table');
    const encabezado = document.createElement('tr');

    encabezado.innerHTML = `
      <th>Elemento</th>
      <th>Cantidad</th>
    `;
    tabla.appendChild(encabezado);

    for (const [elemento, cantidad] of Object.entries(inventario)) {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${formatearNombreElemento(elemento)}</td>
        <td>${cantidad}</td>
      `;
      tabla.appendChild(fila);
    }

    const contenedor = document.getElementById('tablaInventario');
    contenedor.innerHTML = ''; // Limpiar contenido anterior
    contenedor.appendChild(tabla);
  } catch (error) {
    console.error('Error al cargar inventario:', error);
  }
}

// Función para enviar nuevo ingreso de dotación
document.getElementById('formIngresoDotacion').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const datos = {};

  for (const [clave, valor] of formData.entries()) {
    datos[clave] = parseInt(valor) || 0;
  }

  try {
    const res = await fetch(apiInventario, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (res.ok) {
      alert('Ingreso registrado exitosamente');
      e.target.reset();
      mostrarSeccion('inventario'); // Redirigir y actualizar inventario
    } else {
      const err = await res.text();
      alert('Error al registrar ingreso: ' + err);
    }
  } catch (error) {
    console.error('Error al enviar ingreso:', error);
    alert('Error de conexión con el servidor');
  }
});

// Utilidad para mostrar nombres más legibles
function formatearNombreElemento(clave) {
  const nombres = {
    kepis: 'Kepis',
    goleana: 'Goleana',
    pantalon: 'Pantalón',
    overol: 'Overol',
    camisa: 'Camisa',
    botas: 'Botas',
    corbata: 'Corbata',
    mona: 'Moña',
    riata: 'Riata',
    botasPantanera: 'Botas Pantanera'
  };
  return nombres[clave] || clave;
}

// Mostrar sección por defecto al cargar
mostrarSeccion('asociados');

const apiAsociados = 'https://coraza-api.onrender.com/api/asociados';
const apiEntregas = 'https://coraza-api.onrender.com/api/entregas';

// Guardar nuevo asociado
document.getElementById('formAsociado').addEventListener('submit', async (e) => {
  e.preventDefault();

  const cedula = document.getElementById('cedula').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const cargo = document.getElementById('cargo').value.trim();
  const turno = document.getElementById('turno').value.trim();

  const nuevoAsociado = { cedula, nombre, cargo, turno };

  try {
    const res = await fetch(apiAsociados, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoAsociado)
    });

    if (res.ok) {
      alert('Asociado guardado correctamente');
      e.target.reset();
      cargarAsociados();
    } else {
      const err = await res.text();
      alert('Error al guardar: ' + err);
    }
  } catch (err) {
    console.error('Error al guardar asociado:', err);
    alert('Error de conexión');
  }
});

// Cargar lista de asociados
async function cargarAsociados() {
  try {
    const res = await fetch(apiAsociados);
    const asociados = await res.json();

    const contenedor = document.getElementById('listaAsociados');
    contenedor.innerHTML = '';

    if (asociados.length === 0) {
      contenedor.innerHTML = '<p>No hay asociados registrados.</p>';
      return;
    }

    const tabla = document.createElement('table');
    const encabezado = document.createElement('tr');
    encabezado.innerHTML = `
      <th>Cédula</th>
      <th>Nombre</th>
      <th>Cargo</th>
      <th>Turno</th>
      <th>Acciones</th>
    `;
    tabla.appendChild(encabezado);

    asociados.forEach(asociado => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${asociado.cedula}</td>
        <td>${asociado.nombre}</td>
        <td>${asociado.cargo}</td>
        <td>${asociado.turno}</td>
        <td>
          <button class="btn" onclick="mostrarFormularioEntrega('${asociado.cedula}', '${asociado.nombre}')">Asignar Dotación</button>
          <button class="btn" onclick="verHistorial('${asociado.cedula}')">Historial</button>
        </td>
      `;
      tabla.appendChild(fila);
    });

    contenedor.appendChild(tabla);
  } catch (err) {
    console.error('Error al cargar asociados:', err);
  }
}

// Cargar asociados cuando se entra a la pestaña
document.querySelector("button[onclick=\"mostrarSeccion('asociados')\"]").addEventListener('click', cargarAsociados);
