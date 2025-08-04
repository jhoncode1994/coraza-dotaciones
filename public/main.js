const apiAsociados = 'https://coraza-api.onrender.com/api/asociados';
const apiInventario = 'https://coraza-api.onrender.com/api/inventario';
const apiEntregas = 'https://coraza-api.onrender.com/api/entregas';

// ========== NAVEGACIÓN ==========
function mostrarSeccion(id) {
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
mostrarSeccion('asociadosSection'); // Mostrar por defecto

// ========== ASOCIADOS ==========
document.getElementById('asociadoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cedula = document.getElementById('cedula').value;
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;

    const asociado = { cedula, nombre, telefono };

    const res = await fetch(apiAsociados, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asociado)
    });

    if (res.ok) {
        alert('Asociado registrado');
        e.target.reset();
        cargarAsociados();
    } else {
        alert('Error al registrar asociado');
    }
});

async function cargarAsociados() {
    const res = await fetch(apiAsociados);
    const asociados = await res.json();

    const tabla = document.getElementById('tablaAsociados');
    tabla.innerHTML = `
        <tr><th>Cédula</th><th>Nombre</th><th>Teléfono</th><th>Acciones</th></tr>
    `;

    asociados.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${a.cedula}</td>
            <td>${a.nombre}</td>
            <td>${a.telefono}</td>
            <td>
                <button onclick="mostrarFormularioEntrega('${a.cedula}', '${a.nombre}')">Asignar Dotación</button>
                <button onclick="mostrarHistorial('${a.cedula}')">Historial</button>
            </td>
        `;
        tabla.appendChild(tr);
    });
}
cargarAsociados();

// ========== INVENTARIO ==========
document.getElementById('ingresoDotacionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const elementos = ['kepis', 'goleana', 'pantalon', 'overol', 'camisa', 'botas', 'corbata', 'moña', 'riata', 'botas_pantanera'];

    for (let el of elementos) {
        const cantidad = parseInt(document.getElementById(el).value) || 0;
        if (cantidad > 0) {
            await fetch(apiInventario, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: el, cantidad })
            });
        }
    }

    alert('Dotación ingresada correctamente');
    e.target.reset();
    cargarInventario();
});

async function cargarInventario() {
    const res = await fetch(apiInventario);
    const inventario = await res.json();

    const tabla = document.getElementById('tablaInventario');
    tabla.innerHTML = `
        <tr><th>Elemento</th><th>Cantidad</th></tr>
    `;

    inventario.forEach(i => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i.nombre}</td><td>${i.cantidad}</td>`;
        tabla.appendChild(tr);
    });
}
cargarInventario();

// ========== ASIGNAR DOTACIÓN ==========
function mostrarFormularioEntrega(cedula, nombre) {
    mostrarSeccion('entregaSection');
    document.getElementById('nombreAsociadoEntrega').textContent = nombre;
    document.getElementById('entregaCedula').value = cedula;
}

document.getElementById('formularioEntrega').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cedula = document.getElementById('entregaCedula').value;
    const fecha = new Date().toISOString().split('T')[0];

    const elementos = ['kepis', 'goleana', 'pantalon', 'overol', 'camisa', 'botas', 'corbata', 'moña', 'riata', 'botas_pantanera'];
    const entregas = [];

    for (let el of elementos) {
        const cantidad = parseInt(document.getElementById(`entrega_${el}`).value) || 0;
        if (cantidad > 0) {
            entregas.push({ nombre: el, cantidad });
        }
    }

    for (let entrega of entregas) {
        await fetch(apiEntregas, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cedula, fecha, nombre: entrega.nombre, cantidad: entrega.cantidad })
        });
    }

    alert('Dotación asignada correctamente');
    e.target.reset();
    cargarInventario();
    mostrarSeccion('asociadosSection');
});

// ========== HISTORIAL ==========
async function mostrarHistorial(cedula) {
    mostrarSeccion('historialSection');

    const res = await fetch(`${apiEntregas}?cedula=${cedula}`);
    const entregas = await res.json();

    const tabla = document.getElementById('tablaHistorial');
    tabla.innerHTML = `<tr><th>Fecha</th><th>Elemento</th><th>Cantidad</th></tr>`;

    entregas.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${e.fecha}</td><td>${e.nombre}</td><td>${e.cantidad}</td>`;
        tabla.appendChild(tr);
    });
}
